"use client";

import { useState } from "react";

type Order = {
  id: string;
  status: string;
  tracking_id?: string | null;
  courier?: string | null;
  email?: string | null;
};

const COURIERS = ["Delhivery", "Blue Dart", "DTDC", "India Post", "Ekart", "Xpressbees", "Shadowfax", "Other"];

export default function OrderTracking({ order, onSaved }: { order: Order; onSaved?: () => void }) {
  const [open, setOpen] = useState(false);
  const [tracking, setTracking] = useState(order.tracking_id || "");
  const [courier, setCourier] = useState(order.courier || "Delhivery");
  const [notify, setNotify] = useState(true);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const shipped = ["shipped", "delivered"].includes(order.status);
  const hasTracking = Boolean(order.tracking_id);

  const save = async () => {
    setBusy(true);
    setMsg("");
    const r = await fetch(`/api/admin/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: order.status, tracking_id: tracking.trim() || null, courier, notify }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg(d.error || "Could not save"); return; }
    setMsg(d.emailed ? "Saved and customer emailed" : "Saved");
    setOpen(false);
    onSaved?.();
  };

  if (!shipped && !hasTracking) return null;

  return (
    <div className="w-full mt-4 pt-4 border-t border-ink/8">
      {hasTracking && !open && (
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-cream/80 border border-ink/15 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink">
            {order.courier || "Courier"} &middot; {order.tracking_id}
          </span>
          <button type="button" onClick={() => setOpen(true)} className="text-ink/70 text-[10px] tracking-tracksm uppercase hover:text-golddeep transition">
            Edit
          </button>
        </div>
      )}

      {!hasTracking && !open && (
        <button type="button" onClick={() => setOpen(true)} className="border border-gold/50 text-ink rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-gold/15 transition">
          Add tracking number
        </button>
      )}

      {open && (
        <div className="bg-cream/60 border border-ink/15 rounded-xl p-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-ink/70 text-[10px] tracking-tracksm uppercase mb-2" htmlFor={`t-${order.id}`}>Tracking number</label>
              <input
                id={`t-${order.id}`}
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. 1234567890"
                className="w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
              />
            </div>
            <div>
              <label className="block text-ink/70 text-[10px] tracking-tracksm uppercase mb-2" htmlFor={`c-${order.id}`}>Courier</label>
              <select
                id={`c-${order.id}`}
                value={courier}
                onChange={(e) => setCourier(e.target.value)}
                className="w-full bg-white border border-ink/15 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold transition"
              >
                {COURIERS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2.5 mt-4 text-ink/75 text-sm font-light cursor-pointer">
            <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} className="accent-[#12352A] w-4 h-4" />
            Email the customer{order.email ? ` at ${order.email}` : ""}
          </label>

          <div className="flex gap-3 mt-5">
            <button type="button" onClick={save} disabled={busy} className="bg-ink text-cream rounded-full px-7 py-2.5 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-40">
              {busy ? "Saving" : "Save"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="border border-ink/20 text-ink/70 rounded-full px-7 py-2.5 text-[10px] tracking-tracksm uppercase hover:border-gold transition">
              Cancel
            </button>
          </div>
        </div>
      )}

      {msg && <p className="text-ink/70 text-xs mt-3 font-light">{msg}</p>}
    </div>
  );
}