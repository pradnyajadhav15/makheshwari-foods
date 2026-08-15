"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import SearchOverlay from "@/components/SearchOverlay";
import AnnouncementBar from "@/components/AnnouncementBar";

/* Subscribing to scroll position via useSyncExternalStore rather than an
   effect keeps the initial value correct on a page loaded mid-scroll
   without setting state during the effect. */
function subscribeScroll(cb: () => void) {
  window.addEventListener("scroll", cb, { passive: true });
  return () => window.removeEventListener("scroll", cb);
}

const nav = [
  { href: "/shop", label: "Shop" },
  { href: "/our-story", label: "Our story" },
  { href: "/know-your-makhana", label: "Know your makhana" },
  { href: "/recipes", label: "Recipes" },
  { href: "/bulk-orders", label: "Bulk orders" },
  { href: "/contact", label: "Contact" },
];

/* Shown in the mobile drawer only — secondary destinations. */
const navSecondary = [
  { href: "/faq", label: "FAQ" },
  { href: "/shipping-returns", label: "Shipping & returns" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const { count } = useCart();
  const pathname = usePathname();

  /* Condense the bar once the user leaves the top of the page. */
  const scrolled = useSyncExternalStore(
    subscribeScroll,
    () => window.scrollY > 12,
    () => false
  );

  /* Lock the page behind the open drawer. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname?.startsWith(href);

  return (
    <>
      <AnnouncementBar />

      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-md border-b border-ink/10">
        <div className="wrap">
          <div
            className={`flex items-center justify-between gap-4 transition-[height] duration-300 ${
              scrolled ? "h-16 lg:h-20" : "h-[4.5rem] lg:h-24"
            }`}
          >
            {/* Left: menu on mobile, wordmark on desktop */}
            <div className="flex items-center gap-1 lg:hidden">
              <button
                type="button"
                onClick={() => setOpen(true)}
                aria-label="Open menu"
                aria-expanded={open}
                className="-ml-2 w-11 h-11 flex items-center justify-center text-ink"
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 7h18M3 12h18M3 17h18" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <Link
              href="/"
              aria-label="Makheshwari Foods — home"
              className="shrink-0 lg:mr-4"
            >
              <Image
                src="/brand/logo.png"
                alt="Makheshwari Foods"
                width={330}
                height={190}
                priority
                className={`w-auto transition-[height] duration-300 ${
                  scrolled ? "h-11 lg:h-14" : "h-12 lg:h-16"
                }`}
              />
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-7 xl:gap-9 flex-1">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`link-quiet ${
                    isActive(n.href) ? "text-ink" : "text-ink/65 hover:text-ink"
                  }`}
                  aria-current={isActive(n.href) ? "page" : undefined}
                >
                  {n.label}
                </Link>
              ))}
            </nav>

            {/* Right: utilities */}
            <div className="flex items-center gap-0.5 sm:gap-1">
              <button
                type="button"
                onClick={() => setSearch(true)}
                aria-label="Search"
                className="w-11 h-11 flex items-center justify-center text-ink/70 hover:text-gold transition"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.6-3.6" strokeLinecap="round" />
                </svg>
              </button>

              <Link
                href="/account"
                aria-label="Account"
                className="hidden sm:flex w-11 h-11 items-center justify-center text-ink/70 hover:text-gold transition"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <circle cx="12" cy="8" r="3.4" />
                  <path d="M5 20c0-3.5 3.1-6 7-6s7 2.5 7 6" strokeLinecap="round" />
                </svg>
              </Link>

              <Link
                href="/cart"
                aria-label={count > 0 ? `Cart, ${count} item${count === 1 ? "" : "s"}` : "Cart"}
                className="relative w-11 h-11 flex items-center justify-center text-ink/70 hover:text-gold transition"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M6 7h12l-1 12H7L6 7z" strokeLinejoin="round" />
                  <path d="M9 7a3 3 0 016 0" strokeLinecap="round" />
                </svg>
                {count > 0 && (
                  <span className="absolute top-1 right-0.5 min-w-[17px] h-[17px] rounded-full bg-gold text-ink text-[10px] font-medium flex items-center justify-center px-1 tabular-nums">
                    {count}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        {/* Backdrop is decorative — the labelled close control is the X
            button inside the panel, so this must not also be a button or
            the accessible name is duplicated. */}
        <div
          aria-hidden="true"
          onClick={() => setOpen(false)}
          className="absolute inset-0 bg-inkdeep/55 backdrop-blur-sm"
        />

        <nav
          className={`absolute inset-y-0 left-0 w-[86%] max-w-sm bg-paper flex flex-col transition-transform duration-300 ease-out ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Main"
        >
          <div className="flex items-center justify-between px-6 h-[4.5rem] border-b border-ink/10">
            <span className="marker">Menu</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="-mr-2 w-11 h-11 flex items-center justify-center text-ink"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-6">
            <ul>
              {nav.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center justify-between py-4 border-b border-ink/10 font-display text-2xl ${
                      isActive(n.href) ? "text-gold" : "text-ink"
                    }`}
                  >
                    {n.label}
                    <svg viewBox="0 0 24 24" className="w-4 h-4 text-ink/30" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-7 space-y-1">
              {navSecondary.map((n) => (
                <li key={n.href}>
                  <Link
                    href={n.href}
                    onClick={() => setOpen(false)}
                    className="block py-2.5 text-ink/60 body-text"
                  >
                    {n.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/account"
                  onClick={() => setOpen(false)}
                  className="block py-2.5 text-ink/60 body-text"
                >
                  Your account
                </Link>
              </li>
            </ul>
          </div>

          <div className="px-6 py-5 border-t border-ink/10 bg-sandsoft/50">
            <a
              href="https://wa.me/917485001464"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary btn-block"
            >
              Message us on WhatsApp
            </a>
            <p className="text-center text-ink/45 text-[11px] mt-3">
              Samastipur, Bihar · FSSAI licensed
            </p>
          </div>
        </nav>
      </div>

      <SearchOverlay open={search} onClose={() => setSearch(false)} />
    </>
  );
}
