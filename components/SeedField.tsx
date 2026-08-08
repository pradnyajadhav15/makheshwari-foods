"use client";

import { useEffect, useRef } from "react";

export default function SeedField({ count = 16 }: { count?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = cv.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, raf = 0, last = performance.now(), running = true;

    const size = () => {
      const r = cv.getBoundingClientRect();
      w = r.width; h = r.height;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const seeds = Array.from({ length: count }, () => ({
      x: Math.random(), y: Math.random(),
      r: 1.4 + Math.random() * 2.6,
      vy: 0.06 + Math.random() * 0.14,
      sway: 0.4 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      a: 0.12 + Math.random() * 0.22,
    }));

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);
      for (const s of seeds) {
        s.y -= (s.vy * dt) / h * 12;
        if (s.y < -0.05) { s.y = 1.05; s.x = Math.random(); }
        s.phase += 0.008 * dt;
        const x = (s.x * w) + Math.sin(s.phase) * s.sway * 14;
        ctx.beginPath();
        ctx.arc(x, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201,162,39,${s.a})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(frame);
    };

    const vis = () => {
      running = !document.hidden;
      if (running) { last = performance.now(); raf = requestAnimationFrame(frame); }
      else cancelAnimationFrame(raf);
    };

    size();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", size);
    document.addEventListener("visibilitychange", vis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [count]);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
}