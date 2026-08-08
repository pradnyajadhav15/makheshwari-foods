import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabaseAdmin.from("products").select("*").order("weight_g");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ products: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, price, mrp, weight_g, stock } = await req.json();
  if (!name || !price || !weight_g) {
    return NextResponse.json({ error: "Name, price and weight are required" }, { status: 400 });
  }

  const slug = String(name).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  if (!slug) return NextResponse.json({ error: "Invalid name" }, { status: 400 });

  const { data: exists } = await supabaseAdmin.from("products").select("slug").eq("slug", slug).maybeSingle();
  if (exists) return NextResponse.json({ error: "A product with that name already exists" }, { status: 409 });

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({ slug, name, price: Number(price), mrp: mrp ? Number(mrp) : null, weight_g: Number(weight_g), stock: Number(stock) || 0, in_stock: true, images: [] })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, name, price, mrp, weight_g, stock, in_stock } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) patch.name = name;
  if (price !== undefined) patch.price = Number(price);
  if (mrp !== undefined) patch.mrp = mrp === null || mrp === "" ? null : Number(mrp);
  if (weight_g !== undefined) patch.weight_g = Number(weight_g);
  if (stock !== undefined) patch.stock = Number(stock);
  if (in_stock !== undefined) patch.in_stock = Boolean(in_stock);

  const { data, error } = await supabaseAdmin.from("products").update(patch).eq("slug", slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ product: data });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await req.json();
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const { data: row } = await supabaseAdmin.from("products").select("images").eq("slug", slug).single();
  const images = (row?.images as string[]) || [];
  const paths = images.map((u) => u.split("/products/").pop()).filter(Boolean) as string[];
  if (paths.length) await supabaseAdmin.storage.from("products").remove(paths);

  const { error } = await supabaseAdmin.from("products").delete().eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}