"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  { src: "/products/hero-masala.jpg", label: "Peri Peri", tint: "#D8503C", bg: "#D3A292" },
  { src: "/products/hero-mint.jpg", label: "Garden Mint", tint: "#5F8C42", bg: "#AAC38C" },
  { src: "/products/hero-plain.jpg", label: "Himalayan Pink Salt", tint: "#C2748A", bg: "#D5A3B0" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 3000);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative overflow-hidden transition-colors duration-1000 ease-out"
      style={{ backgroundColor: slides[i].bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-10 px-6 md:px-12 py-16 md:py-24">

        <div className="relative aspect-square max-w-xl mx-auto w-full">
          <div className="absolute inset-0 rounded-full bg-cream/40 blur-2xl scale-90" />
          {slides.map((s, idx) => (
            <div
              key={s.src}
              className="absolute inset-0 transition-all duration-1000 ease-out"
              style={{ opacity: idx === i ? 1 : 0, transform: idx === i ? "scale(1)" : "scale(0.92)" }}
            >
              <img src={s.src} alt={s.label} className="w-full h-full object-cover rounded-full shadow-[0_35px_70px_-20px_rgba(18,53,42,0.5)]" />
            </div>
          ))}
        </div>

        <div className="text-center md:text-left">
          <span className="inline-block text-ink/55 text-[11px] tracking-track uppercase mb-6">
            Our most loved crunch
          </span>

          <h1 className="font-display text-ink text-5xl md:text-7xl leading-[1.03]">
            Savour every.
            <br />
            last. bite.
          </h1>

          <div className="h-8 mt-7">
            {slides.map((s, idx) => (
              <p
                key={s.src}
                className="text-lg font-light transition-all duration-700"
                style={{
                  color: s.tint,
                  opacity: idx === i ? 1 : 0,
                  transform: `translateY(${idx === i ? 0 : 14}px)`,
                  display: idx === i ? "block" : "none",
                }}
              >
                {s.label}
              </p>
            ))}
          </div>

          <Link href="/shop" className="inline-block mt-9 bg-ink text-cream px-12 py-4 rounded-full text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition duration-300">
            Shop all &rarr;
          </Link>

          <div className="flex items-center justify-center md:justify-start gap-2.5 mt-12">
            {slides.map((s, idx) => (
              <button
                key={s.src}
                onClick={() => setI(idx)}
                aria-label={`Show ${s.label}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-10 bg-ink" : "w-1.5 bg-ink/30 hover:bg-ink/60"}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
