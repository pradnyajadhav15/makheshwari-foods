"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Card, PageHeader, EmptyState, TableSkeleton, useToast, Badge, Modal, DemoNotice } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { BarChart } from "@/components/admin/Charts";
import { inr, num, stockLabel, stockTone, LOW_STOCK_THRESHOLD } from "@/lib/admin/format";

type Product = {
  slug: string; name: string; price: number; stock: number; in_stock: boolean;
  weight_g: number; images: string[] | null;
};

export default function InventoryPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Product[] | null>(null);
  const [sold, setSold] = useState<Record<string, number>>({});
  const [adjust, setAdjust] = useState<Product | null>(null);
  const [delta, setDelta] = useState("");
  const [mode, setMode] = useState<"add" | "set">("add");
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [p, s] = await Promise.all([
      fetch("/api/admin/products").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    setRows(p?.products || []);
    if (s?.topProducts) {
      const m: Record<string, number> = {};
      for (const t of s.topProducts) m[t.slug] = t.units;
      setSold(m);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!adjust) return;
    const n = Number(delta);
    if (!Number.isFinite(n)) { push("Enter a number", "danger"); return; }
    const next = mode === "add" ? Math.max(0, adjust.stock + n) : Math.max(0, n);
    setBusy(true);
    const r = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug: adjust.slug, stock: next }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not update stock", "danger"); return; }
    push(`${adjust.name} stock set to ${next}`);
    setAdjust(null);
    setDelta("");
    load();
  };

  const list = rows || [];
  const totalUnits = list.reduce((n, p) => n + (p.stock || 0), 0);
  const stockValue = list.reduce((n, p) => n + (p.stock || 0) * (p.price || 0), 0);
  const low = list.filter((p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD);
  const out = list.filter((p) => p.stock <= 0);

  const chart = list.map((p) => ({ label: p.name.split(" ")[0], value: p.stock || 0 }));

  return (
    <>
      <PageHeader title="Inventory" subtitle="Live stock levels straight from the products table" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!rows} label="Units in stock" value={num(totalUnits)} compare="across all products" />
        <StatCard loading={!rows} label="Stock value" value={inr(stockValue)} compare="at selling price" />
        <StatCard loading={!rows} label="Low stock" value={num(low.length)} compare={`at or below ${LOW_STOCK_THRESHOLD}`} tone={low.length ? "warn" : "neutral"} />
        <StatCard loading={!rows} label="Out of stock" value={num(out.length)} compare="needs restocking" tone={out.length ? "danger" : "neutral"} />
      </div>

      <div className="grid xl:grid-cols-[1.4fr_1fr] gap-5 mb-5">
        <Card title="Stock on hand">
          {!rows ? (
            <div className="h-56" />
          ) : list.length === 0 ? (
            <EmptyState title="No products" body="Add a product to track its stock." />
          ) : (
            <BarChart data={chart} height={220} />
          )}
        </Card>

        <Card title="Restock history">
          <DemoNotice what="Stock changes are applied immediately but not journalled — there is no stock_movements table yet, so this list is illustrative." />
          <ul className="mt-4 space-y-3">
            {[
              { p: "Peri Peri", qty: "+50", who: "Sonu", when: "2 days ago" },
              { p: "Garden Mint", qty: "+30", who: "Sonu", when: "5 days ago" },
              { p: "Himalayan Pink Salt", qty: "+40", who: "Sonu", when: "1 week ago" },
            ].map((h) => (
              <li key={h.p} className="flex items-center justify-between gap-3 text-sm border-b border-adminline pb-3 last:border-0">
                <div>
                  <span className="text-ink">{h.p}</span>
                  <span className="block text-[0.7rem] text-adminmuted">{h.who} · {h.when}</span>
                </div>
                <span className="text-mintdeep tabular-nums font-medium">{h.qty}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card title="Stock by product" bodyClass="">
        {rows === null ? (
          <TableSkeleton rows={5} cols={6} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.inventory}</span>}
            title="Nothing to track"
            body="Add products and their stock will appear here."
          />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[46rem]">
              <thead>
                <tr>
                  <th>Product</th><th className="text-right">In stock</th><th className="text-right">Sold</th>
                  <th className="text-right">Minimum</th><th className="text-right">Stock value</th>
                  <th>Status</th><th className="text-right">Adjust</th>
                </tr>
              </thead>
              <tbody>
                {list.map((p) => (
                  <tr key={p.slug}>
                    <td>
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-lg bg-white border border-adminline shrink-0 overflow-hidden flex items-center justify-center">
                          <Image
                            src={p.images?.[0] || `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                            alt="" width={36} height={36} className="w-full h-full object-contain p-0.5"
                          />
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium text-ink block truncate">{p.name}</span>
                          <span className="text-[0.7rem] text-adminmuted">{p.weight_g} g</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-right tabular-nums font-medium">{num(p.stock)}</td>
                    <td className="text-right tabular-nums text-adminmuted">{num(sold[p.slug] || 0)}</td>
                    <td className="text-right tabular-nums text-adminmuted">{LOW_STOCK_THRESHOLD}</td>
                    <td className="text-right tabular-nums">{inr((p.stock || 0) * (p.price || 0))}</td>
                    <td><Badge tone={stockTone(p.stock)}>{stockLabel(p.stock)}</Badge></td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => { setAdjust(p); setDelta(""); setMode("add"); }}
                        className="adm-btn adm-btn-ghost adm-btn-sm"
                      >
                        Adjust
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={Boolean(adjust)}
        onClose={() => setAdjust(null)}
        title={`Adjust stock · ${adjust?.name ?? ""}`}
        footer={
          <>
            <button type="button" onClick={() => setAdjust(null)} className="adm-btn adm-btn-ghost" disabled={busy}>Cancel</button>
            <button type="button" onClick={save} className="adm-btn adm-btn-primary" disabled={busy || delta === ""}>
              {busy ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {adjust && (
          <>
            <p className="text-sm text-adminmuted mb-4">
              Currently <strong className="text-ink font-medium tabular-nums">{adjust.stock}</strong> units in stock.
            </p>

            <div className="flex gap-1.5 mb-4">
              {(["add", "set"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  aria-pressed={mode === m}
                  className={`px-3 py-1.5 rounded-full text-xs border transition ${
                    mode === m ? "bg-ink text-cream border-ink" : "border-adminline text-adminmuted hover:text-ink"
                  }`}
                >
                  {m === "add" ? "Add / remove" : "Set exact"}
                </button>
              ))}
            </div>

            <label className="adm-field-label" htmlFor="adj">
              {mode === "add" ? "Change by (use a minus for removals)" : "New stock level"}
            </label>
            <input
              id="adj"
              inputMode="numeric"
              value={delta}
              onChange={(e) => setDelta(e.target.value)}
              placeholder={mode === "add" ? "e.g. 25 or -3" : "e.g. 60"}
              className="adm-input"
              autoFocus
            />

            {delta !== "" && Number.isFinite(Number(delta)) && (
              <p className="adm-hint">
                New level:{" "}
                <strong className="text-ink">
                  {mode === "add" ? Math.max(0, adjust.stock + Number(delta)) : Math.max(0, Number(delta))}
                </strong>{" "}
                units
              </p>
            )}
          </>
        )}
      </Modal>
    </>
  );
}
