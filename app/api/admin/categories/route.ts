import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

/**
 * Categories CRUD. Returns `migrated: false` rather than an error when the
 * table does not exist yet, so the admin page can explain what to run
 * instead of showing a broken screen.
 */

const MISSING_TABLE = "42P01"; // undefined_table

function slugify(s: string) {
  return String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("name");

  if (error) {
    if (error.code === MISSING_TABLE) return NextResponse.json({ categories: [], migrated: false });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Product counts per category, so the admin can see what is in each.
  const { data: prods } = await supabaseAdmin.from("products").select("slug,category_id,in_stock");
  const counts: Record<string, { total: number; live: number }> = {};
  for (const p of prods || []) {
    const k = (p as { category_id: string | null }).category_id;
    if (!k) continue;
    counts[k] ||= { total: 0, live: 0 };
    counts[k].total += 1;
    if ((p as { in_stock: boolean }).in_stock) counts[k].live += 1;
  }

  const uncategorised = (prods || []).filter((p) => !(p as { category_id: string | null }).category_id).length;

  return NextResponse.json({ categories: data, counts, uncategorised, migrated: true });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const b = await req.json();
  const name = String(b.name || "").trim();
  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const slug = slugify(b.slug || name);
  if (!slug) return NextResponse.json({ error: "Could not derive a slug from that name" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("categories")
    .insert({
      slug,
      name,
      description: b.description || null,
      sort_order: Number(b.sort_order) || 0,
      active: b.active !== false,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "That slug already exists" }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ category: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, name, description, sort_order, active } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) patch.name = String(name).trim();
  if (description !== undefined) patch.description = description || null;
  if (sort_order !== undefined) patch.sort_order = Number(sort_order) || 0;
  if (active !== undefined) patch.active = Boolean(active);

  const { data, error } = await supabaseAdmin.from("categories").update(patch).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ category: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  // Products keep existing; the FK is ON DELETE SET NULL, so they simply
  // become uncategorised rather than disappearing from the shop.
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
