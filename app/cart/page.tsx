"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice, accentClass, FREE_SHIPPING_OVER } from "@/lib/products";
import { Skeleton } from "@/components/Skeleton";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count, ready } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;
  const away = FREE_SHIPPING_OVER - subtotal;
  const [minOrder, setMinOrder] = useState(0);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => setMinOrder(Number(s?.min_order) || 0))
      .catch(() => {});
  }, []);

  const short = minOrder - subtotal;
  const pct = Math.min(100, Math.round((subtotal / FREE_SHIPPING_OVER) * 100));

  /* Until localStorage has been read, `count` is 0 for everyone — showing
     the empty state here would flash "your cart is empty" at customers
     who do have items. */
  if (!ready) {
    return (
      <section className="wrap section" aria-busy="true">
        <p className="marker mb-5">Cart</p>
        <Skeleton className="h-10 w-56 mb-10" />
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          <div className="border-t border-ink/12">
            {[0, 1].map((i) => (
              <div key={i} className="flex gap-4 py-5 border-b border-ink/12">
                <Skeleton className="w-20 h-20 sm:w-24 sm:h-24 shrink-0" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-40 mb-2" />
                  <Skeleton className="h-3 w-24 mb-5" />
                  <Skeleton className="h-10 w-32" />
                </div>
              </div>
            ))}
          </div>
          <Skeleton className="h-64 w-full" />
        </div>
        <span className="sr-only">Loading your cart</span>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="wrap section-lg text-center">
        <p className="marker marker-center mb-6">Cart</p>
        <h1 className="display-lg text-ink">Your cart is empty</h1>
        <p className="lede text-ink/70 mt-5 mb-9">Nothing in here yet.</p>
        <Link href="/shop" className="btn btn-primary">
          Shop the range
        </Link>
      </section>
    );
  }

  return (
    <section className="wrap section">
      <p className="marker mb-5">Cart</p>
      <h1 className="display-lg text-ink">Your cart</h1>
      <p className="text-ink/70 text-sm font-light mt-3 mb-9">
        {count} item{count > 1 ? "s" : ""}
      </p>

      {short > 0 && (
        <div className="border border-peri/50 bg-peri/10 px-5 py-4 mb-5 text-ink/80 body-text">
          Minimum order is {formatPrice(minOrder)}. Add {formatPrice(short)} more to check out.
        </div>
      )}

      {/* Free-shipping progress — a nudge that reliably lifts basket size */}
      {away > 0 && short <= 0 && (
        <div className="border border-gold/45 bg-gold/10 px-5 py-4 mb-8">
          <p className="text-ink/75 body-text">
            Add <strong className="font-medium">{formatPrice(away)}</strong> more for free shipping
          </p>
          <div className="h-1.5 bg-ink/10 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-[width] duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {away <= 0 && (
        <div className="border border-mint/50 bg-mint/10 px-5 py-4 mb-8 text-ink/80 body-text">
          Free shipping unlocked.
        </div>
      )}

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
        <div className="border-t border-ink/12">
          {items.map(({ product: p, qty }) => (
            <div key={p.slug} className="flex gap-4 sm:gap-5 py-5 border-b border-ink/12">
              <Link
                href={`/shop/makhana/${p.slug}`}
                className="relative w-20 h-20 sm:w-24 sm:h-24 shrink-0 bg-white border border-ink/10 overflow-hidden"
              >
                <span className={`absolute top-0 left-0 w-full h-1 ${accentClass[p.accent]}`} />
                <Image
                  src={`/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`}
                  alt={p.name}
                  width={96}
                  height={96}
                  className="w-full h-full object-contain p-2"
                />
              </Link>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/shop/makhana/${p.slug}`}
                      className="font-display text-lg sm:text-xl text-ink hover:text-golddeep transition"
                    >
                      {p.name}
                    </Link>
                    <p className="text-ink/70 text-xs mt-1">
                      {p.weightG} g · {formatPrice(p.price)} each
                    </p>
                  </div>
                  <p className="font-display text-lg text-ink shrink-0">
                    {formatPrice((p.price ?? 0) * qty)}
                  </p>
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  <div className="flex items-center border border-ink/18 rounded-full">
                    <button
                      type="button"
                      onClick={() => setQty(p.slug, qty - 1)}
                      aria-label={`Decrease ${p.name} quantity`}
                      className="w-10 h-10 flex items-center justify-center text-ink/70 hover:text-ink transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14" strokeLinecap="round" />
                      </svg>
                    </button>
                    <span className="w-8 text-center text-sm text-ink tabular-nums">{qty}</span>
                    <button
                      type="button"
                      onClick={() => setQty(p.slug, qty + 1)}
                      aria-label={`Increase ${p.name} quantity`}
                      className="w-10 h-10 flex items-center justify-center text-ink/70 hover:text-ink transition"
                    >
                      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(p.slug)}
                    className="text-ink/70 text-[0.64rem] tracking-tracksm uppercase hover:text-perideep transition py-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="border border-ink/12 bg-paper p-6 sm:p-7">
            <h2 className="display-sm text-ink mb-6">Summary</h2>

            <div className="space-y-3 body-text border-b border-ink/12 pb-5 mb-5">
              <div className="flex justify-between">
                <span className="text-ink/70">Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-ink/70">Shipping</span>
                <span className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-ink/70 text-sm">Total</span>
              <span className="font-display text-2xl md:text-3xl text-ink">
                {formatPrice(total)}
              </span>
            </div>
            <p className="text-ink/70 text-[11px] mt-1 mb-7">Inclusive of all taxes</p>

            {short > 0 ? (
              <span className="btn btn-primary btn-block" aria-disabled="true">
                Add {formatPrice(short)} more
              </span>
            ) : (
              <Link href="/checkout" className="btn btn-primary btn-block">
                Checkout
              </Link>
            )}

            <Link
              href="/shop"
              className="block text-center text-ink/70 text-[0.66rem] tracking-tracksm uppercase mt-5 py-2 hover:text-golddeep transition"
            >
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
