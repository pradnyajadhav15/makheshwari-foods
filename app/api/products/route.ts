import { NextResponse } from "next/server";
import { getLiveProducts } from "@/lib/liveProducts";

export const revalidate = 60;

export async function GET() {
  try {
    const live = await getLiveProducts();
    return NextResponse.json({
      products: live.map((p) => ({
        slug: p.slug,
        price: p.price,
        mrp: p.mrp,
        stock: p.stock,
        inStock: p.inStock,
      })),
    });
  } catch (e) {
    console.error("Live products fetch failed", e);
    return NextResponse.json({ products: [] });
  }
}