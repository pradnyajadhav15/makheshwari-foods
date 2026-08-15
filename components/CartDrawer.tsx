"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice, accentClass, FREE_SHIPPING_OVER } from "@/lib/products";

export default function CartDrawer() {
  const { items, count, subtotal, setQty, remove, drawerOpen, closeDrawer } = useCart();
  const pathname = usePathname();

  const away = FREE_SHIPPING_OVER - subtotal;
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_OVER) * 100));

  /* Never cover the cart or checkout pages — the drawer would just be
     a second copy of what the customer is already looking at. */
  const suppressed = pathname === "/cart" || pathname === "/checkout" || pathname?.startsWith("/admin");
  const open = drawerOpen && !suppressed;

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeDrawer();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeDrawer]);

  return (
    <div
      className={`fixed inset-0 z-[70] transition-opacity duration-300 ${
        open ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      <div
        aria-hidden="true"
        onClick={closeDrawer}
        className="absolute inset-0 bg-inkdeep/55 backdrop-blur-sm"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`absolute inset-y-0 right-0 w-full max-w-md bg-paper flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <header className="flex items-center justify-between px-5 sm:px-6 h-[4.5rem] border-b border-ink/12 shrink-0">
          <p className="marker">
            Your cart {count > 0 && `· ${count}`}
          </p>
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close cart"
            tabIndex={open ? 0 : -1}
            className="-mr-2 w-11 h-11 flex items-center justify-center text-ink hover:text-golddeep transition"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {count === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
            <p className="font-display text-2xl text-ink">Nothing in here yet</p>
            <p className="text-ink/70 body-text mt-2 mb-7">
              Three flavours, roasted in Samastipur.
            </p>
            <Link href="/shop" onClick={closeDrawer} className="btn btn-primary" tabIndex={open ? 0 : -1}>
              Shop the range
            </Link>
          </div>
        ) : (
          <>
            {/* Free-shipping nudge */}
            <div className="px-5 sm:px-6 py-4 border-b border-ink/12 shrink-0">
              {away > 0 ? (
                <>
                  <p className="text-ink/75 text-[0.82rem]">
                    Add <strong className="font-medium">{formatPrice(away)}</strong> more for free shipping
                  </p>
                  <div className="h-1.5 bg-ink/10 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </>
              ) : (
                <p className="text-mintdeep text-[0.82rem] flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Free shipping unlocked
                </p>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              {items.map(({ product: p, qty }) => (
                <div key={p.slug} className="flex gap-4 py-5 border-b border-ink/12">
                  <Link
                    href={`/shop/makhana/${p.slug}`}
                    onClick={closeDrawer}
                    tabIndex={open ? 0 : -1}
                    className="relative w-20 h-20 shrink-0 bg-white border border-ink/10 overflow-hidden"
                  >
                    <span className={`absolute top-0 left-0 w-full h-1 ${accentClass[p.accent]}`} />
                    <Image
                      src={`/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                      alt={p.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain p-1.5"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between gap-3">
                      <Link
                        href={`/shop/makhana/${p.slug}`}
                        onClick={closeDrawer}
                        tabIndex={open ? 0 : -1}
                        className="font-display text-lg text-ink hover:text-golddeep transition leading-tight"
                      >
                        {p.name}
                      </Link>
                      <p className="font-display text-base text-ink shrink-0">
                        {formatPrice((p.price ?? 0) * qty)}
                      </p>
                    </div>
                    <p className="text-ink/70 text-xs mt-0.5">{p.weightG} g</p>

                    <div className="flex items-center justify-between gap-3 mt-3">
                      <div className="flex items-center border border-ink/18 rounded-full">
                        <button
                          type="button"
                          onClick={() => setQty(p.slug, qty - 1)}
                          aria-label={`Decrease ${p.name} quantity`}
                          tabIndex={open ? 0 : -1}
                          className="w-9 h-9 flex items-center justify-center text-ink/70 hover:text-ink transition"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14" strokeLinecap="round" />
                          </svg>
                        </button>
                        <span className="w-7 text-center text-sm text-ink tabular-nums">{qty}</span>
                        <button
                          type="button"
                          onClick={() => setQty(p.slug, qty + 1)}
                          aria-label={`Increase ${p.name} quantity`}
                          tabIndex={open ? 0 : -1}
                          className="w-9 h-9 flex items-center justify-center text-ink/70 hover:text-ink transition"
                        >
                          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(p.slug)}
                        tabIndex={open ? 0 : -1}
                        className="text-ink/70 text-[0.62rem] tracking-tracksm uppercase hover:text-perideep transition py-2"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <footer className="border-t border-ink/12 px-5 sm:px-6 py-5 shrink-0 bg-sandsoft/40">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-ink/70 text-sm">Subtotal</span>
                <span className="font-display text-2xl text-ink">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-ink/70 text-[11px] mb-5">
                Shipping and taxes calculated at checkout
              </p>

              <Link
                href="/checkout"
                onClick={closeDrawer}
                tabIndex={open ? 0 : -1}
                className="btn btn-primary btn-block"
              >
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeDrawer}
                tabIndex={open ? 0 : -1}
                className="block text-center text-ink/70 text-[0.66rem] tracking-tracksm uppercase mt-4 py-2 hover:text-golddeep transition"
              >
                View full cart
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
