import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  let q = supabaseAdmin.from("reviews").select("*").eq("approved", true).order("created_at", { ascending: false }).limit(50);
  if (slug) q = q.eq("product_slug", slug);
  const { data, error } = await q;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ reviews: data });
}

export async function POST(req: Request) {
  try {
    const { product_slug, name, city, rating, body } = await req.json();
    if (!product_slug || !name || !rating || !body) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 });
    }
    if (String(body).length < 10) {
      return NextResponse.json({ error: "Please write a little more" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      product_slug, name, city: city || null, rating: Number(rating), body, approved: false,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}