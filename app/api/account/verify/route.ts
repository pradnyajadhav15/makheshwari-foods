import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const { phone, code } = await req.json();
  const num = String(phone || "").replace(/\D/g, "").slice(-10);

  // The per-row attempts counter resets when a new OTP is issued,
  // so an IP limit is what actually stops brute forcing.
  const perIp = await rateLimit("otp-verify:ip", clientIp(req), 20, 60 * 60);
  if (!perIp.allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(perIp.retryAfter || 3600) } }
    );
  }

  const { data: row } = await supabaseAdmin.from("otp_codes").select("*").eq("phone", num).maybeSingle();
  if (!row) return NextResponse.json({ error: "Request a new code" }, { status: 400 });
  if (row.attempts >= 5) return NextResponse.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
  if (new Date(row.expires_at) < new Date()) return NextResponse.json({ error: "Code expired" }, { status: 400 });

  if (row.code !== String(code)) {
    await supabaseAdmin.from("otp_codes").update({ attempts: row.attempts + 1 }).eq("phone", num);
    return NextResponse.json({ error: "Wrong code" }, { status: 400 });
  }

  await supabaseAdmin.from("otp_codes").delete().eq("phone", num);

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id,created_at,razorpay_payment_id,status,customer_name,address_line,city,state,pincode,items,subtotal,shipping,total,tracking_id,courier")
    .ilike("phone", `%${num}%`)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ok: true, orders: orders || [] });
}