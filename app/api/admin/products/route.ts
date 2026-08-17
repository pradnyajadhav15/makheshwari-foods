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

/**
 * Columns added by supabase/01_product_fields.sql and 02_categories.sql.
 * They are applied separately from the core columns so that, if the
 * migration has not been run yet, saving a product still succeeds with the
 * fields that do exist rather than failing outright.
 */
const EXTENDED_TEXT = [
  "sku", "brand", "short_description", "description", "ingredients",
  "allergens", "shelf_life", "storage", "batch_number",
  "meta_title", "meta_description",
] as const;

const EXTENDED_NUM = ["low_stock_threshold", "cost_price", "gst_rate"] as const;

const MISSING_COLUMN = "42703"; // undefined_column

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { slug, name, price, mrp, weight_g, stock, in_stock } = body;
  if (!slug) return NextResponse.json({ error: "Missing slug" }, { status: 400 });

  const core: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (name !== undefined) core.name = name;
  if (price !== undefined) core.price = Number(price);
  if (mrp !== undefined) core.mrp = mrp === null || mrp === "" ? null : Number(mrp);
  if (weight_g !== undefined) core.weight_g = Number(weight_g);
  if (stock !== undefined) core.stock = Number(stock);
  if (in_stock !== undefined) core.in_stock = Boolean(in_stock);

  const extended: Record<string, unknown> = {};
  for (const k of EXTENDED_TEXT) {
    if (body[k] !== undefined) extended[k] = body[k] === "" ? null : body[k];
  }
  for (const k of EXTENDED_NUM) {
    if (body[k] !== undefined) extended[k] = body[k] === "" || body[k] === null ? null : Number(body[k]);
  }
  if (body.category_id !== undefined) extended.category_id = body.category_id || null;
  if (body.nutrition !== undefined) extended.nutrition = body.nutrition;

  const attempt = async (patch: Record<string, unknown>) =>
    supabaseAdmin.from("products").update(patch).eq("slug", slug).select().single();

  const { data, error } = await attempt({ ...core, ...extended });

  // Migration not run yet — save what the schema can take and say so.
  if (error?.code === MISSING_COLUMN && Object.keys(extended).length) {
    const retry = await attempt(core);
    if (retry.error) return NextResponse.json({ error: retry.error.message }, { status: 500 });
    return NextResponse.json({
      product: retry.data,
      warning:
        "Saved the core fields only. The extended product columns do not exist yet — run supabase/01_product_fields.sql and supabase/02_categories.sql.",
    });
  }

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