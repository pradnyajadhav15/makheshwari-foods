"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";

export default function BuyBox({ slug, inStock, stock }: { slug: string; inStock: boolean; stock?: number }) {
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
        <button type="button" disabled className="w-full bg-ink/25 text-cream rounded-full py-5 text-[12px] tracking-tracksm uppercase cursor-not-allowed">
          Out of stock
        </button>
        <p className="text-ink/45 text-xs text-center mt-3 font-light">
          Back soon. Message us on WhatsApp to be told first.
        </p>
      </div>
    );
  }

  return (
    <div>
      {typeof stock === "number" && stock > 0 && stock <= 5 && (
        <p className="text-gold text-[11px] tracking-tracksm uppercase mb-4">
          Only {stock} left
        </p>
      )}

      <div className="flex flex-wrap items-stretch gap-3">
        <div className="flex items-center border border-ink/20 rounded-full">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease" className="w-11 h-full text-ink/60 hover:text-ink transition">&minus;</button>
          <span className="w-9 text-center text-ink">{qty}</span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(max, q + 1))}
            aria-label="Increase"
            disabled={atMax}
            className="w-11 h-full text-ink/60 hover:text-ink transition disabled:opacity-30 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>

        <button type="button" onClick={addNow} className="flex-1 min-w-[10rem] border border-ink text-ink rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition">
          {added ? "Added to cart" : "Add to cart"}
        </button>

        <button type="button" onClick={buyNow} className="flex-1 min-w-[10rem] bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
          Buy it now
        </button>
      </div>

      {atMax && typeof stock === "number" && stock < 20 && (
        <p className="text-ink/45 text-xs mt-3 font-light">That is all we have right now.</p>
      )}
    </div>
  );
}