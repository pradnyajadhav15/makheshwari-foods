"use client";

import Link from "next/link";
import { useState } from "react";
import { FREE_SHIPPING_OVER } from "@/lib/products";
import { useCart } from "@/components/CartContext";
import { usePathname } from "next/navigation";
import SearchOverlay from "@/components/SearchOverlay";
import AnnouncementBar from "@/components/AnnouncementBar";

const nav = [
  { href: "/", label: "Home" },
  { href: "/our-story", label: "About us" },
  { href: "/shop", label: "Our products" },
  { href: "/contact", label: "Contact us" },
  { href: "/bulk-orders", label: "Bulk orders" },
];

function Elephant() {
  return (
    <svg viewBox="0 0 200 200" className="w-14 h-14 md:w-16 md:h-16 shrink-0" aria-hidden="true">
      <circle cx="100" cy="100" r="97" fill="none" stroke="#C9A227" strokeWidth="2" opacity="0.55" />
      <circle cx="100" cy="100" r="88" fill="none" stroke="#C9A227" strokeWidth="1" opacity="0.35" />
      <g fill="#C9A227">
        <path d="M44 96 C38 103 38 114 43 121" fill="none" stroke="#C9A227" strokeWidth="7" strokeLinecap="round" />
        <ellipse cx="93" cy="103" rx="44" ry="31" />
        <circle cx="144" cy="96" r="26" />
        <path d="M56 122 h19 a6 6 0 0 1 6 6 v28 a7 7 0 0 1 -7 7 h-17 a7 7 0 0 1 -7 -7 v-28 a6 6 0 0 1 6 -6 z" />
        <path d="M85 126 h17 a6 6 0 0 1 6 6 v24 a7 7 0 0 1 -7 7 h-15 a7 7 0 0 1 -7 -7 v-24 a6 6 0 0 1 6 -6 z" />
        <path d="M112 124 h18 a6 6 0 0 1 6 6 v26 a7 7 0 0 1 -7 7 h-16 a7 7 0 0 1 -7 -7 v-26 a6 6 0 0 1 6 -6 z" />
        <path d="M139 122 h19 a6 6 0 0 1 6 6 v28 a7 7 0 0 1 -7 7 h-17 a7 7 0 0 1 -7 -7 v-28 a6 6 0 0 1 6 -6 z" />
        <path d="M155 106 C172 118 175 143 165 163 L151 158 C159 142 157 124 142 116 Z" />
      </g>
      <path d="M125 78 C113 88 113 104 123 114" fill="none" stroke="#12352A" strokeWidth="4" strokeLinecap="round" />
      <path d="M151 130 C162 134 169 142 172 152" fill="none" stroke="#12352A" strokeWidth="5" strokeLinecap="round" />
      <path d="M80 158 v6 M108 158 v6 M136 158 v6" stroke="#12352A" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();
  const [search, setSearch] = useState(false);
  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <AnnouncementBar />

      <header className="bg-[#FDF6EC] sticky top-0 z-50 border-b border-ink/15">
        <div className="max-w-6xl mx-auto px-6 h-32 flex items-center justify-between">
          <Link href="/" aria-label="Makheshwari Foods home" className="shrink-0"><img src="/brand/logo.png" alt="Makheshwari Foods" className="h-24 md:h-28 w-auto" /></Link>

          <nav className="hidden md:flex items-center gap-6 lg:gap-9 text-ink/75 text-[13px] tracking-tracksm uppercase">
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="hover:text-gold transition">
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setSearch(true)} aria-label="Search" className="w-10 h-10 flex items-center justify-center text-ink/70 hover:text-gold transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" strokeLinecap="round" /></svg>
            </button>
            <Link href="/account" aria-label="Account" className="w-10 h-10 flex items-center justify-center text-ink/70 hover:text-gold transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" /></svg>
            </Link>
            <Link href="/cart" aria-label="Cart" className="relative w-10 h-10 flex items-center justify-center text-ink/70 hover:text-gold transition">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 7h12l-1 12H7L6 7z" strokeLinejoin="round" /><path d="M9 7a3 3 0 016 0" strokeLinecap="round" /></svg>
              {count > 0 && <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] rounded-full bg-gold text-ink text-[10px] flex items-center justify-center px-1">{count}</span>}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="md:hidden text-ink w-9 h-9 flex items-center justify-center"
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}
              </svg>
            </button>
          </div>
        </div>

        {open && (
          <nav className="md:hidden border-t border-ink/10 bg-cream px-6 pb-6">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="block py-4 text-ink/75 text-[13px] tracking-tracksm uppercase border-b border-cream/10 last:border-0"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        )}
      <SearchOverlay open={search} onClose={() => setSearch(false)} />
      </header>
    </>
  );
}



