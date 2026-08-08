"use client";

import { useRef, useEffect, type ReactNode } from "react";

export default function Tilt({ children, max = 7, className = "" }: { children: ReactNode; max?: number; className?: string }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const o = outer.current, i = inner.current;
    if (!o || !i) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const move = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const r = o.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        i.style.transition = "transform 0.1s linear";
        i.style.transform = `rotateY(${(px * max).toFixed(2)}deg) rotateX(${(-py * max).toFixed(2)}deg) translate3d(0,-6px,0)`;
        raf = 0;
      });
    };
    const leave = () => {
      i.style.transition = "transform 0.55s cubic-bezier(0.2,0.7,0.2,1)";
      i.style.transform = "rotateY(0) rotateX(0) translate3d(0,0,0)";
    };

    o.addEventListener("pointermove", move);
    o.addEventListener("pointerleave", leave);
    return () => {
      o.removeEventListener("pointermove", move);
      o.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(raf);
    };
  }, [max]);

  return (
    <div ref={outer} className={`tilt ${className}`}>
      <div ref={inner} className="tilt-inner h-full">{children}</div>
    </div>
  );
}