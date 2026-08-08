"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/products";

type P = { slug: string; name: string; price: number; weight_g: number; images: string[] | null };

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [all, setAll] = useState<P[]>([]);

  useEffect(() => {
    if (!open) return;
    fetch("/api/search").then(async (r) => { if (r.ok) setAll((await r.json()).products); });
    const esc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", esc); document.body.style.overflow = ""; };
  }, [open, onClose]);

  if (!open) return null;

  const hits = q.trim() ? all.filter((p) => p.name.toLowerCase().includes(q.trim().toLowerCase())) : all;

  return (
    <div className="fixed inset-0 z-[90]">
      <div className="absolute inset-0 bg-ink/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-w-3xl mx-auto mt-24 mx-6 bg-cream rounded-[1.5rem] overflow-hidden shadow-[0_40px_80px_-20px_rgba(18,53,42,0.5)]">
        <div className="flex items-center gap-4 px-7 py-6 border-b border-ink/10">
          <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink/40 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" /></svg>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products" className="flex-1 bg-transparent text-lg text-ink placeholder:text-ink/35 focus:outline-none" />
          <button type="button" onClick={onClose} aria-label="Close search" className="text-ink/40 hover:text-ink transition">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>

        <div className="p-7 max-h-[60vh] overflow-y-auto">
          <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-5">
            {q.trim() ? `${hits.length} result${hits.length !== 1 ? "s" : ""}` : "Products"}
          </p>

          {hits.length === 0 && <p className="text-ink/50 font-light py-6">Nothing matches that.</p>}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {hits.map((p) => (
              <Link key={p.slug} href={`/shop/makhana/${p.slug}`} onClick={onClose} className="group">
                <div className="aspect-square bg-white rounded-xl border border-ink/10 overflow-hidden flex items-center justify-center p-3 group-hover:border-gold transition">
                  <img src={p.images?.[0] || `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`} alt={p.name} className="max-h-full w-auto object-contain" />
                </div>
                <p className="font-display text-ink text-base mt-3 leading-tight group-hover:text-gold transition">{p.name}</p>
                <p className="text-ink/50 text-sm mt-1">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}