"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SLIDES = [
  { src: "/hero/peri-peri.jpg", alt: "Peri peri roasted makhana in a terracotta bowl" },
  { src: "/hero/garden-mint.jpg", alt: "Garden mint roasted makhana in a terracotta bowl" },
  { src: "/hero/pink-salt.jpg", alt: "Himalayan pink salt roasted makhana in a terracotta bowl" },
];

const INTERVAL = 3000;

export default function HeroVideo() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (paused) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), INTERVAL);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <section
      className="relative isolate overflow-hidden bg-ink sm:flex sm:items-center sm:min-h-[min(88svh,52rem)]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-figure">
        {SLIDES.map((s, n) => (
          <Image
            key={s.src}
            src={s.src}
            alt={n === 0 ? s.alt : ""}
            fill
            priority={n === 0}
            loading={n === 0 ? undefined : "lazy"}
            sizes="100vw"
            aria-hidden={n !== i}
            className={`object-cover object-center transition-opacity duration-700 ${
              n === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}

        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-ink/10 via-ink/30 to-ink sm:bg-gradient-to-r sm:from-ink/90 sm:via-ink/60 sm:to-ink/20" />

        <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 z-10 flex gap-2.5">
          {SLIDES.map((s, n) => (
            <button
              key={s.src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`Show slide ${n + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                n === i ? "w-7 bg-cream" : "w-1.5 bg-cream/40 hover:bg-cream/70"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="wrap relative z-10 w-full pb-14 pt-8 sm:py-24">
        <div className="max-w-2xl">
          <p className="marker marker-light mb-6 animate-fade-up">
            Pond-grown in Samastipur, Bihar
          </p>

          <h1 className="display-xl text-cream animate-fade-up" style={{ animationDelay: "90ms" }}>
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
            className="mt-9 flex flex-wrap items-center gap-6 animate-fade-up"
            style={{ animationDelay: "270ms" }}
          >
            <Link href="/shop" className="btn btn-light">
              Shop the range
            </Link>
            <Link href="/know-your-makhana" className="link-quiet text-cream/80 hover:text-cream">
              Know your makhana {"\u2192"}
            </Link>
          </div>

          <p
            className="text-cream/70 text-[0.7rem] tracking-tracksm uppercase mt-8 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            FSSAI licensed {"\u00B7"} Free shipping over {"\u20B9"}499
          </p>
        </div>
      </div>
    </section>
  );
}