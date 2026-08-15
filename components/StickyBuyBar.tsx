"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { formatPrice } from "@/lib/products";

/**
 * Mobile-only sticky buy bar. Slides in once the primary BuyBox has
 * scrolled out of view, so the add-to-cart is never more than a tap away
 * on a phone — where most of the traffic is.
 */
export default function StickyBuyBar({
  slug,
  name,
  price,
  inStock,
}: {
  slug: string;
  name: string;
  price: number | null;
  inStock: boolean;
}) {
  const { add } = useCart();
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const target = document.getElementById("buybox-anchor");
    if (!target) return;

    const io = new IntersectionObserver(
      ([e]) => setShown(!e.isIntersecting && e.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (!inStock) return null;

  const onAdd = () => {
    add(slug, 1);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={`buybar ${shown ? "is-shown" : ""}`} aria-hidden={!shown}>
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-display text-base text-ink truncate leading-tight">{name}</p>
          <p className="text-ink/55 text-xs mt-0.5">{formatPrice(price)}</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          tabIndex={shown ? 0 : -1}
          className="btn btn-primary shrink-0 px-7"
        >
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
    </div>
  );
}
