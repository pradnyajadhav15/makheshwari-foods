"use client";

import { useEffect, useState } from "react";
import { ReviewSkeleton } from "@/components/Skeleton";

type R = { id: string; created_at: string; name: string; city: string | null; rating: number; body: string; verified: boolean };

function Stars({ n, size = "text-base" }: { n: number; size?: string }) {
  return (
    <span className={`${size} text-golddeep tracking-wider`} aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      <span className="text-ink/20">{"★".repeat(5 - n)}</span>
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

  return (
    <section className="border-t border-ink/10">
      <div className="wrap-mid section-sm">
        <div className="flex flex-wrap items-end justify-between gap-5 mb-9">
          <div>
            <p className="marker mb-4">What people say</p>
            <h2 className="display-md text-ink">Reviews</h2>
            {rows && rows.length > 0 && (
              <div className="flex items-center gap-3 mt-3">
                <Stars n={Math.round(avg)} />
                <span className="text-ink/70 text-sm">
                  {avg.toFixed(1)} from {rows.length} review{rows.length > 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => { setOpen(!open); setSent(false); }}
            className="btn btn-outline"
            aria-expanded={open}
          >
            {open ? "Close" : "Write a review"}
          </button>
        </div>

        {open && (
          <div className="border border-ink/12 bg-paper p-6 sm:p-8 mb-10">
            {sent ? (
              <div className="text-center py-6">
                <p className="font-display text-2xl text-ink mb-3">Thank you</p>
                <p className="text-ink/70 body-text">
                  Your review has been sent and will appear once we have read it.
                </p>
              </div>
            ) : (
              <>
                <p className="font-display text-xl text-ink mb-7">Reviewing {productName}</p>

                <div className="mb-6">
                  <span className="field-label">Rating</span>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setF({ ...f, rating: n })}
                        aria-label={`${n} star${n > 1 ? "s" : ""}`}
                        aria-pressed={n === f.rating}
                        className={`w-10 h-10 text-2xl leading-none transition ${
                          n <= f.rating ? "text-golddeep" : "text-ink/20 hover:text-ink/70"
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="field-label" htmlFor="r-name">Your name</label>
                    <input id="r-name" autoComplete="name" className="field" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
                  </div>
                  <div>
                    <label className="field-label" htmlFor="r-city">City</label>
                    <input id="r-city" className="field" placeholder="Optional" value={f.city} onChange={(e) => setF({ ...f, city: e.target.value })} />
                  </div>
                </div>

                <div className="mb-7">
                  <label className="field-label" htmlFor="r-body">Your review</label>
                  <textarea
                    id="r-body"
                    rows={4}
                    className="field resize-none"
                    placeholder="How was the taste, the crunch, the delivery"
                    value={f.body}
                    onChange={(e) => setF({ ...f, body: e.target.value })}
                  />
                </div>

                <button type="button" onClick={submit} className="btn btn-primary">
                  Send review
                </button>
                {err && <p className="text-perideep text-xs mt-4" role="alert">{err}</p>}
              </>
            )}
          </div>
        )}

        {rows === null && (
          <div className="border-t border-ink/12" aria-busy="true">
            <ReviewSkeleton />
            <ReviewSkeleton />
            <span className="sr-only">Loading reviews</span>
          </div>
        )}

        {rows && rows.length === 0 && (
          <p className="text-ink/70 body-text border-t border-ink/12 pt-7">
            No reviews yet. If you have tried it, yours would be the first.
          </p>
        )}

        <div className="border-t border-ink/12">
          {rows?.map((r) => (
            <article key={r.id} className="border-b border-ink/12 py-7">
              <div className="flex flex-wrap justify-between gap-3 mb-3">
                <div>
                  <p className="font-display text-lg text-ink">
                    {r.name}
                    {r.verified && (
                      <span className="ml-3 text-mintdeep text-[0.6rem] tracking-tracksm uppercase">
                        Verified buyer
                      </span>
                    )}
                  </p>
                  {r.city && <p className="text-ink/70 text-xs mt-1">{r.city}</p>}
                </div>
                <Stars n={r.rating} size="text-sm" />
              </div>
              <p className="text-ink/70 body-text">{r.body}</p>
              <p className="text-ink/70 text-[10px] mt-3">
                {new Date(r.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
