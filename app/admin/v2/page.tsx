"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { StatCard } from "@/components/admin/StatCard";
import { LineChart, BarChart, type Point } from "@/components/admin/Charts";
import { Icons } from "@/components/admin/Icons";
import {
  Card, PageHeader, StatusBadge, EmptyState, TableSkeleton, useToast, Badge,
} from "@/components/admin/ui";
import { inr, inrShort, num, relative, LOW_STOCK_THRESHOLD } from "@/lib/admin/format";

const BASE = "/admin/v2";

type Stats = {
  totalOrders: number; revenue: number; revenueToday: number; revenueWeek: number;
  revenueMonth: number; ordersToday: number; avgOrder: number;
  byStatus: Record<string, number>; needsAction: number;
  topProducts: { slug: string; name: string; units: number; revenue: number }[];
  customers: number; repeatCustomers: number;
  lowStock: { slug: string; name: string; stock: number; price: number }[];
  pendingReviews: number;
  recent: { id: string; name: string; total: number; status: string; created_at: string; paymentId: string }[];
};

type OrderRow = {
  id: string; created_at: string; razorpay_payment_id: string; status: string;
  customer_name: string; total: number;
  items: { name: string; qty: number; price: number }[];
};

const EMPTY_STATS: Stats = {
  totalOrders: 0, revenue: 0, revenueToday: 0, revenueWeek: 0, revenueMonth: 0,
  ordersToday: 0, avgOrder: 0, byStatus: {}, needsAction: 0, topProducts: [],
  customers: 0, repeatCustomers: 0, lowStock: [], pendingReviews: 0, recent: [],
};

const RANGES = [
  { key: "today", label: "Today" },
  { key: "7d", label: "7 days" },
  { key: "30d", label: "30 days" },
  { key: "12m", label: "12 months" },
] as const;
type RangeKey = (typeof RANGES)[number]["key"];

const METRICS = [
  { key: "revenue", label: "Revenue" },
  { key: "orders", label: "Orders" },
  { key: "aov", label: "Avg order value" },
] as const;
type MetricKey = (typeof METRICS)[number]["key"];

/** Buckets the real order list into chart points for the chosen range. */
function bucket(orders: OrderRow[], range: RangeKey, metric: MetricKey): Point[] {
  const EARNED = ["paid", "packed", "shipped", "delivered"];
  const paid = orders.filter((o) => EARNED.includes(o.status));
  const now = new Date();
  const out: Point[] = [];

  const push = (label: string, rows: OrderRow[]) => {
    const rev = rows.reduce((n, o) => n + (Number(o.total) || 0), 0);
    const value = metric === "revenue" ? rev : metric === "orders" ? rows.length : rows.length ? Math.round(rev / rows.length) : 0;
    out.push({ label, value });
  };

  if (range === "today") {
    for (let h = 0; h < 24; h += 3) {
      const rows = paid.filter((o) => {
        const d = new Date(o.created_at);
        return d.toDateString() === now.toDateString() && d.getHours() >= h && d.getHours() < h + 3;
      });
      push(`${String(h).padStart(2, "0")}h`, rows);
    }
    return out;
  }

  const days = range === "7d" ? 7 : range === "30d" ? 30 : 0;
  if (days) {
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const rows = paid.filter((o) => new Date(o.created_at).toDateString() === d.toDateString());
      push(d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), rows);
    }
    return out;
  }

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const rows = paid.filter((o) => {
      const od = new Date(o.created_at);
      return od.getFullYear() === d.getFullYear() && od.getMonth() === d.getMonth();
    });
    push(d.toLocaleDateString("en-IN", { month: "short" }), rows);
  }
  return out;
}

export default function AdminHome() {
  const { push } = useToast();
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<OrderRow[] | null>(null);
  const [range, setRange] = useState<RangeKey>("30d");
  const [metric, setMetric] = useState<MetricKey>("revenue");
  const [restocking, setRestocking] = useState<string | null>(null);

  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    const [s, o] = await Promise.all([
      fetch("/api/admin/stats").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/admin/orders?page=1").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    /* Never leave the skeletons spinning: a failed call resolves to a
       fully zeroed view plus a visible error, not an indefinite loading
       state. Every numeric field must be present or the comparison
       strings below render "undefined". */
    setFailed(!s && !o);
    setStats(s ?? EMPTY_STATS);
    setOrders(o?.orders ?? []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const restock = async (slug: string, to: number) => {
    setRestocking(slug);
    const r = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, stock: to }),
    });
    setRestocking(null);
    if (!r.ok) { push("Could not update stock", "danger"); return; }
    push(`Stock set to ${to}`);
    load();
  };

  const chartData = orders ? bucket(orders, range, metric) : [];
  const loading = !stats;

  const products = stats?.topProducts ?? [];
  const totalUnits = products.reduce((n, p) => n + p.units, 0);

  return (
    <>
      {failed && (
        <div className="adm-card adm-card-pad mb-5 border-perideep/40" role="alert">
          <p className="text-sm text-perideep font-medium">Could not reach the store data.</p>
          <p className="text-sm text-adminmuted mt-1">
            The admin API did not respond. Check the Supabase credentials in your environment, then{" "}
            <button type="button" onClick={load} className="text-golddeep underline">retry</button>.
          </p>
        </div>
      )}

      <PageHeader
        title="Dashboard"
        subtitle="Live figures from your store"
        actions={
          <>
            <Link href={`${BASE}/orders`} className="adm-btn adm-btn-ghost">
              <span className="w-4 h-4 block">{Icons.orders}</span>
              All orders
            </Link>
            <Link href={`${BASE}/products`} className="adm-btn adm-btn-primary">
              <span className="w-4 h-4 block">{Icons.plus}</span>
              Add product
            </Link>
          </>
        }
      />

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-5">
        <StatCard
          loading={loading}
          label="Total revenue"
          value={inrShort(stats?.revenue)}
          compare={stats ? `${inr(stats.revenueMonth)} this month` : undefined}
          spark={chartData.slice(-8).map((p) => p.value)}
        />
        <StatCard
          loading={loading}
          label="Total orders"
          value={num(stats?.totalOrders)}
          compare={stats ? `${stats.ordersToday} today` : undefined}
          href={`${BASE}/orders`}
        />
        <StatCard
          loading={loading}
          label="Avg order value"
          value={inr(stats?.avgOrder)}
          compare="across paid orders"
        />
        <StatCard
          loading={loading}
          label="Customers"
          value={num(stats?.customers)}
          compare={stats ? `${stats.repeatCustomers} repeat` : undefined}
          href={`${BASE}/customers`}
        />
        <StatCard
          loading={loading}
          label="Needs action"
          value={num(stats?.needsAction)}
          compare="paid or packed"
          tone={stats?.needsAction ? "warn" : "neutral"}
          href={`${BASE}/orders?status=paid`}
        />
        <StatCard
          loading={loading}
          label="Low stock"
          value={num(stats?.lowStock?.length)}
          compare={`at or below ${LOW_STOCK_THRESHOLD}`}
          tone={stats?.lowStock?.length ? "danger" : "neutral"}
          href={`${BASE}/inventory`}
        />
      </div>

      {/* Revenue analytics */}
      <Card
        className="mb-5"
        title="Revenue analytics"
        action={
          <div className="flex flex-wrap items-center gap-1.5">
            <div className="flex rounded-lg border border-adminline overflow-hidden">
              {METRICS.map((m) => (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setMetric(m.key)}
                  aria-pressed={metric === m.key}
                  className={`px-2.5 py-1.5 text-xs transition ${
                    metric === m.key ? "bg-ink text-cream" : "text-adminmuted hover:text-ink"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <div className="flex rounded-lg border border-adminline overflow-hidden">
              {RANGES.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  aria-pressed={range === r.key}
                  className={`px-2.5 py-1.5 text-xs transition ${
                    range === r.key ? "bg-ink text-cream" : "text-adminmuted hover:text-ink"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>
        }
      >
        {!orders ? (
          <div className="h-60 flex items-center justify-center text-sm text-adminmuted">Loading…</div>
        ) : chartData.every((p) => p.value === 0) ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.analytics}</span>}
            title="No paid orders in this range"
            body="Pick a wider range, or come back once orders start landing."
          />
        ) : range === "12m" ? (
          <BarChart data={chartData} money={metric !== "orders"} />
        ) : (
          <LineChart data={chartData} money={metric !== "orders"} />
        )}
        <p className="text-xs text-adminmuted mt-3">
          Only paid, packed, shipped and delivered orders count — pending rows are abandoned checkouts.
        </p>
      </Card>

      <div className="grid xl:grid-cols-[1.5fr_1fr] gap-5 mb-5">
        {/* Recent orders */}
        <Card
          title="Recent orders"
          bodyClass=""
          action={
            <Link href={`${BASE}/orders`} className="text-xs text-golddeep hover:underline">
              View all
            </Link>
          }
        >
          {!orders ? (
            <TableSkeleton rows={5} cols={5} />
          ) : orders.length === 0 ? (
            <EmptyState
              icon={<span className="w-5 h-5 block">{Icons.orders}</span>}
              title="No orders yet"
              body="Orders will appear here as soon as the first payment lands."
            />
          ) : (
            <div className="adm-scroll">
              <table className="adm-table min-w-[42rem]">
                <thead>
                  <tr>
                    <th>Order</th><th>Customer</th><th>Items</th>
                    <th>Date</th><th className="text-right">Amount</th><th>Status</th><th />
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 7).map((o) => (
                    <tr key={o.id}>
                      <td className="font-mono text-[0.7rem] text-adminmuted">
                        {(o.razorpay_payment_id || o.id).slice(-10)}
                      </td>
                      <td className="font-medium text-ink">{o.customer_name || "—"}</td>
                      <td className="text-adminmuted">
                        {(o.items || []).reduce((n, i) => n + i.qty, 0)} item
                        {(o.items || []).reduce((n, i) => n + i.qty, 0) === 1 ? "" : "s"}
                      </td>
                      <td className="text-adminmuted whitespace-nowrap">{relative(o.created_at)}</td>
                      <td className="text-right tabular-nums font-medium">{inr(o.total)}</td>
                      <td><StatusBadge status={o.status} /></td>
                      <td className="text-right">
                        <Link
                          href={`${BASE}/orders?q=${encodeURIComponent(o.razorpay_payment_id || "")}`}
                          className="text-xs text-golddeep hover:underline whitespace-nowrap"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Top selling */}
        <Card title="Top selling products" bodyClass="p-4 sm:p-5">
          {loading ? (
            <TableSkeleton rows={4} cols={2} />
          ) : products.length === 0 ? (
            <EmptyState
              icon={<span className="w-5 h-5 block">{Icons.products}</span>}
              title="No sales yet"
              body="Once orders come in, your best sellers rank here."
            />
          ) : (
            <ul className="space-y-4">
              {products.slice(0, 5).map((p, i) => (
                <li key={p.slug} className="flex items-center gap-3">
                  <span className="w-11 h-11 rounded-lg bg-white border border-adminline shrink-0 overflow-hidden flex items-center justify-center">
                    <Image
                      src={`/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                      alt=""
                      width={44}
                      height={44}
                      className="w-full h-full object-contain p-1"
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                    <p className="text-xs text-adminmuted tabular-nums">
                      {num(p.units)} units · {inr(p.revenue)}
                    </p>
                    <div className="h-1.5 rounded-full bg-sandsoft mt-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gold"
                        style={{ width: `${totalUnits ? Math.max(4, (p.units / totalUnits) * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                  <span className="adm-label shrink-0">#{i + 1}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Low stock */}
      <Card
        title="Low stock alert"
        bodyClass=""
        action={
          <Link href={`${BASE}/inventory`} className="text-xs text-golddeep hover:underline">
            Inventory
          </Link>
        }
      >
        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : !stats?.lowStock?.length ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.check}</span>}
            title="Everything is stocked"
            body={`No product is at or below ${LOW_STOCK_THRESHOLD} units.`}
          />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[38rem]">
              <thead>
                <tr>
                  <th>Product</th><th>Current stock</th><th>Minimum</th><th>Status</th><th className="text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {stats.lowStock.map((p) => (
                  <tr key={p.slug}>
                    <td className="font-medium text-ink">{p.name}</td>
                    <td className="tabular-nums">{p.stock}</td>
                    <td className="tabular-nums text-adminmuted">{LOW_STOCK_THRESHOLD}</td>
                    <td>
                      <Badge tone={p.stock <= 0 ? "danger" : "warn"}>
                        {p.stock <= 0 ? "Out of stock" : "Low"}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        onClick={() => restock(p.slug, (p.stock || 0) + 25)}
                        disabled={restocking === p.slug}
                        className="adm-btn adm-btn-ghost adm-btn-sm"
                      >
                        {restocking === p.slug ? "Saving…" : "+25 stock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}
