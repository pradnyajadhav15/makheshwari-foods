"use client";

import { useEffect, useState } from "react";

type R = { id: string; created_at: string; product_slug: string; name: string; city: string | null; rating: number; body: string; approved: boolean; verified: boolean };

export default function AdminReviews() {
  const [rows, setRows] = useState<R[] | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/reviews");
    if (r.ok) setRows((await r.json()).reviews);
  };

  useEffect(() => { load(); }, []);

  const patch = async (id: string, body: Record<string, boolean>) => {
    await fetch("/api/admin/reviews", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }) });
    load();
  };

  const del = async (id: string) => {
    await fetch("/api/admin/reviews", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  if (!rows) return null;
  const pending = rows.filter((r) => !r.approved).length;

  return (
    <section>
      <div className="flex items-end justify-between mb-7">
        <h2 className="font-display text-3xl text-ink">Reviews</h2>
        {pending > 0 && <span className="text-gold text-sm">{pending} awaiting approval</span>}
      </div>

      {rows.length === 0 && <p className="text-ink/50 font-light">No reviews yet.</p>}

      <div className="space-y-4">
        {rows.map((r) => (
          <div key={r.id} className={`bg-white rounded-[1.25rem] border p-7 ${r.approved ? "border-ink/10" : "border-gold/60"}`}>
            <div className="flex flex-wrap justify-between gap-4 mb-4">
              <div>
                <p className="font-display text-lg text-ink">{r.name} <span className="text-gold ml-2">{"\u2605".repeat(r.rating)}</span></p>
                <p className="text-ink/45 text-xs mt-1">{r.product_slug}{r.city ? ` Â· ${r.city}` : ""} Â· {new Date(r.created_at).toLocaleDateString("en-IN")}</p>
              </div>
              <span className={`self-start rounded-full px-4 py-1.5 text-[9px] tracking-tracksm uppercase ${r.approved ? "bg-mint/25 text-ink" : "bg-gold/25 text-ink"}`}>
                {r.approved ? "Live" : "Pending"}
              </span>
            </div>
            <p className="text-ink/65 text-sm font-light leading-relaxed mb-5">{r.body}</p>
            <div className="flex flex-wrap gap-3 pt-5 border-t border-ink/10">
              <button type="button" onClick={() => patch(r.id, { approved: !r.approved })} className={`rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase transition ${r.approved ? "border border-ink/20 text-ink/70 hover:border-gold" : "bg-ink text-cream hover:bg-gold hover:text-ink"}`}>
                {r.approved ? "Unpublish" : "Approve"}
              </button>
              <button type="button" onClick={() => patch(r.id, { verified: !r.verified })} className={`rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase transition ${r.verified ? "bg-mint/25 text-ink" : "border border-ink/20 text-ink/70 hover:border-gold"}`}>
                {r.verified ? "Verified buyer" : "Mark verified"}
              </button>
              <button type="button" onClick={() => del(r.id)} className="border border-peri/40 text-peri rounded-full px-5 py-2 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
