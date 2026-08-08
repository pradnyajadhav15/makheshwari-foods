import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("coupons").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupons: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const code = String(b.code || "").trim().toUpperCase();
  const type = b.type === "flat" ? "flat" : "percent";
  const value = Number(b.value);

  if (!code) return NextResponse.json({ error: "Code is required" }, { status: 400 });
  if (!/^[A-Z0-9_-]{3,24}$/.test(code)) {
    return NextResponse.json({ error: "Use 3 to 24 letters, numbers, dash or underscore" }, { status: 400 });
  }
  if (!value || value <= 0) return NextResponse.json({ error: "Value must be more than zero" }, { status: 400 });
  if (type === "percent" && value > 100) {
    return NextResponse.json({ error: "Percent cannot be more than 100" }, { status: 400 });
  }

  const { data: exists } = await supabaseAdmin.from("coupons").select("id").ilike("code", code).maybeSingle();
  if (exists) return NextResponse.json({ error: "That code already exists" }, { status: 409 });

  const { data, error } = await supabaseAdmin
    .from("coupons")
    .insert({
      code,
      type,
      value,
      min_order: b.min_order ? Number(b.min_order) : 0,
      max_discount: b.max_discount ? Number(b.max_discount) : null,
      usage_limit: b.usage_limit ? Number(b.usage_limit) : null,
      per_phone_limit: b.per_phone_limit === null || b.per_phone_limit === "" ? null : Number(b.per_phone_limit ?? 1),
      expires_at: b.expires_at || null,
      active: b.active !== false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  if (!b.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (b.active !== undefined) patch.active = Boolean(b.active);
  if (b.value !== undefined) patch.value = Number(b.value);
  if (b.min_order !== undefined) patch.min_order = Number(b.min_order) || 0;
  if (b.max_discount !== undefined) patch.max_discount = b.max_discount === "" || b.max_discount === null ? null : Number(b.max_discount);
  if (b.usage_limit !== undefined) patch.usage_limit = b.usage_limit === "" || b.usage_limit === null ? null : Number(b.usage_limit);
  if (b.expires_at !== undefined) patch.expires_at = b.expires_at || null;

  const { data, error } = await supabaseAdmin.from("coupons").update(patch).eq("id", b.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ coupon: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const { error } = await supabaseAdmin.from("coupons").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}