"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { products, type Product } from "@/lib/products";

type Line = { slug: string; qty: number };
type Ctx = {
  lines: Line[];
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  items: { product: Product; qty: number }[];
};

const CartContext = createContext<Ctx | null>(null);
const KEY = "mk-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Line[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = (slug: string, qty = 1) =>
    setLines((prev) => {
      const found = prev.find((l) => l.slug === slug);
      if (found) return prev.map((l) => (l.slug === slug ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { slug, qty }];
    });

  const setQty = (slug: string, qty: number) =>
    setLines((prev) => (qty < 1 ? prev.filter((l) => l.slug !== slug) : prev.map((l) => (l.slug === slug ? { ...l, qty } : l))));

  const remove = (slug: string) => setLines((prev) => prev.filter((l) => l.slug !== slug));
  const clear = () => setLines([]);

  const items = lines
    .map((l) => ({ product: products.find((p) => p.slug === l.slug)!, qty: l.qty }))
    .filter((i) => i.product);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = items.reduce((n, i) => n + (i.product.price ?? 0) * i.qty, 0);

  return (
    <CartContext.Provider value={{ lines, add, setQty, remove, clear, count, subtotal, items }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}