import { NextResponse } from "next/server";
import { getLiveProducts } from "@/lib/liveProducts";

export async function GET() {
  const all = await getLiveProducts();
  return NextResponse.json({
    products: all.map((p) => ({ slug: p.slug, name: p.name, price: p.price, weight_g: p.weightG, images: p.images })),
  });
}