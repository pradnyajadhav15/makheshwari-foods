"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

export default function AddToCart({ slug, className = "" }: { slug: string; className?: string }) {
  const { add } = useCart();
  const [done, setDone] = useState(false);

  const click = () => {
    add(slug);
    setDone(true);
    setTimeout(() => setDone(false), 1600);
  };

  return (
    <button type="button" onClick={click} className={className || "inline-block border border-ink text-ink rounded-full px-9 py-3 text-[10px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition duration-300"}>
      {done ? "Added" : "Add to cart"}
    </button>
  );
}