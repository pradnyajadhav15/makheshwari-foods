"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/* NOTE: /video/poster.jpg and /video/hero.webm were referenced by the old
   hero but do not exist in /public — the poster 404'd on every load. Using
   the one landscape brand still we have until a real poster frame and a
   webm encode are added. */
const POSTER = "/brand/story-hero.jpg";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    if (v.readyState >= 2) setReady(true);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="hero flex items-end lg:items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${POSTER})` }}
        aria-hidden="true"
      />

      <video
        ref={ref}
        className={`hero-media ${ready ? "is-ready" : ""}`}
        poster={POSTER}
        muted
        loop
        autoPlay
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="hero-scrim" />

      <div className="wrap relative z-10 w-full pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-0">
        <div className="max-w-2xl">
          <p className="marker marker-light mb-6 animate-fade-up">
            Pond-grown in Samastipur, Bihar
          </p>

          <h1
            className="display-xl text-cream animate-fade-up"
            style={{ animationDelay: "90ms" }}
          >
            Roasted where
            <br />
            it grows.
          </h1>

          <p
            className="lede text-cream/75 mt-6 max-w-md animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Whole makhana from the ponds of the Mithila belt. Hot-air roasted, never fried, and
            sealed the day it is packed.
          </p>

          <div
            className="mt-9 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "270ms" }}
          >
            <Link href="/shop" className="btn btn-light">
              Shop the range
            </Link>
            <Link href="/know-your-makhana" className="btn btn-ghost-light">
              Know your makhana
            </Link>
          </div>

          <p
            className="text-cream/50 text-[0.7rem] tracking-tracksm uppercase mt-8 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            FSSAI licensed · Free shipping over ₹499
          </p>
        </div>
      </div>
    </section>
  );
}
