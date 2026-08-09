"use client";

import { useEffect, useState } from "react";

type Stats = {
  totalOrders: number;
  revenue: number;
  revenueToday: number;
  revenueWeek: number;
  revenueMonth: number;
  ordersToday: number;
  avgOrder: number;
  byStatus: Record<string, number>;
  needsAction: number;
  topProducts: { slug: string; name: string; units: number; revenue: number }[];
  customers: number;
  repeatCustomers: number;
  lowStock: { slug: string; name: string; stock: number; in_stock: boolean }[];
  pendingReviews: number;
  recent: { id: string; name: string; total: number; status: string; created_at: string; paymentId: string | null }[];
};

const rupee = (n: number) => "\u20B9" + (n ?? 0).toLocaleString("en-IN");

export default function AdminDashboard({ onJump }: { onJump?: (tab: string) => void }) {
  const [s, setS] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setS(d))
      .catch(() => {});
  }, []);

  if (!s) return <p className="text-ink/40 font-light">Loading</p>;

  const card = "bg-white rounded-[1.25rem] border border-ink/10 p-7";
  const eyebrow = "text-ink/45 text-[10px] tracking-tracksm uppercase";

  const maxUnits = s.topProducts[0]?.units || 1;

  return (
    <section className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className={card}>
          <p className={eyebrow}>Today</p>
          <p className="font-display text-4xl text-ink mt-3">{rupee(s.revenueToday)}</p>
          <p className="text-ink/50 text-sm mt-2 font-light">{s.ordersToday} order{s.ordersToday === 1 ? "" : "s"}</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>Last 7 days</p>
          <p className="font-display text-4xl text-ink mt-3">{rupee(s.revenueWeek)}</p>
          <p className="text-ink/50 text-sm mt-2 font-light">This month {rupee(s.revenueMonth)}</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>All time</p>
          <p className="font-display text-4xl text-ink mt-3">{rupee(s.revenue)}</p>
          <p className="text-ink/50 text-sm mt-2 font-light">{s.totalOrders} paid orders</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>Average order</p>
          <p className="font-display text-4xl text-ink mt-3">{rupee(s.avgOrder)}</p>
          <p className="text-ink/50 text-sm mt-2 font-light">
            {s.repeatCustomers} of {s.customers} reordered
          </p>
        </div>
      </div>

      {(s.needsAction > 0 || s.lowStock.length > 0 || s.pendingReviews > 0) && (
        <div className="bg-gold/10 border border-gold/40 rounded-[1.25rem] p-7">
          <p className="text-ink text-[10px] tracking-tracksm uppercase mb-5">Needs your attention</p>
          <div className="flex flex-wrap gap-3">
            {s.needsAction > 0 && (
              <button type="button" onClick={() => onJump?.("Orders")} className="bg-ink text-cream rounded-full px-6 py-3 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
                {s.needsAction} order{s.needsAction === 1 ? "" : "s"} to dispatch
              </button>
            )}
            {s.pendingReviews > 0 && (
              <button type="button" onClick={() => onJump?.("Reviews")} className="border border-ink/25 text-ink rounded-full px-6 py-3 text-[10px] tracking-tracksm uppercase hover:border-gold transition">
                {s.pendingReviews} review{s.pendingReviews === 1 ? "" : "s"} to approve
              </button>
            )}
            {s.lowStock.length > 0 && (
              <button type="button" onClick={() => onJump?.("Products")} className="border border-peri/50 text-peri rounded-full px-6 py-3 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition">
                {s.lowStock.length} product{s.lowStock.length === 1 ? "" : "s"} low on stock
              </button>
            )}
          </div>

          {s.lowStock.length > 0 && (
            <div className="mt-6 pt-5 border-t border-gold/30 space-y-2.5">
              {s.lowStock.map((p) => (
                <div key={p.slug} className="flex justify-between text-sm">
                  <span className="text-ink/70 font-light">{p.name}</span>
                  <span className={p.stock === 0 ? "text-peri" : "text-ink"}>
                    {p.stock === 0 ? "Sold out" : `${p.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-5">
        <div className={card}>
          <p className={eyebrow}>Selling best</p>
          {s.topProducts.length === 0 && <p className="text-ink/45 font-light mt-4">No sales yet.</p>}
          <div className="mt-5 space-y-5">
            {s.topProducts.map((p) => (
              <div key={p.slug}>
                <div className="flex justify-between items-baseline mb-2">
                  <span className="text-ink text-sm">{p.name}</span>
                  <span className="text-ink/50 text-xs">{p.units} packs &middot; {rupee(p.revenue)}</span>
                </div>
                <div className="h-1.5 bg-ink/8 rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${Math.round((p.units / maxUnits) * 100)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={card}>
          <p className={eyebrow}>Latest orders</p>
          {s.recent.length === 0 && <p className="text-ink/45 font-light mt-4">Nothing yet.</p>}
          <div className="mt-4 divide-y divide-ink/8">
            {s.recent.map((o) => (
              <div key={o.id} className="flex justify-between items-center py-3.5">
                <div className="min-w-0">
                  <p className="text-ink text-sm truncate">{o.name || "Unknown"}</p>
                  <p className="text-ink/40 text-xs mt-0.5">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="text-ink text-sm">{rupee(o.total)}</p>
                  <p className="text-ink/40 text-[10px] tracking-tracksm uppercase mt-0.5">{o.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={card}>
        <p className={eyebrow}>Every order by stage</p>
        <div className="flex flex-wrap gap-3 mt-5">
          {["pending", "paid", "packed", "shipped", "delivered", "cancelled", "failed"].map((st) => (
            <div key={st} className="border border-ink/15 rounded-xl px-5 py-3">
              <p className="text-ink/45 text-[10px] tracking-tracksm uppercase">{st}</p>
              <p className="font-display text-2xl text-ink mt-1">{s.byStatus[st] || 0}</p>
            </div>
          ))}
        </div>
        <p className="text-ink/40 text-xs mt-5 font-light">
          Pending means a checkout was started but never paid. Those are not counted in revenue.
        </p>
      </div>
    </section>
  );
}