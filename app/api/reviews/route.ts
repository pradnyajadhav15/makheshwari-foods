import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { rateLimit, clientIp } from "@/lib/rateLimit";

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
    const limit = await rateLimit("reviews:ip", clientIp(req), 5, 24 * 60 * 60);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "You have left several reviews already. Thank you." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfter || 3600) } }
      );
    }

    const { product_slug, name, city, rating, body } = await req.json();
    if (!product_slug || !name || !rating || !body) {
      return NextResponse.json({ error: "Please fill all required fields" }, { status: 400 });
    }

    const text = String(body).trim();
    if (text.length < 10) {
      return NextResponse.json({ error: "Please write a little more" }, { status: 400 });
    }
    if (text.length > 2000) {
      return NextResponse.json({ error: "That review is too long" }, { status: 400 });
    }

    const stars = Number(rating);
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("reviews").insert({
      product_slug: String(product_slug).slice(0, 80),
      name: String(name).trim().slice(0, 80),
      city: city ? String(city).trim().slice(0, 80) : null,
      rating: stars,
      body: text,
      approved: false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}