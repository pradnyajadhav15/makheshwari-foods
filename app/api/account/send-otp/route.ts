import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const { phone } = await req.json();
  const num = String(phone || "").replace(/\D/g, "").slice(-10);

  if (!/^[6-9]\d{9}$/.test(num)) {
    return NextResponse.json({ error: "Enter a valid 10 digit mobile number" }, { status: 400 });
  }

  // Per number: stops one phone being spammed with codes.
  const perNumber = await rateLimit("otp:phone", num, 3, 15 * 60);
  if (!perNumber.allowed) {
    return NextResponse.json(
      { error: `Too many code requests. Try again in ${Math.ceil((perNumber.retryAfter || 900) / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(perNumber.retryAfter || 900) } }
    );
  }

  // Per IP: stops one attacker cycling through many numbers.
  const perIp = await rateLimit("otp:ip", clientIp(req), 10, 60 * 60);
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(perIp.retryAfter || 3600) } }
    );
  }

  const { data: existing } = await supabaseAdmin.from("orders").select("id").eq("phone", num).limit(1);
  const { data: alt } = await supabaseAdmin.from("orders").select("id").ilike("phone", `%${num}%`).limit(1);
  if (!existing?.length && !alt?.length) {
    return NextResponse.json({ error: "No orders found for this number" }, { status: 404 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();
  await supabaseAdmin.from("otp_codes").upsert({ phone: num, code, expires_at: expires, attempts: 0 });

  const dev = process.env.NODE_ENV !== "production";
  if (dev) console.log(`OTP for ${num}: ${code}`);

  return NextResponse.json({ ok: true, ...(dev ? { devCode: code } : {}) });
}