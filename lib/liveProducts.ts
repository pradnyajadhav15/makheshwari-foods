import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts, type Product } from "@/lib/products";

export type LiveProduct = Product & { images: string[]; stock: number; inStock: boolean };

function fallbackImage(slug: string) {
  return `/products/${slug === "himalayan-pink-salt" ? "pink-salt" : slug}.jpg`;
}

export async function getLiveProducts(): Promise<LiveProduct[]> {
  try {
    const { data } = await supabaseAdmin.from("products").select("*");
    return staticProducts.map((p) => {
      const row = data?.find((r) => r.slug === p.slug);
      const imgs = (row?.images as string[]) || [];
      return {
        ...p,
        price: row?.price ?? p.price,
        mrp: row?.mrp ?? p.mrp,
        stock: row?.stock ?? 0,
        inStock: row?.in_stock ?? true,
        images: imgs.length ? imgs : [fallbackImage(p.slug)],
      };
    });
  } catch {
    return staticProducts.map((p) => ({ ...p, images: [fallbackImage(p.slug)], stock: 0, inStock: true }));
  }
}

export async function getLiveProduct(slug: string) {
  const all = await getLiveProducts();
  return all.find((p) => p.slug === slug);
}