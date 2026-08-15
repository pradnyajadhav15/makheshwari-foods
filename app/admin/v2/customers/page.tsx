"use client";

import { useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Card, PageHeader, EmptyState, TableSkeleton, Modal, Badge, Pagination } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { inr, inrShort, num, shortDate, relative } from "@/lib/admin/format";

type Customer = {
  phone: string; name: string; email: string | null; city: string | null; state: string | null;
  orders: number; spent: number; first: string; last: string; units: number;
};

const PAGE = 20;

export default function CustomersPage() {
  const [rows, setRows] = useState<Customer[] | null>(null);
  const [repeat, setRepeat] = useState(0);
  const [q, setQ] = useState("");
  const [tier, setTier] = useState("all");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Customer | null>(null);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { setRows(d?.customers || []); setRepeat(d?.repeat || 0); })
      .catch(() => setRows([]));
  }, []);

  const view = useMemo(() => {
    let l = [...(rows || [])];
    const t = q.trim().toLowerCase();
    if (t) l = l.filter((c) => c.name.toLowerCase().includes(t) || c.phone.includes(t) || (c.email || "").toLowerCase().includes(t));
    if (tier === "repeat") l = l.filter((c) => c.orders > 1);
    if (tier === "new") l = l.filter((c) => c.orders === 1);
    if (tier === "vip") l = l.filter((c) => c.spent >= 2000);
    return l;
  }, [rows, q, tier]);

  useEffect(() => { setPage(1); }, [q, tier]);

  const slice = view.slice((page - 1) * PAGE, page * PAGE);
  const totalSpent = (rows || []).reduce((n, c) => n + c.spent, 0);
  const avgLifetime = rows?.length ? Math.round(totalSpent / rows.length) : 0;

  return (
    <>
      <PageHeader title="Customers" subtitle="Identified by phone number across all paid orders" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!rows} label="Total customers" value={num(rows?.length)} compare="with a paid order" />
        <StatCard loading={!rows} label="Repeat customers" value={num(repeat)} compare={rows?.length ? `${Math.round((repeat / rows.length) * 100)}% of the base` : ""} />
        <StatCard loading={!rows} label="Lifetime revenue" value={inrShort(totalSpent)} compare="all customers" />
        <StatCard loading={!rows} label="Avg lifetime value" value={inr(avgLifetime)} compare="per customer" />
      </div>

      <Card className="mb-4" bodyClass="p-3 sm:p-4">
        <div className="grid sm:grid-cols-[1.6fr_auto] gap-2">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adminmuted pointer-events-none">{Icons.search}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, phone or email" aria-label="Search customers" className="adm-input pl-9" />
          </div>
          <select value={tier} onChange={(e) => setTier(e.target.value)} aria-label="Filter" className="adm-select">
            <option value="all">All customers</option>
            <option value="repeat">Repeat buyers</option>
            <option value="new">First-time buyers</option>
            <option value="vip">Spent ₹2,000+</option>
          </select>
        </div>
      </Card>

      <Card bodyClass="">
        {rows === null ? (
          <TableSkeleton rows={8} cols={6} />
        ) : view.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.customers}</span>}
            title={rows.length === 0 ? "No customers yet" : "Nothing matches"}
            body={rows.length === 0 ? "Customers appear here once their first order is paid." : "Try a different search."}
          />
        ) : (
          <>
            <div className="adm-scroll">
              <table className="adm-table min-w-[48rem]">
                <thead>
                  <tr>
                    <th>Customer</th><th>Contact</th><th className="text-right">Orders</th>
                    <th className="text-right">Total spent</th><th>Last order</th><th>Status</th><th />
                  </tr>
                </thead>
                <tbody>
                  {slice.map((c) => (
                    <tr key={c.phone}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-ink text-cream text-[0.68rem] flex items-center justify-center shrink-0 font-medium">
                            {c.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <span className="font-medium text-ink block truncate">{c.name}</span>
                            <span className="text-[0.7rem] text-adminmuted">{[c.city, c.state].filter(Boolean).join(", ") || "—"}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-adminmuted">
                        <span className="block">{c.phone}</span>
                        <span className="block text-[0.7rem] truncate max-w-[12rem]">{c.email || "—"}</span>
                      </td>
                      <td className="text-right tabular-nums">{c.orders}</td>
                      <td className="text-right tabular-nums font-medium">{inr(c.spent)}</td>
                      <td className="text-adminmuted whitespace-nowrap">{relative(c.last)}</td>
                      <td>
                        <Badge tone={c.spent >= 2000 ? "success" : c.orders > 1 ? "info" : "muted"}>
                          {c.spent >= 2000 ? "VIP" : c.orders > 1 ? "Repeat" : "New"}
                        </Badge>
                      </td>
                      <td className="text-right">
                        <button type="button" onClick={() => setOpen(c)} className="adm-btn adm-btn-ghost adm-btn-sm">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={page} pageSize={PAGE} total={view.length} onPage={setPage} />
          </>
        )}
      </Card>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.name ?? ""} wide>
        {open && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-3 gap-3">
              <div className="adm-card adm-card-pad">
                <p className="adm-label">Orders</p>
                <p className="adm-num mt-2">{open.orders}</p>
              </div>
              <div className="adm-card adm-card-pad">
                <p className="adm-label">Total spent</p>
                <p className="adm-num mt-2">{inr(open.spent)}</p>
              </div>
              <div className="adm-card adm-card-pad">
                <p className="adm-label">Units bought</p>
                <p className="adm-num mt-2">{open.units}</p>
              </div>
            </div>

            <div className="adm-card adm-card-pad">
              <p className="adm-label mb-3">Contact</p>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">Phone</dt><dd>{open.phone}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">Email</dt><dd className="break-all text-right">{open.email || "—"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">Location</dt><dd>{[open.city, open.state].filter(Boolean).join(", ") || "—"}</dd></div>
              </dl>
            </div>

            <div className="adm-card adm-card-pad">
              <p className="adm-label mb-3">Activity</p>
              <dl className="text-sm space-y-2">
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">First order</dt><dd>{shortDate(open.first)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">Most recent</dt><dd>{shortDate(open.last)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-adminmuted">Avg order value</dt><dd>{inr(Math.round(open.spent / Math.max(1, open.orders)))}</dd></div>
              </dl>
              <p className="adm-hint mt-3">
                Full order history per customer needs the orders API to accept a phone filter.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <a href={`https://wa.me/91${open.phone}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">WhatsApp</a>
              {open.email && <a href={`mailto:${open.email}`} className="adm-btn adm-btn-ghost">Email</a>}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
