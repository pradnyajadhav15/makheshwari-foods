"use client";

import { useEffect, useState } from "react";
import { waLink, mailLink } from "@/lib/messages";
import AdminProducts from "@/components/AdminProducts";
import AdminEnquiries from "@/components/AdminEnquiries";
import AdminReviews from "@/components/AdminReviews";
import AdminCoupons from "@/components/AdminCoupons";
import AdminDashboard from "@/components/AdminDashboard";
import OrderTracking from "@/components/OrderTracking";
import AdminSettings from "@/components/AdminSettings";
import AdminCustomers from "@/components/AdminCustomers";

type Order = {
  id: string; created_at: string; razorpay_payment_id: string; status: string;
  customer_name: string; email: string; phone: string; address_line: string;
  city: string; state: string; pincode: string; total: number;
  items: { name: string; qty: number; price: number }[]; notes: string | null;
};

const STATUSES = ["paid", "packed", "shipped", "delivered", "cancelled"] as const;
const TABS = ["Dashboard", "Orders", "Products", "Coupons", "Customers", "Reviews", "Enquiries", "Settings"] as const;
type Tab = (typeof TABS)[number];

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [loginErr, setLoginErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [tab, setTab] = useState<Tab>("Dashboard");

  const [orders, setOrders] = useState<(Order & { archived?: boolean })[] | null>(null);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [listErr, setListErr] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const lastPage = Math.max(1, Math.ceil(total / 20));

  const loadOrders = async (p: number) => {
    setListErr("");
    const params = new URLSearchParams({ page: String(p) });
    if (q) params.set("q", q);
    if (status !== "all") params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    if (showArchived) params.set("archived", "1");
    const r = await fetch(`/api/admin/orders?${params}`);
    const d = await r.json();
    if (!r.ok) { setListErr(d.error || "Failed to load orders"); return; }
    setOrders(d.orders); setTotal(d.total); setPage(d.page);
  };

  useEffect(() => {
    fetch("/api/admin/session").then((r) => {
      const ok = r.ok;
      setAuthed(ok);
      if (ok) { loadOrders(1); }
    });
  }, []);

  useEffect(() => {
    if (authed) { const t = setTimeout(() => loadOrders(1), 300); return () => clearTimeout(t); }
  }, [q, status, from, to, showArchived, authed]);

  const login = async () => {
    setBusy(true); setLoginErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    if (!r.ok) { setLoginErr("Wrong password"); setBusy(false); return; }
    setAuthed(true); loadOrders(1); setBusy(false);
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false); setOrders(null);
  };

  const toggleArchive = async (id: string, next: boolean) => {
    setUpdating(id);
    await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived: next }),
    });
    loadOrders(page); setUpdating(null);
  };

  const deleteOrder = async (id: string) => {
    if (!window.confirm("Delete this unpaid order? This cannot be undone.")) return;
    setUpdating(id);
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
    });
    if (!r.ok) { const d = await r.json().catch(() => ({})); setListErr(d.error || "Could not delete"); }
    loadOrders(page); setUpdating(null);
  };

  const setOrderStatus = async (id: string, next: string) => {
    setUpdating(id);
    const r = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    const out = await r.json().catch(() => ({}));

    setOrders((prev) => prev!.map((o) => (o.id === id ? { ...o, status: next } : o)));
    setUpdating(null);

    if (out?.emailed) console.log("Customer emailed:", next);
  };

  if (authed === null) return <div className="min-h-screen bg-cream" />;

  if (!authed) {
    return (
      <section className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm bg-white rounded-[1.5rem] border border-ink/10 p-9">
          <h1 className="font-display text-2xl text-ink mb-7">Admin</h1>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && login()} placeholder="Password" className="w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition mb-5" />
          <button type="button" onClick={login} disabled={busy} className="w-full bg-ink text-cream rounded-full py-3.5 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-50">
            {busy ? "Checking" : "Sign in"}
          </button>
          {loginErr && <p className="text-peri text-xs text-center mt-4">{loginErr}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-cream px-4 sm:px-6 md:px-10 py-8 md:py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-8">
          <div>
            <h1 className="font-display text-4xl text-ink">Dashboard</h1>
            <p className="text-ink/45 text-sm mt-1.5">Makheshwari Foods</p>
          </div>
          <div className="flex gap-3">
            <a href="/api/admin/export" className="border border-ink/20 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Export CSV</a>
            <button type="button" onClick={logout} className="border border-ink/20 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Sign out</button>
          </div>
        </div>

        <div className="flex gap-2.5 mb-10 overflow-x-auto pb-2 -mx-6 px-6 md:mx-0 md:px-0 md:flex-wrap md:gap-3 md:overflow-visible md:pb-0">
          {TABS.map((t) => (
            <button key={t} type="button" onClick={() => setTab(t)} className={`shrink-0 rounded-full px-6 md:px-8 py-3 text-[10px] md:text-[11px] tracking-tracksm uppercase transition ${tab === t ? "bg-ink text-cream" : "border border-ink/20 text-ink/70 hover:border-gold hover:text-ink"}`}>
              {t}
            </button>
          ))}
        </div>

        {tab === "Orders" && (
          <div>
            <div className="flex flex-wrap gap-4 mb-8">
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, email or payment id" className="flex-1 min-w-[16rem] bg-white border border-ink/15 rounded-xl px-6 py-3.5 text-sm focus:outline-none focus:border-gold transition" />
              <select value={status} onChange={(e) => setStatus(e.target.value)} className="bg-white border border-ink/15 rounded-xl px-6 py-3.5 text-sm focus:outline-none focus:border-gold transition">
                <option value="all">All statuses</option>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="bg-white border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition" />
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="bg-white border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition" />
                {(from || to) && (
                  <button type="button" onClick={() => { setFrom(""); setTo(""); }} className="border border-ink/20 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/60 hover:border-gold transition">Clear dates</button>
                )}
                <button type="button" onClick={() => setShowArchived(!showArchived)} className={`rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase transition ${showArchived ? "bg-ink text-cream" : "bg-white border border-ink/15 text-ink/70 hover:border-gold"}`}>
                  {showArchived ? "Viewing archived" : "Show archived"}
                </button>
                <a href={`/api/admin/export?from=${from}&to=${to}&status=${status}`} className="border border-ink/20 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Export CSV</a>
            </div>

            {listErr && <p className="text-peri text-sm mb-5">{listErr}</p>}
            {orders?.length === 0 && <p className="text-ink/50 font-light">No orders found.</p>}

            <div className="space-y-4">
              {orders?.map((o) => (
                <div key={o.id} className="bg-white rounded-[1.25rem] border border-ink/10 p-5 sm:p-7">
                  <div className="flex flex-wrap justify-between gap-4 mb-5 pb-5 border-b border-ink/10">
                    <div>
                      <p className="font-display text-xl text-ink">{o.customer_name}</p>
                      <p className="text-ink/45 text-xs mt-1">{new Date(o.created_at).toLocaleString("en-IN")}</p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                      <span className="font-display text-xl text-ink">{"\u20B9"}{o.total}</span>
                      <select value={o.status} disabled={updating === o.id} onChange={(e) => setOrderStatus(o.id, e.target.value)} className="bg-cream/70 border border-ink/15 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase focus:outline-none focus:border-gold">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} aria-label="From date" className="bg-white border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition" />
                <input type="date" value={to} onChange={(e) => setTo(e.target.value)} aria-label="To date" className="bg-white border border-ink/15 rounded-xl px-5 py-3.5 text-sm focus:outline-none focus:border-gold transition" />
                {(from || to) && (
                  <button type="button" onClick={() => { setFrom(""); setTo(""); }} className="border border-ink/20 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/60 hover:border-gold transition">Clear dates</button>
                )}
                <button type="button" onClick={() => setShowArchived(!showArchived)} className={`rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase transition ${showArchived ? "bg-ink text-cream" : "bg-white border border-ink/15 text-ink/70 hover:border-gold"}`}>
                  {showArchived ? "Viewing archived" : "Show archived"}
                </button>
                <a href={`/api/admin/export?from=${from}&to=${to}&status=${status}`} className="border border-ink/20 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">Export CSV</a>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6 text-sm font-light">
                    <div>
                      <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-2">Items</p>
                      {o.items.map((i, n) => <p key={n} className="text-ink/70">{i.name} {"\u00D7"}{i.qty}</p>)}
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
                      {["paid", "packed", "shipped", "delivered"].includes(o.status) && (
                        <a
                          href={`/api/admin/invoice/${o.id}`}
                          className="border border-gold/50 text-ink rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-gold/15 transition"
                        >
                          Invoice PDF
                        </a>
                      )}
                      <button
                        type="button"
                        disabled={updating === o.id}
                        onClick={() => toggleArchive(o.id, !o.archived)}
                        className="border border-ink/20 text-ink/70 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:border-gold hover:text-ink transition disabled:opacity-40"
                      >
                        {o.archived ? "Unarchive" : "Archive"}
                      </button>
                      {["pending", "failed"].includes(o.status) && (
                        <button
                          type="button"
                          disabled={updating === o.id}
                          onClick={() => deleteOrder(o.id)}
                          className="border border-peri/40 text-peri rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition disabled:opacity-40"
                        >
                          Delete
                        </button>
                      )}
                      <OrderTracking order={o} onSaved={() => loadOrders(page)} />
                  </div>
                </div>
              ))}
            </div>

            {lastPage > 1 && (
              <div className="flex items-center gap-4 mt-10">
                <button type="button" disabled={page <= 1} onClick={() => loadOrders(page - 1)} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold transition disabled:opacity-30">Previous</button>
                <span className="text-ink/50 text-xs">Page {page} of {lastPage}</span>
                <button type="button" disabled={page >= lastPage} onClick={() => loadOrders(page + 1)} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold transition disabled:opacity-30">Next</button>
              </div>
            )}
          </div>
        )}

        {tab === "Products" && <AdminProducts />}
        {tab === "Dashboard" && <AdminDashboard onJump={(t) => setTab(t as Tab)} />}
        {tab === "Coupons" && <AdminCoupons />}
        {tab === "Reviews" && <AdminReviews />}
        {tab === "Enquiries" && <AdminEnquiries />}
        {tab === "Customers" && <AdminCustomers />}
        {tab === "Settings" && <AdminSettings />}
      </div>
    </section>
  );
}