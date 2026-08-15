"use client";

import { useEffect, useMemo, useState } from "react";

type C = {
  phone: string;
  name: string;
  email: string | null;
  city: string | null;
  state: string | null;
  orders: number;
  spent: number;
  units: number;
  first: string;
  last: string;
};

const rupee = (n: number) => "\u20B9" + (n ?? 0).toLocaleString("en-IN");
const shortDate = (s: string) => new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
const daysAgo = (s: string) => Math.floor((Date.now() - new Date(s).getTime()) / 86400000);

type Sort = "spent" | "orders" | "recent";

export default function AdminCustomers() {
  const [rows, setRows] = useState<C[] | null>(null);
  const [meta, setMeta] = useState({ total: 0, repeat: 0 });
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("spent");
  const [only, setOnly] = useState(false);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (d) { setRows(d.customers); setMeta({ total: d.total, repeat: d.repeat }); } })
      .catch(() => {});
  }, []);

  const shown = useMemo(() => {
    if (!rows) return [];
    const term = q.trim().toLowerCase();
    let list = rows.filter((c) => {
      if (only && c.orders < 2) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        (c.city || "").toLowerCase().includes(term) ||
        (c.email || "").toLowerCase().includes(term)
      );
    });
    list = [...list].sort((a, b) => {
      if (sort === "orders") return b.orders - a.orders || b.spent - a.spent;
      if (sort === "recent") return b.last.localeCompare(a.last);
      return b.spent - a.spent;
    });
    return list;
  }, [rows, q, sort, only]);

  if (!rows) return <p className="text-ink/70 font-light">Loading</p>;

  const card = "bg-white rounded-[1.25rem] border border-ink/10 p-7";
  const eyebrow = "text-ink/70 text-[10px] tracking-tracksm uppercase";
  const rate = meta.total ? Math.round((meta.repeat / meta.total) * 100) : 0;
  const totalSpent = rows.reduce((n, c) => n + c.spent, 0);

  const waText = encodeURIComponent("Hi, this is Makheshwari Foods. ");

  return (
    <section>
      <h2 className="font-display text-3xl text-ink mb-7">Customers</h2>

      <div className="grid sm:grid-cols-3 gap-5 mb-7">
        <div className={card}>
          <p className={eyebrow}>Everyone</p>
          <p className="font-display text-4xl text-ink mt-3">{meta.total}</p>
          <p className="text-ink/70 text-sm mt-2 font-light">{rupee(totalSpent)} in total</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>Came back</p>
          <p className="font-display text-4xl text-ink mt-3">{meta.repeat}</p>
          <p className="text-ink/70 text-sm mt-2 font-light">{rate}% ordered more than once</p>
        </div>
        <div className={card}>
          <p className={eyebrow}>Average spend</p>
          <p className="font-display text-4xl text-ink mt-3">{rupee(meta.total ? Math.round(totalSpent / meta.total) : 0)}</p>
          <p className="text-ink/70 text-sm mt-2 font-light">per customer, all time</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-7">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name, phone, city or email"
          className="flex-1 min-w-[16rem] bg-white border border-ink/15 rounded-xl px-6 py-3.5 text-sm focus:outline-none focus:border-gold transition"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="bg-white border border-ink/15 rounded-xl px-6 py-3.5 text-sm focus:outline-none focus:border-gold transition">
          <option value="spent">Highest spend</option>
          <option value="orders">Most orders</option>
          <option value="recent">Most recent</option>
        </select>
        <button
          type="button"
          onClick={() => setOnly(!only)}
          className={`rounded-xl px-6 py-3.5 text-[10px] tracking-tracksm uppercase transition ${only ? "bg-ink text-cream" : "bg-white border border-ink/15 text-ink/70 hover:border-gold"}`}
        >
          Repeat buyers only
        </button>
      </div>

      {shown.length === 0 && <p className="text-ink/70 font-light">No customers match that.</p>}

      <div className="space-y-3">
        {shown.map((c) => {
          const quiet = daysAgo(c.last);
          return (
            <div key={c.phone} className="bg-white rounded-[1.25rem] border border-ink/10 p-6">
              <div className="flex flex-wrap items-start justify-between gap-5">
                <div className="min-w-[12rem]">
                  <p className="font-display text-xl text-ink">
                    {c.name}
                    {c.orders > 1 && (
                      <span className="ml-3 align-middle bg-gold/20 text-ink rounded-full px-3 py-1 text-[9px] tracking-tracksm uppercase">
                        {c.orders} orders
                      </span>
                    )}
                  </p>
                  <p className="text-ink/70 text-xs mt-1.5">
                    {c.phone}
                    {c.city ? ` \u00B7 ${c.city}` : ""}
                    {c.state ? `, ${c.state}` : ""}
                  </p>
                  {c.email && <p className="text-ink/70 text-xs mt-1">{c.email}</p>}
                </div>

                <div className="flex flex-wrap gap-7 text-sm">
                  <div>
                    <p className={eyebrow}>Spent</p>
                    <p className="font-display text-xl text-ink mt-1">{rupee(c.spent)}</p>
                  </div>
                  <div>
                    <p className={eyebrow}>Packs</p>
                    <p className="font-display text-xl text-ink mt-1">{c.units}</p>
                  </div>
                  <div>
                    <p className={eyebrow}>Last order</p>
                    <p className="text-ink mt-2">{shortDate(c.last)}</p>
                    <p className="text-ink/70 text-xs mt-0.5">
                      {quiet === 0 ? "today" : `${quiet} day${quiet === 1 ? "" : "s"} ago`}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2.5">
                  <a href={`https://wa.me/91${c.phone}?text=${waText}`} target="_blank" rel="noopener noreferrer" className="bg-mint/20 border border-mint/50 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink hover:bg-mint/35 transition">
                    WhatsApp
                  </a>
                  <a href={`tel:${c.phone}`} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition">
                    Call
                  </a>
                </div>
              </div>

              {c.orders > 1 && (
                <p className="text-ink/70 text-xs mt-4 pt-4 border-t border-ink/8 font-light">
                  First ordered {shortDate(c.first)} &middot; {rupee(Math.round(c.spent / c.orders))} average order
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}