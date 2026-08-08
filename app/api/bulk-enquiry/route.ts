import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  try {
    const perIp = await rateLimit("bulk-enquiry:ip", clientIp(req), 5, 60 * 60);
    if (!perIp.allowed) {
      return NextResponse.json(
        { error: "Too many enquiries. Please try again later." },
        { status: 429, headers: { "Retry-After": String(perIp.retryAfter || 3600) } }
      );
    }

    const b = await req.json();
    if (!b.name || !b.phone) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { error } = await supabaseAdmin.from("bulk_enquiries").insert({
      name: String(b.name).slice(0, 120),
      company: b.company ? String(b.company).slice(0, 160) : null,
      city: b.city ? String(b.city).slice(0, 100) : null,
      phone: String(b.phone).slice(0, 20),
      business_type: b.type ? String(b.type).slice(0, 80) : null,
      product: b.product ? String(b.product).slice(0, 120) : null,
      quantity: b.qty ? String(b.qty).slice(0, 60) : null,
      notes: b.notes ? String(b.notes).slice(0, 2000) : null,
    });
    if (error) console.error("Bulk enquiry save failed", error);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}