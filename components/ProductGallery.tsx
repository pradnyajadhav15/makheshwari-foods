"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const multi = images.length > 1;
  const go = (d: number) => setI((v) => (v + d + images.length) % images.length);

  return (
    /* Thumbs sit under the image on mobile and beside it from lg up —
       the old vertical-only rail squeezed the main image on phones. */
    <div className="flex flex-col-reverse lg:flex-row gap-3 lg:gap-4">
      {multi && (
        <div className="flex lg:flex-col gap-2.5 lg:gap-3 overflow-x-auto no-bar lg:overflow-visible shrink-0">
          {images.slice(0, 7).map((src, n) => (
            <button
              key={src}
              type="button"
              onClick={() => setI(n)}
              aria-label={`View image ${n + 1}`}
              aria-current={n === i}
              className={`relative w-16 h-16 shrink-0 overflow-hidden border transition ${
                n === i ? "border-gold" : "border-ink/12 hover:border-ink/35"
              }`}
            >
              <Image src={src} alt="" fill sizes="64px" className="object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square bg-white border border-ink/12 overflow-hidden group">
        <Image
          src={images[i]}
          alt={name}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 45vw"
          className="object-contain p-6 sm:p-10"
        />

        {multi && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-paper/90 border border-ink/15 flex items-center justify-center text-ink transition hover:bg-gold lg:opacity-0 lg:group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-paper/90 border border-ink/15 flex items-center justify-center text-ink transition hover:bg-gold lg:opacity-0 lg:group-hover:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 lg:hidden">
              {images.slice(0, 7).map((src, n) => (
                <span
                  key={src}
                  className={`h-1.5 rounded-full transition-all ${
                    n === i ? "w-5 bg-ink/70" : "w-1.5 bg-ink/25"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
