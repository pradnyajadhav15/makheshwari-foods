"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { formatPrice, accentClass, FREE_SHIPPING_OVER } from "@/lib/products";

export default function CartPage() {
  const { items, setQty, remove, subtotal, count } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_OVER || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;
  const away = FREE_SHIPPING_OVER - subtotal;

  if (count === 0) {
    return (
      <section className="bg-cream px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-ink mb-5">Your cart is empty</h1>
        <p className="text-ink/55 font-light mb-10">Nothing in here yet.</p>
        <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-11 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
          Shop the range
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-cream px-6 md:px-14 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-3">Your cart</h1>
        <p className="text-ink/50 text-sm font-light mb-10">{count} item{count > 1 ? "s" : ""}</p>

        {away > 0 && (
          <div className="bg-gold/15 border border-gold/40 rounded-xl px-6 py-4 mb-8 text-center text-ink/70 text-sm font-light">
            Add {formatPrice(away)} more for free shipping
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 space-y-5">
            {items.map(({ product: p, qty }) => (
              <div key={p.slug} className="bg-white rounded-[1.25rem] border border-ink/10 overflow-hidden flex">
                <div className={`w-1.5 ${accentClass[p.accent]}`} />
                <div className="flex-1 p-6 flex flex-wrap items-center gap-5">
                  <img src={`/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`} alt={p.name} className="w-20 h-20 object-contain" />
                  <div className="flex-1 min-w-[9rem]">
                    <Link href={`/shop/makhana/${p.slug}`} className="font-display text-xl text-ink hover:text-gold transition">{p.name}</Link>
                    <p className="text-ink/45 text-xs mt-1.5">{p.weightG} g</p>
                  </div>
                  <div className="flex items-center border border-ink/15 rounded-full">
                    <button type="button" onClick={() => setQty(p.slug, qty - 1)} aria-label="Decrease" className="w-9 h-9 text-ink/60 hover:text-ink transition">&minus;</button>
                    <span className="w-8 text-center text-sm text-ink">{qty}</span>
                    <button type="button" onClick={() => setQty(p.slug, qty + 1)} aria-label="Increase" className="w-9 h-9 text-ink/60 hover:text-ink transition">+</button>
                  </div>
                  <div className="text-right min-w-[5rem]">
                    <p className="font-display text-lg text-ink">{formatPrice((p.price ?? 0) * qty)}</p>
                    <button type="button" onClick={() => remove(p.slug)} className="text-ink/35 text-[10px] tracking-tracksm uppercase mt-1.5 hover:text-peri transition">Remove</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="bg-white rounded-[1.25rem] border border-ink/10 p-7 sticky top-28">
              <h2 className="font-display text-xl text-ink mb-6">Summary</h2>
              <div className="space-y-3.5 text-sm font-light border-b border-ink/10 pb-5 mb-5">
                <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span className="text-ink">{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              </div>
              <div className="flex justify-between items-baseline mb-2">
                <span className="text-ink/60 text-sm">Total</span>
                <span className="font-display text-2xl text-ink">{formatPrice(total)}</span>
              </div>
              <p className="text-ink/40 text-[11px] mb-7">Inclusive of all taxes</p>
              <Link href="/checkout" className="block w-full text-center bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">Checkout</Link>
              <Link href="/shop" className="block text-center text-ink/50 text-[11px] tracking-tracksm uppercase mt-5 hover:text-gold transition">
                Continue shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}