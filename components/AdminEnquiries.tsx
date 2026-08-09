"use client";

import { useEffect, useState } from "react";

type E = { id: string; created_at: string; name: string; company: string | null; city: string | null; phone: string; business_type: string | null; product: string | null; quantity: string | null; notes: string | null; status: string };

export default function AdminEnquiries() {
  const [rows, setRows] = useState<E[] | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/enquiries");
    if (!r.ok) return;
    const d = await r.json();
    setRows(d.enquiries);
  };

  useEffect(() => { load(); }, []);

  const mark = async (id: string, status: string) => {
    await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setConfirm(null);
    load();
  };

  if (!rows) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-7">
        <h2 className="font-display text-3xl text-ink">Bulk enquiries</h2>
        <span className="text-ink/45 text-sm">{rows.filter((e) => e.status === "new").length} new</span>
      </div>

      {rows.length === 0 && <p className="text-ink/50 font-light">No enquiries yet.</p>}

      <div className="space-y-4">
        {rows.map((e) => (
          <div key={e.id} className={`bg-white rounded-[1.25rem] border p-7 ${e.status === "new" ? "border-gold/60" : "border-ink/10"}`}>
            <div className="flex flex-wrap justify-between gap-4 mb-5">
              <div>
                <p className="font-display text-xl text-ink">{e.name}</p>
                <p className="text-ink/50 text-sm mt-1">{e.company || "No business name"}{e.city ? ` · ${e.city}` : ""}</p>
                <p className="text-ink/40 text-xs mt-1">{new Date(e.created_at).toLocaleString("en-IN")}</p>
              </div>
              <select value={e.status} onChange={(ev) => mark(e.id, ev.target.value)} className="self-start bg-cream/60 border border-ink/15 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink focus:outline-none focus:border-gold">
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="quoted">Quoted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            </div>
            <div className="grid sm:grid-cols-3 gap-5 text-sm font-light border-t border-ink/10 pt-5">
              <div><p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-1.5">Type</p><p className="text-ink/70">{e.business_type || "-"}</p></div>
              <div><p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-1.5">Product</p><p className="text-ink/70">{e.product || "-"}</p></div>
              <div><p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-1.5">Quantity</p><p className="text-ink/70">{e.quantity || "-"}</p></div>
            </div>
            {e.notes && <p className="text-ink/55 text-sm font-light mt-4">{e.notes}</p>}
            <div className="flex gap-3 mt-6 pt-5 border-t border-ink/10">
              <a href={`https://wa.me/91${e.phone.replace(/\D/g, "").slice(-10)}?text=${encodeURIComponent(`Namaste ${e.name.split(" ")[0]},\n\nThank you for your bulk enquiry with Makheshwari Foods. Let us know the quantity you need and we will send pricing today.\n\n- Makheshwari Foods, Samastipur`)}`} target="_blank" rel="noopener noreferrer" className="bg-mint/20 border border-mint/50 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink hover:bg-mint/35 transition">WhatsApp</a>
              <a href={`tel:${e.phone}`} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold transition">Call {e.phone}</a>
              {confirm === e.id ? (
                <span className="flex gap-2 ml-auto">
                  <button type="button" onClick={() => del(e.id)} className="bg-peri text-cream rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase">Delete for good</button>
                  <button type="button" onClick={() => setConfirm(null)} className="border border-ink/20 rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase text-ink/60">Keep</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirm(e.id)} className="border border-peri/40 text-peri rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition ml-auto">Delete</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
