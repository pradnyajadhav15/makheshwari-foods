"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    // already buffered from cache before React hydrated
    if (v.readyState >= 2) setReady(true);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    v.play().catch(() => {});
  }, []);

  return (
    <section className="relative isolate w-full h-[78vh] h-[78dvh] min-h-[520px] max-h-[900px] overflow-hidden bg-ink">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/video/poster.jpg)" }}
      />

      <video
        ref={ref}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        poster="/video/poster.jpg"
        muted
        loop
        autoPlay
        playsInline
        preload="auto"
        onLoadedData={() => setReady(true)}
        onCanPlay={() => setReady(true)}
      >
        <source src="/video/hero.webm" type="video/webm" />
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/30 to-ink/70" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p className="text-gold text-[11px] tracking-track uppercase mb-6">
          Pond-grown in Samastipur, Bihar
        </p>

        <h1 className="font-display text-cream text-4xl md:text-6xl lg:text-7xl leading-[1.05] mb-7">
          Roasted makhana,
          <br />
          straight from the source
        </h1>

        <p className="text-cream/70 font-light text-base md:text-lg max-w-xl leading-relaxed mb-10">
          Plant based, gluten free, single ingredient. Nothing to hide behind.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/shop"
            className="bg-cream text-ink rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold transition"
          >
            Shop all flavours
          </Link>
          <Link
            href="/know-your-makhana"
            className="border border-cream/40 text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-cream/10 transition"
          >
            Know your makhana
          </Link>
        </div>
      </div>
    </section>
  );
}