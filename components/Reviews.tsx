"use client";

import { useEffect, useState } from "react";

type R = { id: string; created_at: string; name: string; city: string | null; rating: number; body: string; verified: boolean };

function Stars({ n, size = "text-base" }: { n: number; size?: string }) {
  return (
    <span className={`${size} text-gold tracking-wider`} aria-label={`${n} out of 5`}>
      {"\u2605".repeat(n)}<span className="text-ink/20">{"\u2605".repeat(5 - n)}</span>
    </span>
  );
}

export default function Reviews({ slug, productName }: { slug: string; productName: string }) {
  const [rows, setRows] = useState<R[] | null>(null);
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({ name: "", city: "", rating: 5, body: "" });

  const load = async () => {
    const r = await fetch(`/api/reviews?slug=${slug}`);
    if (r.ok) setRows((await r.json()).reviews);
  };

  useEffect(() => { load(); }, [slug]);

  const submit = async () => {
    setErr("");
    const r = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...f, product_slug: slug }),
    });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || "Could not send"); return; }
    setSent(true);
    setF({ name: "", city: "", rating: 5, body: "" });
  };

  const avg = rows && rows.length ? rows.reduce((n, r) => n + r.rating, 0) / rows.length : 0;
  const inp = "w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/50 text-[10px] tracking-tracksm uppercase mb-2";

  return (
    <section className="bg-cream px-6 md:px-14 py-20 border-t border-ink/10">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-10">
          <div>
            <h2 className="font-display text-3xl md:text-4xl text-ink">Reviews</h2>
            {rows && rows.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <Stars n={Math.round(avg)} />
                <span className="text-ink/55 text-sm">{avg.toFixed(1)} from {rows.length} review{rows.length > 1 ? "s" : ""}</span>
              </div>
            )}
          </div>
          <button type="button" onClick={() => { setOpen(!open); setSent(false); }} className="border border-ink/25 text-ink rounded-full px-8 py-3.5 text-[11px] tracking-tracksm uppercase hover:border-gold hover:text-gold transition">
            {open ? "Close" : "Write a review"}
          </button>
        </div>

        {open && (
          <div className="bg-white rounded-[1.5rem] border border-ink/10 p-8 mb-10">
            {sent ? (
              <div className="text-center py-6">
                <p className="font-display text-2xl text-ink mb-3">Thank you</p>
                <p className="text-ink/55 font-light">Your review has been sent and will appear once we have read it.</p>
              </div>
            ) : (
              <>
                <p className="font-display text-xl text-ink mb-7">Reviewing {productName}</p>
                <div className="mb-6">
                  <label className={lbl}>Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button key={n} type="button" onClick={() => setF({ ...f, rating: n })} aria-label={`${n} stars`} className={`text-2xl transition ${n <= f.rating ? "text-gold" : "text-ink/20 hover:text-ink/40"}`}>
                        {"\u2605"}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  <div><label className={lbl} htmlFor="r-name">Your name</label><input id="r-name" className={inp} value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></div>
                  <div><label className={lbl} htmlFor="r-city">City</label><input id="r-city" className={inp} placeholder="Optional" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} /></div>
                </div>
                <div className="mb-7">
                  <label className={lbl} htmlFor="r-body">Your review</label>
                  <textarea id="r-body" rows={4} className={inp + " resize-none"} placeholder="How was the taste, the crunch, the delivery" value={f.body} onChange={(e) => setF({ ...f, body: e.target.value })} />
                </div>
                <button type="button" onClick={submit} className="bg-ink text-cream rounded-full px-10 py-3.5 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">Send review</button>
                {err && <p className="text-peri text-xs mt-4">{err}</p>}
              </>
            )}
          </div>
        )}

        {rows && rows.length === 0 && (
          <p className="text-ink/45 font-light">No reviews yet. If you have tried it, yours would be the first.</p>
        )}

        <div className="space-y-6">
          {rows?.map((r) => (
            <div key={r.id} className="bg-white rounded-[1.25rem] border border-ink/10 p-7">
              <div className="flex flex-wrap justify-between gap-3 mb-4">
                <div>
                  <p className="font-display text-lg text-ink">
                    {r.name}
                    {r.verified && <span className="ml-3 text-mint text-[9px] tracking-tracksm uppercase">Verified buyer</span>}
                  </p>
                  {r.city && <p className="text-ink/40 text-xs mt-1">{r.city}</p>}
                </div>
                <Stars n={r.rating} size="text-sm" />
              </div>
              <p className="text-ink/65 font-light leading-relaxed">{r.body}</p>
              <p className="text-ink/30 text-[10px] mt-4">{new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}