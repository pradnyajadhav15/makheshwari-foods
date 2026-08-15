"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, EmptyState, DemoNotice } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { LineChart, BarChart, ShareBars, type Point } from "@/components/admin/Charts";
import { Icons } from "@/components/admin/Icons";
import { inr, inrShort, num } from "@/lib/admin/format";

type Order = { created_at: string; status: string; total: number; items: { name: string; qty: number; price: number }[] };
type Stats = {
  revenue: number; totalOrders: number; avgOrder: number; customers: number; repeatCustomers: number;
  topProducts: { slug: string; name: string; units: number; revenue: number }[];
  revenueMonth: number; revenueWeek: number; revenueToday: number;
};

const RANGES = [
  { key: "7d", label: "7 days", days: 7 },
  { key: "30d", label: "30 days", days: 30 },
  { key: "90d", label: "90 days", days: 90 },
  { key: "12m", label: "12 months", days: 0 },
] as const;

const EARNED = ["paid", "packed", "shipped", "delivered"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [range, setRange] = useState<(typeof RANGES)[number]["key"]>("30d");

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/admin/orders?page=1").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]).then(([s, o]) => { setStats(s); setOrders(o?.orders || []); });
  }, []);

  const cfg = RANGES.find((r) => r.key === range)!;
  const paid = (orders || []).filter((o) => EARNED.includes(o.status));

  const series: Point[] = [];
  const now = new Date();
  if (cfg.days) {
    for (let i = cfg.days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const rows = paid.filter((o) => new Date(o.created_at).toDateString() === d.toDateString());
      series.push({
        label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
        value: rows.reduce((n, o) => n + (Number(o.total) || 0), 0),
      });
    }
  } else {
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const rows = paid.filter((o) => {
        const od = new Date(o.created_at);
        return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
      });
      series.push({
        label: d.toLocaleDateString("en-IN", { month: "short" }),
        value: rows.reduce((n, o) => n + (Number(o.total) || 0), 0),
      });
    }
  }

  const top = stats?.topProducts ?? [];
  const repeatRate = stats?.customers ? Math.round((stats.repeatCustomers / stats.customers) * 100) : 0;
  const hasData = series.some((p) => p.value > 0);

  return (
    <>
      <PageHeader
        title="Analytics"
        subtitle="Computed from your paid orders"
        actions={
          <div className="flex rounded-lg border border-adminline overflow-hidden">
            {RANGES.map((r) => (
              <button
                key={r.key}
                type="button"
                onClick={() => setRange(r.key)}
                aria-pressed={range === r.key}
                className={`px-3 py-1.5 text-xs transition ${range === r.key ? "bg-ink text-cream" : "text-adminmuted hover:text-ink"}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!stats} label="Revenue" value={inrShort(stats?.revenue)} compare="all paid orders" />
        <StatCard loading={!stats} label="Orders" value={num(stats?.totalOrders)} compare="paid and beyond" />
        <StatCard loading={!stats} label="Avg order value" value={inr(stats?.avgOrder)} compare="per paid order" />
        <StatCard loading={!stats} label="Customers" value={num(stats?.customers)} compare="unique phone numbers" />
        <StatCard loading={!stats} label="Repeat rate" value={`${repeatRate}%`} compare={`${stats?.repeatCustomers ?? 0} bought twice or more`} />
      </div>

      <Card className="mb-5" title={`Revenue · last ${cfg.label}`}>
        {!orders ? (
          <div className="h-56" />
        ) : !hasData ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.analytics}</span>}
            title="No revenue in this range"
            body="Widen the range, or wait for the next paid order."
          />
        ) : cfg.days ? (
          <LineChart data={series} height={260} />
        ) : (
          <BarChart data={series} height={260} money />
        )}
        <p className="text-xs text-adminmuted mt-3">
          Based on the most recent 20 orders returned by the API. A dedicated reporting endpoint would widen this window.
        </p>
      </Card>

      <div className="grid xl:grid-cols-2 gap-5 mb-5">
        <Card title="Best-selling products">
          {!stats ? (
            <div className="h-40" />
          ) : top.length === 0 ? (
            <EmptyState title="No sales yet" body="Units sold will rank here." />
          ) : (
            <ShareBars rows={top.map((p) => ({ label: p.name, value: p.units, hint: `${p.units} units · ${inr(p.revenue)}` }))} />
          )}
        </Card>

        <Card title="Revenue by product">
          {!stats ? (
            <div className="h-40" />
          ) : top.length === 0 ? (
            <EmptyState title="No revenue yet" body="Revenue splits by product here." />
          ) : (
            <ShareBars money rows={top.map((p) => ({ label: p.name, value: p.revenue }))} />
          )}
        </Card>
      </div>

      <div className="grid xl:grid-cols-2 gap-5">
        <Card title="Period comparison">
          <dl className="divide-y divide-adminline text-sm">
            {[
              ["Today", stats?.revenueToday],
              ["Last 7 days", stats?.revenueWeek],
              ["This month", stats?.revenueMonth],
              ["All time", stats?.revenue],
            ].map(([label, v]) => (
              <div key={String(label)} className="flex justify-between py-3">
                <dt className="text-adminmuted">{label}</dt>
                <dd className="tabular-nums font-medium">{inr(Number(v) || 0)}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card title="Traffic & conversion">
          <DemoNotice what="Visits and conversion rate need an analytics source. Vercel Analytics is already installed on the storefront but its data is not exposed to this dashboard yet." />
          <dl className="divide-y divide-adminline text-sm mt-4">
            {[
              ["Sessions", "—"],
              ["Product page views", "—"],
              ["Add to cart rate", "—"],
              ["Checkout conversion", "—"],
            ].map(([label, v]) => (
              <div key={label} className="flex justify-between py-3">
                <dt className="text-adminmuted">{label}</dt>
                <dd className="tabular-nums text-adminmuted">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="adm-hint mt-3">
            Wiring the Vercel Analytics API, or a Plausible/GA property, would fill these in.
          </p>
        </Card>
      </div>
    </>
  );
}
