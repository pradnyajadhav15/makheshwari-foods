import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.name || !b.phone) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const { error } = await supabaseAdmin.from("bulk_enquiries").insert({
      name: b.name,
      company: b.company || null,
      city: b.city || null,
      phone: b.phone,
      business_type: b.type || null,
      product: b.product || null,
      quantity: b.qty || null,
      notes: b.notes || null,
    });

    if (error) console.error("Bulk enquiry save failed", error);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}