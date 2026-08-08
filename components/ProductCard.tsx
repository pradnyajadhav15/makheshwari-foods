"use client";

import Link from "next/link";
import AddToCart from "@/components/AddToCart";
import { accentClass, accentText, formatPrice, type Product } from "@/lib/products";

export default function ProductCard({ product: p }: { product: Product }) {
  const img = `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`;

  return (
    <article className="group bg-white rounded-[1.5rem] border border-ink/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-20px_rgba(18,53,42,0.28)]">
      <div className="relative p-5">
        <div className="relative rounded-[1rem] overflow-hidden bg-cream/70">
          <svg className="absolute inset-0 w-full h-full opacity-[0.13]" aria-hidden="true">
            <defs>
              <pattern id={`p-${p.slug}`} width="52" height="52" patternUnits="userSpaceOnUse">
                <path d="M26 12 C20 18 20 30 26 36 C32 30 32 18 26 12 Z" fill="none" stroke="#12352A" strokeWidth="1" />
                <circle cx="6" cy="6" r="1.6" fill="#C9A227" />
                <circle cx="46" cy="46" r="1.6" fill="#C9A227" />
                <path d="M0 26 H8 M44 26 H52" stroke="#12352A" strokeWidth="0.8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#p-${p.slug})`} />
          </svg>

          <div className="absolute inset-3 border border-gold/35 rounded-[0.7rem] pointer-events-none" />
          <div className="absolute inset-[0.9rem] border border-gold/20 rounded-[0.5rem] pointer-events-none" />

          <Link href={`/shop/makhana/${p.slug}`} className="relative block aspect-square flex items-center justify-center p-8">
            <img
              src={img}
              alt={p.name}
              className="max-h-full w-auto mx-auto transition-transform duration-700 group-hover:scale-105"
            />
          </Link>

          <Link
            href={`/shop/makhana/${p.slug}`}
            aria-label={`Add ${p.name}`}
            className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-ink text-cream flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-gold hover:text-ink"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M12 6v12M6 12h12" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </div>

      <div className={`h-1 mx-5 rounded-full ${accentClass[p.accent]}`} />

      <div className="px-7 pt-6 pb-8 text-center">
        <p className="text-gold text-[9px] tracking-track uppercase mb-3">Makheshwari</p>
        <h3 className="font-display text-2xl text-ink leading-tight">
          <Link href={`/shop/makhana/${p.slug}`} className="hover:text-gold transition">
            {p.name}
          </Link>
        </h3>
        <p className={`${accentText[p.accent]} text-sm mt-3 font-light`}>{p.hook}</p>

        <div className="flex items-center justify-center gap-3 mt-6 pt-5 border-t border-ink/10">
          <span className="font-display text-xl text-ink">{formatPrice(p.price)}</span>
          <span className="w-1 h-1 rounded-full bg-ink/25" />
          <span className="text-ink/50 text-xs">{p.weightG} g</span>
        </div>

        <div className="mt-6"><AddToCart slug={p.slug} /></div>
      </div>
    </article>
  );
}