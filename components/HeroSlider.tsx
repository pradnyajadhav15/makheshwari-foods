"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import SplitReveal from "@/components/SplitReveal";
import SeedField from "@/components/SeedField";
import LotusRing from "@/components/LotusRing";
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

      <div className="relative max-w-7xl mx-auto grid md:grid-cols-2 items-center min-h-[26rem] md:min-h-[36rem] py-10 md:py-16">

        <div className="relative h-[22rem] sm:h-[28rem] md:h-full order-1">
          <div className="absolute left-1/2 md:left-[46%] top-1/2 -translate-x-1/2 -translate-y-1/2 h-[92%] md:h-[96%] aspect-square text-gold">
            <LotusRing cycles={2} />

            <div className="absolute inset-[14%] rounded-full overflow-hidden shadow-[0_40px_90px_-35px_rgba(0,0,0,0.55)]">
              {slides.map((sl, idx) => (
                <div
                  key={sl.src}
                  className="absolute inset-0 transition-all duration-[900ms] ease-out"
                  style={{ opacity: idx === i ? 1 : 0, transform: idx === i ? "scale(1)" : "scale(1.06)" }}
                >
                  <Image
                    src={sl.src}
                    alt={sl.label}
                    fill
                    sizes="(max-width: 768px) 90vw, 32rem"
                    priority={idx === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10 order-2 px-6 md:pl-8 md:pr-12 py-10 md:py-16 text-center md:text-left">
          <h1 className="font-display text-cream text-4xl sm:text-5xl md:text-[3.4rem] lg:text-[3.9rem] leading-[1.1] uppercase tracking-[0.01em]">
            <SplitReveal text={"Savour every.\nlast. bite."} delay={200} />
          </h1>

          <Magnetic className="mt-10 md:mt-12">
            <Ripple className="rounded-lg text-cream/40">
              <Link
                href="/shop"
                className="inline-block bg-ink text-cream px-12 py-5 rounded-lg text-[12px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition duration-300"
              >
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