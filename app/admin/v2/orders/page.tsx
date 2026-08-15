"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icons } from "@/components/admin/Icons";
import {
  Card, PageHeader, StatusBadge, EmptyState, TableSkeleton, Pagination, useToast, Modal, Badge,
} from "@/components/admin/ui";
import { inr, dateTime, relative, SETTABLE_STATUSES, statusMeta } from "@/lib/admin/format";

type Order = {
  id: string; created_at: string; paid_at: string | null;
  razorpay_payment_id: string; razorpay_order_id?: string; status: string;
  customer_name: string; email: string; phone: string; address_line: string;
  city: string; state: string; pincode: string;
  total: number; subtotal?: number; shipping?: number; discount?: number; coupon_code?: string | null;
  items: { name: string; qty: number; price: number }[];
  notes: string | null; tracking_id: string | null; courier: string | null;
  archived?: boolean;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "paid", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrdersInner() {
  const params = useSearchParams();
  const { push } = useToast();

  const [rows, setRows] = useState<Order[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState(params.get("q") || "");
  const [status, setStatus] = useState(params.get("status") || "all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [archived, setArchived] = useState(false);
  const [open, setOpen] = useState<Order | null>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const load = useCallback(
    async (p = 1) => {
      setErr("");
      setRows(null);
      const sp = new URLSearchParams({ page: String(p) });
      if (q) sp.set("q", q);
      if (status !== "all") sp.set("status", status);
      if (from) sp.set("from", from);
      if (to) sp.set("to", to);
      if (archived) sp.set("archived", "1");
      try {
        const r = await fetch(`/api/admin/orders?${sp}`);
        const d = await r.json().catch(() => ({}));
        if (!r.ok) { setErr(d.error || "Could not load orders"); setRows([]); return; }
        setRows(d.orders || []);
        setTotal(d.total || 0);
        setPage(d.page || p);
      } catch {
        setErr("Could not reach the server. Check your connection and retry.");
        setRows([]);
      }
    },
    [q, status, from, to, archived]
  );

  useEffect(() => { load(1); }, [load]);

  const update = async (o: Order, patch: Record<string, unknown>, msg: string) => {
    setSaving(true);
    const r = await fetch(`/api/admin/orders/${o.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) { push(d.error || "Update failed", "danger"); return; }
    push(msg);
    if (d.order && open?.id === o.id) setOpen(d.order);
    load(page);
  };

  const counts = rows?.length ?? 0;

  return (
    <>
      <PageHeader
        title="Orders"
        subtitle={total ? `${total.toLocaleString("en-IN")} order${total === 1 ? "" : "s"}` : "Manage and fulfil orders"}
        actions={
          <a href="/api/admin/export" className="adm-btn adm-btn-ghost">
            <span className="w-4 h-4 block">{Icons.download}</span>
            Export CSV
          </a>
        }
      />

      {/* Filters */}
      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatus(f.key)}
              aria-pressed={status === f.key}
              className={`px-3 py-1.5 rounded-full text-xs transition border ${
                status === f.key
                  ? "bg-ink text-cream border-ink"
                  : "border-adminline text-adminmuted hover:text-ink hover:border-ink/40"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-[1.5fr_auto_auto_auto] gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adminmuted pointer-events-none">
              {Icons.search}
            </span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load(1)}
              placeholder="Name, phone, email or payment ID"
              aria-label="Search orders"
              className="adm-input pl-9"
            />
          </div>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="adm-input" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="adm-input" />
          <label className="flex items-center gap-2 text-xs text-adminmuted px-2">
            <input type="checkbox" checked={archived} onChange={(e) => setArchived(e.target.checked)} className="accent-ink w-4 h-4" />
            Archived
          </label>
        </div>
      </Card>

      <Card bodyClass="">
        {err && <p className="text-perideep text-sm p-4" role="alert">{err}</p>}

        {rows === null ? (
          <TableSkeleton rows={8} cols={6} />
        ) : counts === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.orders}</span>}
            title="No orders match"
            body="Try clearing the filters or widening the date range."
            action={
              <button
                type="button"
                onClick={() => { setQ(""); setStatus("all"); setFrom(""); setTo(""); setArchived(false); }}
                className="adm-btn adm-btn-ghost"
              >
                Clear filters
              </button>
            }
          />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table min-w-[52rem]">
                <thead>
                  <tr>
                    <th>Order ID</th><th>Customer</th><th>Products</th><th>Date</th>
                    <th className="text-right">Amount</th><th>Payment</th><th>Status</th><th />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => {
                    return (
                      <tr key={o.id}>
                        <td className="font-mono text-[0.7rem] text-adminmuted whitespace-nowrap">
                          {(o.razorpay_payment_id || o.id).slice(-12)}
                        </td>
                        <td>
                          <span className="font-medium text-ink block">{o.customer_name || "—"}</span>
                          <span className="text-[0.7rem] text-adminmuted">{o.city || ""}</span>
                        </td>
                        <td className="text-adminmuted max-w-[14rem] truncate">
                          {(o.items || []).map((i) => `${i.name} ×${i.qty}`).join(", ") || "—"}
                        </td>
                        <td className="text-adminmuted whitespace-nowrap">{relative(o.created_at)}</td>
                        <td className="text-right tabular-nums font-medium">{inr(o.total)}</td>
                        <td>
                          <Badge tone={o.razorpay_payment_id ? "success" : "muted"}>
                            {o.razorpay_payment_id ? "Paid" : "Unpaid"}
                          </Badge>
                        </td>
                        <td><StatusBadge status={o.status} /></td>
                        <td className="text-right">
                          <button
                            type="button"
                            onClick={() => setOpen(o)}
                            className="adm-btn adm-btn-ghost adm-btn-sm"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={20} total={total} onPage={(p) => load(p)} />
          </>
        )}
      </Card>

      <OrderDrawer
        order={open}
        onClose={() => setOpen(null)}
        onUpdate={update}
        saving={saving}
      />
    </>
  );
}

function OrderDrawer({
  order,
  onClose,
  onUpdate,
  saving,
}: {
  order: Order | null;
  onClose: () => void;
  onUpdate: (o: Order, patch: Record<string, unknown>, msg: string) => void;
  saving: boolean;
}) {
  const [tracking, setTracking] = useState("");
  const [courier, setCourier] = useState("");
  const [notify, setNotify] = useState(true);

  useEffect(() => {
    setTracking(order?.tracking_id || "");
    setCourier(order?.courier || "");
  }, [order]);

  if (!order) return null;

  const units = (order.items || []).reduce((n, i) => n + i.qty, 0);
  const lineTotal = (order.items || []).reduce((n, i) => n + i.price * i.qty, 0);

  const timeline = [
    { key: "paid", at: order.paid_at || order.created_at },
    { key: "packed", at: null },
    { key: "shipped", at: null },
    { key: "delivered", at: null },
  ];
  const reached = SETTABLE_STATUSES.indexOf(order.status as never);

  return (
    <Modal
      open={Boolean(order)}
      onClose={onClose}
      wide
      title={`Order ${(order.razorpay_payment_id || order.id).slice(-12)}`}
      footer={
        <>
          <button
            type="button"
            onClick={() => onUpdate(order, { archived: !order.archived }, order.archived ? "Unarchived" : "Archived")}
            className="adm-btn adm-btn-ghost"
            disabled={saving}
          >
            {order.archived ? "Unarchive" : "Archive"}
          </button>
          <button type="button" onClick={onClose} className="adm-btn adm-btn-ghost">Close</button>
        </>
      }
    >
      <div className="grid md:grid-cols-2 gap-5">
        {/* Customer + address */}
        <div className="adm-card adm-card-pad">
          <p className="adm-label mb-3">Customer</p>
          <p className="font-medium text-ink">{order.customer_name || "—"}</p>
          <p className="text-sm text-adminmuted mt-1 break-words">{order.email || "—"}</p>
          <p className="text-sm text-adminmuted">{order.phone || "—"}</p>

          <p className="adm-label mt-5 mb-2">Shipping address</p>
          <p className="text-sm text-ink/85 leading-relaxed">
            {order.address_line}
            <br />
            {order.city}, {order.state} {order.pincode}
          </p>

          {order.notes && (
            <>
              <p className="adm-label mt-5 mb-2">Delivery notes</p>
              <p className="text-sm text-ink/85">{order.notes}</p>
            </>
          )}
        </div>

        {/* Money */}
        <div className="adm-card adm-card-pad">
          <p className="adm-label mb-3">Items · {units} unit{units === 1 ? "" : "s"}</p>
          <ul className="space-y-2 text-sm">
            {(order.items || []).map((i, n) => (
              <li key={n} className="flex justify-between gap-3">
                <span className="text-ink/85">{i.name} ×{i.qty}</span>
                <span className="tabular-nums shrink-0">{inr(i.price * i.qty)}</span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 pt-4 border-t border-adminline space-y-1.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-adminmuted">Subtotal</dt>
              <dd className="tabular-nums">{inr(order.subtotal ?? lineTotal)}</dd>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-mintdeep">
                <dt>Discount {order.coupon_code ? `(${order.coupon_code})` : ""}</dt>
                <dd className="tabular-nums">−{inr(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-adminmuted">Shipping</dt>
              <dd className="tabular-nums">{Number(order.shipping) ? inr(order.shipping) : "Free"}</dd>
            </div>
            <div className="flex justify-between pt-2 border-t border-adminline font-medium text-base">
              <dt>Total</dt>
              <dd className="tabular-nums">{inr(order.total)}</dd>
            </div>
          </dl>

          <p className="text-xs text-adminmuted mt-3">
            Razorpay · {order.razorpay_payment_id || "no payment id"} · GST inclusive
          </p>

          {/* The invoice endpoint was only reachable from the old admin. */}
          <a
            href={`/api/admin/invoice/${order.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="adm-btn adm-btn-ghost adm-btn-sm mt-3"
          >
            <span className="w-3.5 h-3.5 block">{Icons.download}</span>
            Download GST invoice
          </a>
        </div>
      </div>

      {/* Timeline */}
      <div className="adm-card adm-card-pad mt-5">
        <p className="adm-label mb-4">Order timeline</p>
        <ol className="flex items-start">
          {timeline.map((t, i) => {
            const done = reached >= i && order.status !== "cancelled";
            return (
              <li key={t.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center text-center">
                  <span className={`w-3.5 h-3.5 rounded-full shrink-0 ${done ? "bg-gold" : "bg-adminline"}`} />
                  <span className={`text-[0.62rem] mt-1.5 whitespace-nowrap ${done ? "text-ink" : "text-adminmuted"}`}>
                    {statusMeta(t.key).label}
                  </span>
                </div>
                {i < timeline.length - 1 && (
                  <span className={`h-px flex-1 mx-1 mt-[-0.9rem] ${reached > i ? "bg-gold" : "bg-adminline"}`} />
                )}
              </li>
            );
          })}
        </ol>
        {order.status === "cancelled" && (
          <p className="text-perideep text-sm mt-4">This order was cancelled and refunded.</p>
        )}
        <p className="text-xs text-adminmuted mt-4">Placed {dateTime(order.created_at)}</p>
      </div>

      {/* Fulfilment */}
      <div className="adm-card adm-card-pad mt-5">
        <p className="adm-label mb-3">Update status</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {SETTABLE_STATUSES.map((s) => (
            <button
              key={s}
              type="button"
              disabled={saving || order.status === s}
              onClick={() =>
                onUpdate(order, { status: s, tracking_id: tracking, courier, notify }, `Marked ${statusMeta(s).label.toLowerCase()}`)
              }
              className={`px-3 py-1.5 rounded-full text-xs border transition ${
                order.status === s
                  ? "bg-ink text-cream border-ink cursor-default"
                  : "border-adminline text-adminmuted hover:text-ink hover:border-ink/40"
              }`}
            >
              {statusMeta(s).label}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="adm-field-label" htmlFor="trk">Tracking ID</label>
            <input id="trk" value={tracking} onChange={(e) => setTracking(e.target.value)} className="adm-input" placeholder="e.g. DTDC1234567" />
          </div>
          <div>
            <label className="adm-field-label" htmlFor="cour">Courier</label>
            <input id="cour" value={courier} onChange={(e) => setCourier(e.target.value)} className="adm-input" placeholder="e.g. Delhivery" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-adminmuted mt-3">
          <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-ink w-4 h-4" />
          Email the customer when the status changes
        </label>
      </div>
    </Modal>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<TableSkeleton rows={8} cols={6} />}>
      <OrdersInner />
    </Suspense>
  );
}
