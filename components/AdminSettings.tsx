"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/Toast";

type S = {
  announcement: string;
  announcement_active: boolean;
  whatsapp: string;
  support_email: string;
  support_phone: string;
  instagram: string;
  shop_open: boolean;
  shop_closed_message: string;
  min_order: number;
};

export default function AdminSettings() {
  const [s, setS] = useState<S | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [toast, setToast] = useState<{ m: string; t: "ok" | "error" } | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings").then((r) => (r.ok ? r.json() : null)).then((d) => d && setS(d));
  }, []);

  const set = (k: keyof S, v: string | boolean | number) => setS((p) => (p ? { ...p, [k]: v } : p));

  const save = async () => {
    if (!s) return;
    setBusy(true); setErr("");
    const r = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(s),
    });
    const d = await r.json();
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not save"); setToast({ m: "Could not save", t: "error" }); return; }
    setS(d);
    setToast({ m: "Settings saved", t: "ok" });
  };

  if (!s) return <p className="text-ink/70 font-light">Loading</p>;

  const inp = "w-full bg-cream/60 border border-ink/15 rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/70 text-[10px] tracking-tracksm uppercase mb-2";
  const card = "bg-white rounded-[1.25rem] border border-ink/10 p-7";
  const hint = "text-ink/70 text-xs mt-2 font-light";

  return (
    <section className="space-y-5 max-w-3xl">
      <h2 className="font-display text-3xl text-ink mb-7">Settings</h2>

      <div className={card}>
        <p className="font-display text-xl text-ink mb-6">Announcement bar</p>
        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <input type="checkbox" checked={s.announcement_active} onChange={(e) => set("announcement_active", e.target.checked)} className="accent-[#12352A] w-4 h-4" />
          <span className="text-ink/70 text-sm font-light">Show the bar at the top of every page</span>
        </label>
        <label className={lbl} htmlFor="s-ann">Message</label>
        <input id="s-ann" className={inp} value={s.announcement} onChange={(e) => set("announcement", e.target.value)} />
        <p className={hint}>Keep it short. Long messages wrap awkwardly on phones.</p>
      </div>

      <div className={card}>
        <p className="font-display text-xl text-ink mb-6">Shop status</p>
        <label className="flex items-center gap-3 mb-5 cursor-pointer">
          <input type="checkbox" checked={s.shop_open} onChange={(e) => set("shop_open", e.target.checked)} className="accent-[#12352A] w-4 h-4" />
          <span className="text-ink/70 text-sm font-light">Shop is open and taking orders</span>
        </label>
        {!s.shop_open && (
          <>
            <label className={lbl} htmlFor="s-closed">Message shown to customers</label>
            <input id="s-closed" className={inp} value={s.shop_closed_message} onChange={(e) => set("shop_closed_message", e.target.value)} />
            <p className={hint}>Customers can browse but not check out while the shop is closed.</p>
          </>
        )}
      </div>

      <div className={card}>
        <p className="font-display text-xl text-ink mb-6">Ordering</p>
          <label className={lbl} htmlFor="s-min">Minimum order value</label>
          <input id="s-min" className={inp + " max-w-[12rem]"} value={s.min_order} onChange={(e) => set("min_order", e.target.value.replace(/\D/g, ""))} />
          <p className={hint}>Customers cannot check out below this amount. Set 0 to turn it off.</p>
        </div>



      <div className={card}>
        <p className="font-display text-xl text-ink mb-6">Contact details</p>
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className={lbl} htmlFor="s-wa">WhatsApp number</label>
            <input id="s-wa" className={inp} value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value.replace(/\D/g, ""))} />
            <p className={hint}>With country code, no spaces. For example 917485001464.</p>
          </div>
          <div>
            <label className={lbl} htmlFor="s-phone">Phone shown on the site</label>
            <input id="s-phone" className={inp} value={s.support_phone} onChange={(e) => set("support_phone", e.target.value)} />
          </div>
          <div>
            <label className={lbl} htmlFor="s-email">Support email</label>
            <input id="s-email" className={inp} value={s.support_email} onChange={(e) => set("support_email", e.target.value)} />
          </div>
          <div>
            <label className={lbl} htmlFor="s-ig">Instagram link</label>
            <input id="s-ig" className={inp} value={s.instagram} onChange={(e) => set("instagram", e.target.value)} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button type="button" onClick={save} disabled={busy} className="bg-ink text-cream rounded-full px-10 py-3.5 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-40">
          {busy ? "Saving" : "Save settings"}
        </button>
        <span className="text-ink/70 text-xs font-light">Changes appear on the site within a minute.</span>
      </div>
      {err && <p className="text-peri text-sm">{err}</p>}

      {toast && <Toast message={toast.m} tone={toast.t} onDone={() => setToast(null)} />}
    </section>
  );
}