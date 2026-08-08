import { supabaseAdmin } from "@/lib/supabase";
import { products as staticProducts, type Product } from "@/lib/products";

export type LiveProduct = Product & { images: string[]; stock: number; inStock: boolean; lowStock: boolean };

function fallbackImage(slug: string) {
  return `/products/${slug === "himalayan-pink-salt" ? "pink-salt" : slug}.jpg`;
}

const LOW_STOCK_AT = 5;

export async function getLiveProducts(): Promise<LiveProduct[]> {
  try {
    const { data } = await supabaseAdmin.from("products").select("*");
    return staticProducts.map((p) => {
      const row = data?.find((r) => r.slug === p.slug);
      const imgs = (row?.images as string[]) || [];
      const stock = row?.stock ?? 0;
      const hasRow = Boolean(row);

      // Stock is the source of truth. in_stock can only take a product
      // OFF sale, never put a zero-stock product back on.
      const inStock = hasRow ? stock > 0 && (row?.in_stock ?? true) : true;

      return {
        ...p,
        price: row?.price ?? p.price,
        mrp: row?.mrp ?? p.mrp,
        stock,
        inStock,
        lowStock: hasRow && stock > 0 && stock <= LOW_STOCK_AT,
        images: imgs.length ? imgs : [fallbackImage(p.slug)],
      };
    });
  } catch {
    return staticProducts.map((p) => ({
      ...p,
      images: [fallbackImage(p.slug)],
      stock: 0,
      inStock: true,
      lowStock: false,
    }));
  }
}

export async function getLiveProduct(slug: string) {
  const all = await getLiveProducts();
  return all.find((p) => p.slug === slug);
}