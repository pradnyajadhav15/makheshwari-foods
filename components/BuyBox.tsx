"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { FREE_SHIPPING_OVER } from "@/lib/products";

export default function BuyBox({
  slug,
  inStock,
  stock,
}: {
  slug: string;
  inStock: boolean;
  stock?: number;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const router = useRouter();

  // Never let the customer add more than we can ship.
  const max = typeof stock === "number" && stock > 0 ? Math.min(20, stock) : 20;
  const atMax = qty >= max;

  const addNow = () => {
    add(slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const buyNow = () => {
    add(slug, qty);
    router.push("/checkout");
  };

  if (!inStock) {
    return (
      <div>
        <button type="button" disabled className="btn btn-primary btn-block">
          Out of stock
        </button>
        <p className="text-ink/50 text-sm text-center mt-3 font-light">
          Back soon.{" "}
          <a
            href="https://wa.me/917485001464"
            target="_blank"
            rel="noopener noreferrer"
            className="text-golddeep underline underline-offset-2"
          >
            Message us on WhatsApp
          </a>{" "}
          to be told first.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-stretch gap-3">
        <div className="flex items-center border border-ink/20 rounded-full shrink-0">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            disabled={qty <= 1}
            className="w-12 h-12 flex items-center justify-center text-ink/70 hover:text-ink transition disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
          <span className="w-8 text-center text-ink tabular-nums" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            aria-label="Increase quantity"
            disabled={atMax}
            className="w-12 h-12 flex items-center justify-center text-ink/70 hover:text-ink transition disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <button type="button" onClick={addNow} className="btn btn-outline flex-1">
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>

      <button type="button" onClick={buyNow} className="btn btn-primary btn-block mt-3">
        Buy it now
      </button>

      {atMax && typeof stock === "number" && stock < 20 && (
        <p className="text-ink/50 text-xs mt-3 font-light">That is all we have right now.</p>
      )}

      {/* Reassurance sits directly under the CTA, where it does the most work */}
      <ul className="mt-6 space-y-2.5">
        {[
          `Free shipping over ₹${FREE_SHIPPING_OVER}`,
          "Dispatched within 2 working days",
          "Sealed the day it is packed",
        ].map((t) => (
          <li key={t} className="flex items-center gap-2.5 text-ink/60 text-[0.84rem] font-light">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-mint shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
