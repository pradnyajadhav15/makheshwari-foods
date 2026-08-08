"use client";

import { useState } from "react";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [i, setI] = useState(0);
  const go = (d: number) => setI((v) => (v + d + images.length) % images.length);

  return (
    <div className="flex gap-4">
      {images.length > 1 && (
        <div className="flex flex-col gap-3 shrink-0">
          {images.slice(0, 7).map((src, n) => (
            <button key={src} type="button" onClick={() => setI(n)} aria-label={`View image ${n + 1}`} className={`w-16 h-16 rounded-lg overflow-hidden border transition ${n === i ? "border-gold" : "border-ink/10 hover:border-ink/30"}`}>
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div className="relative flex-1 aspect-square bg-cream rounded-[1.5rem] border border-ink/10 overflow-hidden flex items-center justify-center group">
        <img src={images[i]} alt={name} className="max-h-full w-auto object-contain p-6" />

        {images.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous image" className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 border border-ink/15 flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition hover:bg-gold">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next image" className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-cream/90 border border-ink/15 flex items-center justify-center text-ink opacity-0 group-hover:opacity-100 transition hover:bg-gold">
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
            </button>
          </>
        )}
      </div>
    </div>
  );
}