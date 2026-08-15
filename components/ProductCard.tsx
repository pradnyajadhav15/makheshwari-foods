"use client";

import Link from "next/link";
import Image from "next/image";
import AddToCart from "@/components/AddToCart";
import { accentClass, formatPrice, type Product } from "@/lib/products";

type CardProduct = Product & { stock?: number; lowStock?: boolean };

export default function ProductCard({ product: p }: { product: CardProduct }) {
  const img = `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`;
  const sold = p.inStock === false;
  const href = `/shop/makhana/${p.slug}`;

  const saving =
    p.mrp && p.price && p.mrp > p.price
      ? Math.round(((p.mrp - p.price) / p.mrp) * 100)
      : null;

  return (
    <article className="pcard">
      {/* Flavour accent — a real field at the top of the card rather than a 1px stripe */}
      <div className={`h-1.5 ${accentClass[p.accent]}`} />

      <Link href={href} className="pcard-media" aria-label={p.name}>
        <Image
          src={img}
          alt={p.name}
          width={520}
          height={520}
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 340px"
          className={sold ? "opacity-40 grayscale" : ""}
        />

        {sold && (
          <span className="absolute top-3 left-3 bg-ink text-cream text-[0.6rem] tracking-tracksm uppercase px-3 py-1.5 rounded-full">
            Sold out
          </span>
        )}
        {!sold && p.lowStock && (
          <span className="absolute top-3 left-3 bg-gold text-ink text-[0.6rem] tracking-tracksm uppercase px-3 py-1.5 rounded-full">
            Only {p.stock} left
          </span>
        )}
        {!sold && saving && (
          <span className="absolute top-3 right-3 bg-ink/90 text-cream text-[0.6rem] tracking-tracksm uppercase px-3 py-1.5 rounded-full">
            {saving}% off
          </span>
        )}
      </Link>

      <div className="flex flex-col flex-1 p-4 sm:p-5 lg:p-6">
        <h3 className="font-display text-xl sm:text-2xl leading-tight text-ink">
          <Link href={href} className="hover:text-golddeep transition">
            {p.name}
          </Link>
        </h3>

        <p className="text-ink/70 text-[0.82rem] font-light leading-snug mt-2 line-clamp-2">
          {p.hook}
        </p>

        {/* Price block — prominent, with MRP and pack size sitting under it */}
        <div className="mt-4 sm:mt-5 pt-4 border-t border-ink/10">
          <div className="flex items-baseline flex-wrap gap-x-2.5 gap-y-1">
            <span className="font-display text-xl sm:text-2xl text-ink">
              {formatPrice(p.price)}
            </span>
            {p.mrp && p.price && p.mrp > p.price && (
              <span className="text-ink/70 text-sm line-through">{formatPrice(p.mrp)}</span>
            )}
          </div>
          <p className="text-ink/70 text-[0.72rem] mt-1">
            {p.weightG} g · incl. of all taxes
          </p>
        </div>

        {/* Always-visible action. The old card hid this behind :hover. */}
        <div className="mt-auto pt-4 sm:pt-5">
          {sold ? (
            <button type="button" disabled className="btn btn-outline btn-block">
              Sold out
            </button>
          ) : (
            <AddToCart slug={p.slug} className="btn btn-primary btn-block" />
          )}
        </div>
      </div>
    </article>
  );
}
