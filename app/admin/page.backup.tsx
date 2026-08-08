"use client";
import { waLink, mailLink } from "@/lib/messages";
import AdminProducts from "@/components/AdminProducts";
import AdminEnquiries from "@/components/AdminEnquiries";
import AdminReviews from "@/components/AdminReviews";

import { useEffect, useState } from "react";

type Order = {
  id: string; created_at: string; razorpay_payment_id: string; status: string;
  customer_name: string; email: string; phone: string; address_line: string;
  city: string; state: string; pincode: string; total: number;
  items: { name: string; qty: number; price: number }[]; notes: string | null;
};

type Stats = { totalOrders: number; revenue: number; byStatus: Record<string, number> };

const STATUSES = ["paid", "packed", "shipped", "delivered", "cancelled"] as const;

const STATUS_STYLE: Record<string, string> = {
  paid: "bg-gold/25 text-ink",
  packed: "bg-sand text-ink",
  shipped: "bg-salt/35 text-ink",
  delivered: "bg-mint/30 text-ink",
  cancelled: "bg-peri/20 text-peri",
};

const PAGE_SIZE = 20;

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [orders, setOrders] = useState<Order[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [stats, setStats] = useState<Stats | null>(null);
  const [listErr, setListErr] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const loadStats = async () => {
    const r = await fetch("/api/admin/stats");
    if (r.ok) setStats(await r.json());
  };

  const loadOrders = async (p: number) => {
    setListErr("");
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    const r = await fetch(`/api/admin/orders?${params}`);
    const d = await r.json();
    if (!r.ok) { setListErr(d.error || "Failed to load orders"); return; }
    setOrders(d.orders);
    setTotal(d.total);
    setPage(d.page);
  };

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.authed))
      .catch(() => setAuthed(false));
  }, []);

  useEffect(() => {
    if (!authed) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only dashboard behind a password gate; fetching on mount is the standard pattern here
    loadStats();
  }, [authed]);

  useEffect(() => {
    if (!authed) return;
    const t = setTimeout(() => loadOrders(1), q ? 350 : 0);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, q, status]);

  const login = async () => {
    setBusy(true); setLoginErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { setLoginErr(d.error || "Failed"); return; }
    setAuthed(true);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setOrders(null);
    setPw("");
  };

  const updateStatus = async (id: string, next: string) => {
    setUpdating(id);
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (r.ok) {
      const { order } = await r.json();
      setOrders((prev) => prev && prev.map((o) => (o.id === id ? order : o)));
      loadStats();
    }
    setUpdating(null);
  };

  if (authed === null) {
    return <section className="bg-cream px-6 py-32 text-center text-ink/40">Loading&hellip;</section>;
  }

  if (!authed) {
    return (
      <section className="bg-cream px-6 py-32">
        <div className="max-w-sm mx-auto bg-white rounded-[1.5rem] border border-ink/10 p-9">
          <h1 className="font-display text-2xl text-ink mb-7">Admin</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && login()}
            placeholder="Password"
            className="w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition mb-5"
          />
          <button
            type="button"
            onClick={login}
            disabled={busy}
            className="w-full bg-ink text-cream rounded-full py-3.5 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-50"
          >
            {busy ? "Checking" : "Sign in"}
          </button>
          {loginErr && <p className="text-peri text-xs text-center mt-4">{loginErr}</p>}
        </div>
      </section>
    );
  }

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <section className="bg-cream px-6 md:px-10 py-14">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <h1 className="font-display text-4xl text-ink">Orders</h1>
          <a href="/api/admin/export" className="border border-ink/20 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition mr-3">Export CSV</a><button
            type="button"
            onClick={logout}
            className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/60 hover:border-gold hover:text-ink transition"
          >
            Sign out
          </button>
        </div>

        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total orders" value={String(stats.totalOrders)} />
            <StatCard label="Revenue" value={`\u20B9${stats.revenue.toLocaleString("en-IN")}`} />
            <StatCard label="Awaiting dispatch" value={String((stats.byStatus.paid || 0) + (stats.byStatus.packed || 0))} />
            <StatCard label="Delivered" value={String(stats.byStatus.delivered || 0)} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email or payment id"
            className="flex-1 min-w-[16rem] bg-white border border-ink/15 rounded-xl px-5 py-3 text-sm focus:outline-none focus:border-gold transition"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
          >
            <option value="all">All statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>

        {listErr && <p className="text-peri text-sm mb-6">{listErr}</p>}
        {orders === null && !listErr && <p className="text-ink/50 font-light">Loading orders&hellip;</p>}
        {orders !== null && orders.length === 0 && <p className="text-ink/50 font-light">No orders match.</p>}

        <div className="space-y-4">
          {orders?.map((o) => (
            <div key={o.id} className="bg-white rounded-[1.25rem] border border-ink/10 p-7">
              <div className="flex flex-wrap justify-between gap-4 mb-5 pb-5 border-b border-ink/10">
                <div>
                  <p className="font-display text-xl text-ink">{o.customer_name}</p>
                  <p className="text-ink/45 text-xs mt-1">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right flex flex-col items-end gap-2">
                  <p className="font-display text-xl text-ink">&#8377;{o.total}</p>
                  <select
                    value={o.status}
                    disabled={updating === o.id}
                    onChange={(e) => updateStatus(o.id, e.target.value)}
                    className={`text-[10px] tracking-tracksm uppercase px-3 py-1.5 rounded-full border-0 focus:outline-none disabled:opacity-50 ${STATUS_STYLE[o.status] || "bg-ink/10 text-ink"}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6 text-sm font-light">
                <div>
                  <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-2">Items</p>
                  {o.items.map((i, n) => <p key={n} className="text-ink/70">{i.name} &times;{i.qty}</p>)}
                </div>
                <div>
                  <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-2">Ship to</p>
                  <p className="text-ink/70 leading-relaxed">{o.address_line}<br />{o.city}, {o.state} {o.pincode}</p>
                  {o.notes && <p className="text-ink/50 text-xs mt-2">Note: {o.notes}</p>}
                </div>
              </div>
              <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-ink/10">
                <a href={waLink(o)} target="_blank" rel="noopener noreferrer" className="bg-mint/20 border border-mint/50 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink hover:bg-mint/35 transition">WhatsApp update</a>
                <a href={mailLink(o, o.email)} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Email update</a>
                <a href={`tel:${o.phone}`} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Call {o.phone}</a>
                <span className="text-ink/35 text-[10px] tracking-tracksm uppercase py-2">{o.razorpay_payment_id}</span>
              </div>
            </div>
          ))}
        </div>

        {total > PAGE_SIZE && (
          <div className="flex items-center justify-center gap-5 mt-10">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => loadOrders(page - 1)}
              className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition disabled:opacity-30"
            >
              Prev
            </button>
            <span className="text-ink/50 text-xs">Page {page} of {lastPage}</span>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => loadOrders(page + 1)}
              className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition disabled:opacity-30"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="max-w-6xl mx-auto px-6">
        <AdminProducts />
        <AdminReviews />
        <AdminEnquiries />
      </div>
    </section>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white rounded-[1.25rem] border border-ink/10 p-6">
      <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-2">{label}</p>
      <p className="font-display text-2xl text-ink">{value}</p>
    </div>
  );
}
