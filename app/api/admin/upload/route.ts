import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

const MAX = 5 * 1024 * 1024;
const OK = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file") as File | null;
  const slug = String(form.get("slug") || "");

  if (!file || !slug) return NextResponse.json({ error: "Missing file or slug" }, { status: 400 });
  if (!OK.includes(file.type)) return NextResponse.json({ error: "Use JPG, PNG or WebP" }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "File must be under 5 MB" }, { status: 400 });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${slug}/${Date.now()}.${ext}`;

  const { error: upErr } = await supabaseAdmin.storage
    .from("products")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (upErr) return NextResponse.json({ error: upErr.message }, { status: 500 });

  const { data: pub } = supabaseAdmin.storage.from("products").getPublicUrl(path);

  const { data: row } = await supabaseAdmin.from("products").select("images").eq("slug", slug).single();
  const images = [...((row?.images as string[]) || []), pub.publicUrl];

  const { error: dbErr } = await supabaseAdmin.from("products").update({ images }).eq("slug", slug);
  if (dbErr) return NextResponse.json({ error: dbErr.message }, { status: 500 });

  return NextResponse.json({ url: pub.publicUrl, images });
}

export async function DELETE(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, url } = await req.json();
  if (!slug || !url) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const path = url.split("/products/").pop();
  if (path) await supabaseAdmin.storage.from("products").remove([path]);

  const { data: row } = await supabaseAdmin.from("products").select("images").eq("slug", slug).single();
  const images = ((row?.images as string[]) || []).filter((u) => u !== url);
  await supabaseAdmin.from("products").update({ images }).eq("slug", slug);

  return NextResponse.json({ images });
}
export async function PUT(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug, images } = await req.json();
  if (!slug || !Array.isArray(images)) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const { error } = await supabaseAdmin.from("products").update({ images }).eq("slug", slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ images });
}