"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SplitReveal from "@/components/SplitReveal";
import SeedField from "@/components/SeedField";
import { Magnetic, Ripple } from "@/components/Motion";

const slides = [
  { src: "/products/hero-masala.jpg", label: "Peri Peri", note: "Fire & smoke. Bring water.", tint: "#F0A896", bg: "#8C2F22" },
  { src: "/products/hero-mint.jpg", label: "Garden Mint", note: "Cool crunch. Cold and clean.", tint: "#A9C97E", bg: "#1E4025" },
  { src: "/products/hero-plain.jpg", label: "Himalayan Pink Salt", note: "The plain one. You will finish it.", tint: "#F2B79E", bg: "#8E4A36" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setI((v) => (v + 1) % slides.length), 2000);
    return () => clearInterval(t);
  }, [paused]);

  const s = slides[i];

  return (
    <section
      className="relative overflow-hidden transition-colors duration-[900ms] ease-out"
      style={{ backgroundColor: s.bg }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <SeedField count={14} />

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 items-center gap-12 px-6 md:px-12 py-16 md:py-24">

        <div className="relative mx-auto w-full max-w-[26rem] md:max-w-[34rem]">
          <div className="relative aspect-square w-full overflow-hidden rounded-full ring-1 ring-cream/20 shadow-2xl">
            {slides.map((sl, idx) => (
              <div
                key={sl.src}
                className="absolute inset-0 transition-all duration-[900ms] ease-out"
                style={{ opacity: idx === i ? 1 : 0, transform: idx === i ? "scale(1)" : "scale(1.06)" }}
              >
                <img src={sl.src} alt={sl.label} className="w-full h-full object-cover" />
              </div>
            ))}
            <span className="absolute inset-0 rounded-full bg-gradient-to-t from-ink/35 via-transparent to-transparent" aria-hidden="true" />
          </div>

          <div key={s.src} className="mt-8 text-center animate-fade-up">
            <p className="font-display text-cream text-3xl md:text-4xl leading-tight">{s.label}</p>
            <p className="text-cream/70 text-[11px] tracking-tracksm uppercase mt-2.5">{s.note}</p>
          </div>
        </div>

        <div className="text-center md:text-left">
          <span className="inline-flex items-center gap-2.5 text-cream/65 text-[11px] tracking-track uppercase mb-6">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: s.tint, transition: "background-color 2s" }} />
            Our most loved crunch
          </span>

          <h1 className="font-display text-cream text-5xl md:text-7xl leading-[1.03]">
            <SplitReveal text={"Savour every.\nlast. bite."} delay={200} />
          </h1>

          <p className="text-cream/65 text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0 mt-7">
            Roasted in Samastipur, never fried. Three flavours, one honest crunch.
          </p>

          <Magnetic className="mt-10">
            <Ripple className="rounded-full text-cream/40">
              <Link href="/shop" className="inline-block bg-gold text-ink px-12 py-4 rounded-full text-[11px] tracking-tracksm uppercase hover:bg-goldsoft transition duration-300">
                Shop all &rarr;
              </Link>
            </Ripple>
          </Magnetic>

          <div className="flex items-center justify-center md:justify-start gap-2.5 mt-12">
            {slides.map((sl, idx) => (
              <button
                key={sl.src}
                onClick={() => setI(idx)}
                aria-label={`Show ${sl.label}`}
                className={`h-1.5 rounded-full transition-all duration-500 ${idx === i ? "w-10 bg-gold" : "w-1.5 bg-cream/30 hover:bg-cream/60"}`}
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}