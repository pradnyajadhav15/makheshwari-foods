"use client";

import Image from "next/image";
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
    <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Search products">
      {/* Decorative backdrop; the labelled close control is the X button. */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-inkdeep/55 backdrop-blur-sm"
      />

      {/* Padding lives on the wrapper so the panel can stay centred —
          the old markup put mx-auto and mx-6 on the same element. */}
      <div className="relative px-4 sm:px-6 pt-20 sm:pt-24 pb-6 h-full overflow-y-auto">
        <div className="w-full max-w-3xl mx-auto bg-paper border border-ink/12 shadow-[0_40px_80px_-24px_rgba(12,36,28,0.5)]">
          <div className="flex items-center gap-4 px-5 sm:px-7 py-5 border-b border-ink/12">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-ink/70 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search products"
              aria-label="Search products"
              className="flex-1 min-w-0 bg-transparent text-base sm:text-lg text-ink placeholder:text-ink/55 focus:outline-none"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close search"
              className="w-10 h-10 -mr-2 flex items-center justify-center text-ink/70 hover:text-ink transition shrink-0"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>

          <div className="p-5 sm:p-7 max-h-[60vh] overflow-y-auto">
            <p className="marker mb-5">
              {q.trim() ? `${hits.length} result${hits.length !== 1 ? "s" : ""}` : "Products"}
            </p>

            {hits.length === 0 && (
              <p className="text-ink/70 body-text py-6">Nothing matches that.</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5">
              {hits.map((p) => (
                <Link key={p.slug} href={`/shop/makhana/${p.slug}`} onClick={onClose} className="group">
                  <div className="aspect-square bg-white border border-ink/12 overflow-hidden flex items-center justify-center p-3 group-hover:border-gold transition">
                    <Image
                      src={p.images?.[0] || `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                      alt={p.name}
                      width={120}
                      height={120}
                      className="max-h-full w-auto object-contain"
                    />
                  </div>
                  <p className="font-display text-ink text-base mt-3 leading-tight group-hover:text-golddeep transition">
                    {p.name}
                  </p>
                  <p className="text-ink/70 text-sm mt-1">{formatPrice(p.price)}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
