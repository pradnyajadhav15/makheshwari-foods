"use client";

import { useEffect, useState } from "react";

const packs = [
  { src: "/products/peri-peri.jpg", name: "Peri Peri" },
  { src: "/products/pink-salt.jpg", name: "Himalayan Pink Salt" },
  { src: "/products/garden-mint.jpg", name: "Garden Mint" },
];

export default function PackCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setActive((i) => (i + 1) % packs.length), 3200);
    return () => clearInterval(t);
  }, [paused]);

  return (
    <div
      className="relative min-h-[24rem] md:min-h-[28rem] flex items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {packs.map((p, i) => {
        const offset = (i - active + packs.length) % packs.length;
        const pos = offset === 0 ? 0 : offset === 1 ? 1 : -1;
        return (
          <div
            key={p.src}
            className="absolute transition-all duration-700 ease-out"
            style={{
              transform: `translateX(${pos * 130}px) scale(${pos === 0 ? 1 : 0.78}) rotate(${pos * 8}deg)`,
              zIndex: pos === 0 ? 20 : 10,
              opacity: pos === 0 ? 1 : 0.55,
              filter: pos === 0 ? "none" : "blur(1px)",
            }}
          >
            <img
              src={p.src}
              alt={p.name}
              className="h-64 md:h-80 w-auto drop-shadow-[0_25px_45px_rgba(18,53,42,0.35)]"
            />
          </div>
        );
      })}

      <div className="absolute bottom-0 flex items-center gap-2.5 z-30">
        {packs.map((p, i) => (
          <button
            key={p.src}
            onClick={() => setActive(i)}
            aria-label={`Show ${p.name}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === active ? "w-8 bg-ink" : "w-1.5 bg-ink/30 hover:bg-ink/60"
            }`}
          />
        ))}
      </div>
    </div>
  );
}