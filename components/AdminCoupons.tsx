"use client";

import { useEffect, useState } from "react";

type C = {
  id: string;
  code: string;
  type: "percent" | "flat";
  value: number;
  min_order: number | null;
  max_discount: number | null;
  usage_limit: number | null;
  used_count: number;
  per_phone_limit: number | null;
  expires_at: string | null;
  active: boolean;
  created_at: string;
};

const EMPTY = { code: "", type: "percent", value: "", min_order: "", max_discount: "", usage_limit: "", expires_at: "" };

export default function AdminCoupons() {
  const [rows, setRows] = useState<C[] | null>(null);
  const [form, setForm] = useState<Record<string, string>>(EMPTY);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    const r = await fetch("/api/admin/coupons");
    if (r.ok) setRows((await r.json()).coupons);
  };
  useEffect(() => { load(); }, []);

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const create = async () => {
    setBusy(true); setErr("");
    const r = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const d = await r.json();
    if (!r.ok) setErr(d.error || "Could not create");
    else { setForm(EMPTY); load(); }
    setBusy(false);
  };

  const toggle = async (c: C) => {
    await fetch("/api/admin/coupons", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
    load();
  };

  const del = async (id: string) => {
    if (!window.confirm("Delete this code? Orders that used it keep their record.")) return;
    await fetch("/api/admin/coupons", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  if (!rows) return null;

  const inp = "w-full bg-cream/60 border border-ink/15 rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/50 text-[10px] tracking-tracksm uppercase mb-2";

  const live = rows.filter((c) => c.active).length;

  return (
    <section>
      <div className="flex items-end justify-between mb-7">
        <h2 className="font-display text-3xl text-ink">Discount codes</h2>
        <span className="text-ink/50 text-sm">{live} active</span>
      </div>

      <div className="bg-white rounded-[1.25rem] border border-ink/10 p-7 mb-8">
        <h3 className="font-display text-xl text-ink mb-6">New code</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div>
            <label className={lbl} htmlFor="c-code">Code</label>
            <input id="c-code" className={inp + " uppercase"} placeholder="LAUNCH10" value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} />
          </div>
          <div>
            <label className={lbl} htmlFor="c-type">Type</label>
            <select id="c-type" className={inp} value={form.type} onChange={(e) => set("type", e.target.value)}>
              <option value="percent">Percent off</option>
              <option value="flat">Flat rupees off</option>
            </select>
          </div>
          <div>
            <label className={lbl} htmlFor="c-value">{form.type === "percent" ? "Percent" : "Rupees"}</label>
            <input id="c-value" className={inp} placeholder={form.type === "percent" ? "10" : "50"} value={form.value} onChange={(e) => set("value", e.target.value)} />
          </div>
          <div>
            <label className={lbl} htmlFor="c-min">Minimum order</label>
            <input id="c-min" className={inp} placeholder="0" value={form.min_order} onChange={(e) => set("min_order", e.target.value)} />
          </div>
          {form.type === "percent" && (
            <div>
              <label className={lbl} htmlFor="c-max">Cap discount at</label>
              <input id="c-max" className={inp} placeholder="Optional" value={form.max_discount} onChange={(e) => set("max_discount", e.target.value)} />
            </div>
          )}
          <div>
            <label className={lbl} htmlFor="c-limit">Total uses</label>
            <input id="c-limit" className={inp} placeholder="Unlimited" value={form.usage_limit} onChange={(e) => set("usage_limit", e.target.value)} />
          </div>
          <div>
            <label className={lbl} htmlFor="c-exp">Expires</label>
            <input id="c-exp" type="date" className={inp} value={form.expires_at} onChange={(e) => set("expires_at", e.target.value)} />
          </div>
        </div>
        <button type="button" onClick={create} disabled={busy || !form.code || !form.value} className="bg-ink text-cream rounded-full px-9 py-3 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-40">
          {busy ? "Creating" : "Create code"}
        </button>
        {err && <p className="text-peri text-xs mt-4 font-light">{err}</p>}
      </div>

      {rows.length === 0 && <p className="text-ink/50 font-light">No codes yet.</p>}

      <div className="space-y-4">
        {rows.map((c) => {
          const expired = c.expires_at ? new Date(c.expires_at) < new Date() : false;
          const spent = c.usage_limit !== null && c.used_count >= c.usage_limit;
          return (
            <div key={c.id} className={`bg-white rounded-[1.25rem] border p-7 ${c.active && !expired && !spent ? "border-ink/10" : "border-ink/10 opacity-60"}`}>
              <div className="flex flex-wrap justify-between gap-4 mb-4">
                <div>
                  <p className="font-display text-xl text-ink">
                    {c.code}
                    <span className="text-gold ml-3 text-base">
                      {c.type === "percent" ? `${c.value}% off` : `\u20B9${c.value} off`}
                    </span>
                  </p>
                  <p className="text-ink/45 text-xs mt-1.5">
                    {c.min_order ? `Min \u20B9${c.min_order}` : "No minimum"}
                    {c.max_discount ? ` \u00B7 Max \u20B9${c.max_discount}` : ""}
                    {` \u00B7 Used ${c.used_count}${c.usage_limit ? ` of ${c.usage_limit}` : ""}`}
                    {c.expires_at ? ` \u00B7 Expires ${new Date(c.expires_at).toLocaleDateString("en-IN")}` : ""}
                  </p>
                </div>
                <span className={`self-start rounded-full px-4 py-1.5 text-[9px] tracking-tracksm uppercase ${expired ? "bg-ink/10 text-ink/60" : spent ? "bg-ink/10 text-ink/60" : c.active ? "bg-mint/25 text-ink" : "bg-gold/25 text-ink"}`}>
                  {expired ? "Expired" : spent ? "Fully used" : c.active ? "Active" : "Paused"}
                </span>
              </div>
              <div className="flex flex-wrap gap-3 pt-5 border-t border-ink/10">
                <button type="button" onClick={() => toggle(c)} className={`rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase transition ${c.active ? "border border-ink/20 text-ink/70 hover:border-gold" : "bg-ink text-cream hover:bg-gold hover:text-ink"}`}>
                  {c.active ? "Pause" : "Activate"}
                </button>
                <button type="button" onClick={() => del(c.id)} className="border border-peri/40 text-peri rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition">
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}