"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

/* Milliseconds each flavour holds before the cross-fade. */
const INTERVAL = 2000;

const FLAVOURS = [
  { id: "peri-peri", name: "Peri Peri", tag: "Slow heat that builds", src: "/hero/peri-peri.jpg" },
  { id: "garden-mint", name: "Garden Mint", tag: "Cool, green, unexpected", src: "/hero/garden-mint.jpg" },
  { id: "pink-salt", name: "Himalayan Pink Salt", tag: "Just the crunch, nothing louder", src: "/hero/pink-salt.jpg" },
  { id: "spanish-tomato", name: "Spanish Tomato", tag: "Sun-dried and smoky", src: "/hero/spanish-tomato.jpg" },
  { id: "cream-onion", name: "Cream & Onion", tag: "The one everyone finishes first", src: "/hero/cream-onion.jpg" },
  { id: "cheese-herbs", name: "Cheese & Herbs", tag: "Savoury, with oregano", src: "/hero/cheese-herbs.jpg" },
  { id: "chocolate", name: "Chocolate", tag: "Dark cocoa on a light puff", src: "/hero/chocolate.jpg" },
  { id: "salt-pepper", name: "Salt & Pepper", tag: "Cracked black, kitchen simple", src: "/hero/salt-pepper.jpg" },
];

export default function HeroVideo() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setActive((i) => (i + 1) % FLAVOURS.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="hero flex items-end lg:items-center">
      {/* The wrapper is what bounds the imagery. On phones it shrinks to a
          band at the top while the hero itself grows with the copy below,
          so the images are never asked to cover a tall portrait box. */}
      <div className="hero-figure">
        {FLAVOURS.map((f, i) => (
          <Image
            key={f.id}
            src={f.src}
            alt=""
            aria-hidden="true"
            fill
            priority={i === 0}
            sizes="100vw"
            quality={82}
            className={`object-cover transition-opacity duration-1000 ${
              active === i ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </div>

      <div className="hero-scrim" />

      {/* On phones the copy sits below the band, leaving the empty left of
          the frame unused — so the flavour caption goes there instead. Below
          640px only; wider screens use the in-flow block further down. */}
      <div className="sm:hidden absolute inset-x-0 top-0 h-[75vw] z-10 pointer-events-none flex items-start pt-[14vw] px-[clamp(1.15rem,5vw,4.5rem)]">
        <div className="relative w-[46%] h-16">
          {FLAVOURS.map((f, i) => (
            <div
              key={f.id}
              className={`absolute inset-0 transition-opacity duration-700 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            >
              <p className="font-display text-xl text-cream">{f.name}</p>
              <p className="text-cream/65 text-[0.6rem] tracking-tracksm uppercase mt-1">
                {f.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap relative z-10 w-full pt-8 pb-10 sm:pt-28 sm:pb-16 lg:pt-[5.5rem] lg:pb-0">
        <div className="max-w-2xl">
          <p className="marker marker-light mb-6 animate-fade-up">
            Pond-grown in Samastipur, Bihar
          </p>

          <h1 className="display-md text-cream animate-fade-up" style={{ animationDelay: "90ms" }}>
            Straight from
            <br />
            the pond.
          </h1>

          <p
            className="lede text-cream/75 mt-6 max-w-md animate-fade-up"
            style={{ animationDelay: "180ms" }}
          >
            Whole makhana from the ponds of the Mithila belt. Hot-air roasted, never fried, and
            sealed the day it is packed.
          </p>

          <div
            className="relative hidden sm:block h-14 mt-7 animate-fade-up"
            aria-live="off"
            style={{ animationDelay: "270ms" }}
          >
            {FLAVOURS.map((f, i) => (
              <div
                key={f.id}
                className={`absolute inset-0 transition-opacity duration-700 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              >
                <p className="font-display text-2xl text-cream">{f.name}</p>
                <p className="text-cream/60 text-[0.68rem] tracking-tracksm uppercase mt-1.5">
                  {f.tag}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-5 flex flex-wrap items-center gap-6 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            <Link href="/shop" className="btn btn-light">
              Shop the range
            </Link>
            <Link href="/know-your-makhana" className="link-quiet text-cream/75 hover:text-cream">
              Know your makhana →
            </Link>
          </div>

          <p
            className="text-cream/70 text-[0.7rem] tracking-tracksm uppercase mt-6 animate-fade-up"
            style={{ animationDelay: "450ms" }}
          >
            FSSAI licensed · Free shipping over ₹499
          </p>
        </div>
      </div>
    </section>
  );
}