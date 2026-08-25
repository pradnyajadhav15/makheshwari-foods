"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCart({ slug, className = "" }: { slug: string; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* The old version left this timeout running. Navigate away inside 1600ms
     and it fires setState on an unmounted component. */
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const click = () => {
    add(slug);
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1600);
  };

  return (
    <button
      type="button"
      onClick={click}
      aria-live="polite"
      className={className || "inline-block border border-ink text-ink rounded-full px-9 py-3 text-[10px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition duration-300"}
    >
      {done ? "Added \u2713" : "Add to cart"}
    </button>
  );
}