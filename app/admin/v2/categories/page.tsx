"use client";

import { useEffect, useState } from "react";
import { num } from "@/lib/admin/format";
import { Card, PageHeader, Badge, DemoNotice, TableSkeleton } from "@/components/admin/ui";


type Product = { slug: string; name: string; stock: number; in_stock: boolean };

/**
 * There is no `categories` table. The storefront hard-codes one live
 * category plus two "coming soon" chips in app/shop/page.tsx, so this
 * page reflects that reality and counts real products against it rather
 * than inventing a taxonomy the store does not have.
 */
const CATEGORIES = [
  { name: "Flavoured makhana", slug: "makhana", live: true, note: "The only category currently on sale" },
  { name: "Namkeen", slug: "namkeen", live: false, note: "Shown as “coming soon” on the shop page" },
  { name: "Gift boxes", slug: "gift-boxes", live: false, note: "Shown as “coming soon” on the shop page" },
];

export default function CategoriesPage() {
  const [products, setProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setProducts(d?.products || []))
      .catch(() => setProducts([]));
  }, []);

  const live = (products || []).filter((p) => p.in_stock).length;

  return (
    <>
      <PageHeader title="Categories" subtitle="How the shop page groups the catalogue" />

      <div className="mb-5">
        <DemoNotice what="There is no categories table in the database — the shop page lists one live category and two placeholders in code. Product counts below are real; the category list is not yet editable." />
      </div>

      <Card bodyClass="">
        {products === null ? (
          <TableSkeleton rows={3} cols={4} />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[40rem]">
              <thead>
                <tr>
                  <th>Category</th><th>Slug</th><th className="text-right">Products</th><th>Status</th><th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.map((c) => (
                  <tr key={c.slug}>
                    <td className="font-medium text-ink">{c.name}</td>
                    <td className="font-mono text-[0.7rem] text-adminmuted">{c.slug}</td>
                    <td className="text-right tabular-nums">
                      {c.live ? num(products.length) : 0}
                      {c.live && live !== products.length && (
                        <span className="block text-[0.68rem] text-adminmuted">{live} visible</span>
                      )}
                    </td>
                    <td><Badge tone={c.live ? "success" : "muted"}>{c.live ? "Live" : "Coming soon"}</Badge></td>
                    <td className="text-adminmuted">{c.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="mt-5" title="Making categories real">
        <p className="text-sm text-ink/80 leading-relaxed mb-3">
          To manage categories here, the database needs a <code className="font-mono text-xs">categories</code> table
          and a <code className="font-mono text-xs">category_id</code> column on <code className="font-mono text-xs">products</code>.
          That is a small migration, and it would also unlock category-scoped coupons, which the coupons
          screen currently cannot offer.
        </p>
        <ul className="text-sm text-adminmuted space-y-1.5 list-disc pl-5">
          <li>Create, rename, reorder and hide categories</li>
          <li>Assign products, with a category filter on the shop page</li>
          <li>Category-specific discounts</li>
          <li>Per-category revenue in Analytics</li>
        </ul>
        <p className="adm-hint mt-4">
          Say the word and I will write the migration and wire this screen to it.
        </p>
      </Card>
    </>
  );
}
