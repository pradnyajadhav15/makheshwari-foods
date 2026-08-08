import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getLiveProducts } from "@/lib/liveProducts";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    // Stops people guessing codes.
    const limit = await rateLimit("coupon:ip", clientIp(req), 20, 60 * 60);
    if (!limit.allowed) {
      return NextResponse.json({ valid: false, error: "Too many attempts. Try again later." }, { status: 429 });
    }

    const { code, lineItems, phone } = await req.json();
    if (!code || !Array.isArray(lineItems) || !lineItems.length) {
      return NextResponse.json({ valid: false, error: "Add something to your cart first" }, { status: 400 });
    }

    const live = await getLiveProducts();
    let subtotal = 0;
    for (const l of lineItems) {
      const p = live.find((x) => x.slug === l.slug);
      if (p) subtotal += (p.price ?? 0) * Math.max(1, Math.min(20, Number(l.qty) || 1));
    }

    const { data, error } = await supabaseAdmin.rpc("validate_coupon", {
      p_code: String(code),
      p_subtotal: subtotal,
      p_phone: phone ? String(phone).replace(/\D/g, "").slice(-10) : null,
    });

    if (error) {
      console.error("Coupon preview failed", error);
      return NextResponse.json({ valid: false, error: "Could not check that code" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ valid: false, error: "Could not check that code" }, { status: 500 });
  }
}