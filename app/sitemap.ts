import type { MetadataRoute } from "next";
import { products } from "@/lib/products";
import { recipes } from "@/lib/recipes";

const SITE = "https://makheshwarifoods.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0, freq: "daily" as const },
    { path: "/shop", priority: 0.9, freq: "daily" as const },
    { path: "/our-story", priority: 0.7, freq: "monthly" as const },
    { path: "/know-your-makhana", priority: 0.7, freq: "monthly" as const },
    { path: "/recipes", priority: 0.7, freq: "weekly" as const },
    { path: "/bulk-orders", priority: 0.6, freq: "monthly" as const },
    { path: "/contact", priority: 0.6, freq: "monthly" as const },
    { path: "/faq", priority: 0.5, freq: "monthly" as const },
    { path: "/shipping-returns", priority: 0.3, freq: "yearly" as const },
    { path: "/privacy", priority: 0.2, freq: "yearly" as const },
    { path: "/terms", priority: 0.2, freq: "yearly" as const },
  ];

  const staticEntries = staticRoutes.map((r) => ({
    url: SITE + r.path,
    lastModified: now,
    changeFrequency: r.freq,
    priority: r.priority,
  }));

  const productEntries = products.map((p) => ({
    url: SITE + "/shop/makhana/" + p.slug,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  const recipeEntries = recipes.map((r) => ({
    url: SITE + "/recipes/" + r.slug,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...productEntries, ...recipeEntries];
}