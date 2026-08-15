"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import {
  Card, PageHeader, EmptyState, TableSkeleton, useToast, ConfirmModal, Badge,
} from "@/components/admin/ui";
import { inr, num, shortDate, stockLabel, stockTone, LOW_STOCK_THRESHOLD } from "@/lib/admin/format";
import ProductForm from "@/components/admin/ProductForm";

export type Product = {
  slug: string; name: string; price: number; mrp: number | null;
  weight_g: number; stock: number; in_stock: boolean;
  images: string[] | null; updated_at?: string;
};

type SortKey = "name" | "price" | "stock" | "updated";

export default function ProductsPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Product[] | null>(null);
  const [q, setQ] = useState("");
  const [stockFilter, setStockFilter] = useState("all");
  const [sort, setSort] = useState<SortKey>("name");
  const [editing, setEditing] = useState<Product | null | "new">(null);
  const [confirm, setConfirm] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);
  const [units, setUnits] = useState<Record<string, number>>({});

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([
      fetch("/api/admin/products").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    setRows(p?.products || []);
    if (s?.topProducts) {
      const m: Record<string, number> = {};
      for (const t of s.topProducts) m[t.slug] = t.units;
      setUnits(m);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const view = useMemo(() => {
    let list = [...(rows || [])];
    const term = q.trim().toLowerCase();
    if (term) list = list.filter((p) => p.name.toLowerCase().includes(term) || p.slug.includes(term));
    if (stockFilter === "low") list = list.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
    if (stockFilter === "out") list = list.filter((p) => p.stock <= 0);
    if (stockFilter === "in") list = list.filter((p) => p.stock > LOW_STOCK_THRESHOLD);
    list.sort((a, b) => {
      if (sort === "price") return (b.price || 0) - (a.price || 0);
      if (sort === "stock") return (a.stock || 0) - (b.stock || 0);
      if (sort === "updated") return new Date(b.updated_at || 0).getTime() - new Date(a.updated_at || 0).getTime();
      return a.name.localeCompare(b.name);
    });
    return list;
  }, [rows, q, stockFilter, sort]);

  const toggleLive = async (p: Product) => {
    const r = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: p.slug, in_stock: !p.in_stock }),
    });
    if (!r.ok) { push("Could not update", "danger"); return; }
    push(p.in_stock ? `${p.name} hidden from the shop` : `${p.name} is live`);
    load();
  };

  const duplicate = async (p: Product) => {
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: `${p.name} copy`, price: p.price, mrp: p.mrp, weight_g: p.weight_g, stock: 0 }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { push(d.error || "Could not duplicate", "danger"); return; }
    push("Duplicated as a draft with 0 stock");
    load();
  };

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: confirm.slug }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not delete", "danger"); return; }
    push(`${confirm.name} deleted`);
    setConfirm(null);
    load();
  };

  return (
    <>
      <PageHeader
        title="Products"
        subtitle={rows ? `${rows.length} product${rows.length === 1 ? "" : "s"} in the catalogue` : "Manage your catalogue"}
        actions={
          <button type="button" onClick={() => setEditing("new")} className="adm-btn adm-btn-primary">
            <span className="w-4 h-4 block">{Icons.plus}</span>
            Add product
          </button>
        }
      />

      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.6fr_auto_auto] gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adminmuted pointer-events-none">
              {Icons.search}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name"
              aria-label="Search products"
              className="adm-input pl-9"
            />
          </div>
          <select value={stockFilter} onChange={(e) => setStockFilter(e.target.value)} aria-label="Filter by stock" className="adm-select">
            <option value="all">All stock levels</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} aria-label="Sort" className="adm-select">
            <option value="name">Sort: name</option>
            <option value="price">Sort: price (high first)</option>
            <option value="stock">Sort: stock (low first)</option>
            <option value="updated">Sort: recently updated</option>
          </select>
        </div>
      </Card>

      <Card bodyClass="">
        {rows === null ? (
          <TableSkeleton rows={6} cols={7} />
        ) : view.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.products}</span>}
            title={rows.length === 0 ? "No products yet" : "Nothing matches"}
            body={rows.length === 0 ? "Add your first product to start selling." : "Try a different search or filter."}
            action={
              rows.length === 0 ? (
                <button type="button" onClick={() => setEditing("new")} className="adm-btn adm-btn-primary">Add product</button>
              ) : (
                <button type="button" onClick={() => { setQ(""); setStockFilter("all"); }} className="adm-btn adm-btn-ghost">Clear filters</button>
              )
            }
          />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[56rem]">
              <thead>
                <tr>
                  <th>Product</th><th>Slug</th><th className="text-right">Price</th>
                  <th className="text-right">Stock</th><th className="text-right">Sold</th>
                  <th>Status</th><th>Updated</th><th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {view.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-10 h-10 rounded-lg bg-white border border-adminline shrink-0 overflow-hidden flex items-center justify-center">
                          <Image
                            src={p.images?.[0] || `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                            alt=""
                            width={40}
                            height={40}
                            className="w-full h-full object-contain p-0.5"
                          />
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium text-ink block truncate">{p.name}</span>
                          <span className="text-[0.7rem] text-adminmuted">{p.weight_g} g</span>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-[0.7rem] text-adminmuted">{p.slug}</td>
                    <td className="text-right tabular-nums">
                      {inr(p.price)}
                      {p.mrp && p.mrp > p.price && (
                        <span className="block text-[0.68rem] text-adminmuted line-through">{inr(p.mrp)}</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums">{num(p.stock)}</td>
                    <td className="text-right tabular-nums text-adminmuted">{num(units[p.slug] || 0)}</td>
                    <td>
                      <div className="flex flex-col gap-1 items-start">
                        <Badge tone={stockTone(p.stock)}>{stockLabel(p.stock)}</Badge>
                        {!p.in_stock && <Badge tone="muted">Hidden</Badge>}
                      </div>
                    </td>
                    <td className="text-adminmuted whitespace-nowrap">{shortDate(p.updated_at)}</td>
                    <td>
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => setEditing(p)} title="Edit" aria-label={`Edit ${p.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-ink hover:bg-sandsoft transition">
                          <span className="w-4 h-4 block">{Icons.edit}</span>
                        </button>
                        <button type="button" onClick={() => duplicate(p)} title="Duplicate" aria-label={`Duplicate ${p.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-ink hover:bg-sandsoft transition">
                          <span className="w-4 h-4 block">{Icons.copy}</span>
                        </button>
                        <button type="button" onClick={() => toggleLive(p)} title={p.in_stock ? "Hide from shop" : "Show in shop"} aria-label={p.in_stock ? `Hide ${p.name}` : `Show ${p.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-ink hover:bg-sandsoft transition">
                          <span className="w-4 h-4 block">{p.in_stock ? Icons.eye : Icons.eyeOff}</span>
                        </button>
                        <button type="button" onClick={() => setConfirm(p)} title="Delete" aria-label={`Delete ${p.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-perideep hover:bg-perideep/10 transition">
                          <span className="w-4 h-4 block">{Icons.trash}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editing !== null && (
        <ProductForm
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        confirmLabel="Delete product"
        title={`Delete ${confirm?.name ?? ""}?`}
        body="This removes the product and its uploaded images permanently. Orders that already contain it are unaffected. This cannot be undone."
      />
    </>
  );
}
