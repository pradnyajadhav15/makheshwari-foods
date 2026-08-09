"use client";
import { useEffect, useState } from "react";

const FALLBACK = [
  "Free shipping over \u20B9499 \u00B7 Dispatched in 2 days",
  "Roasted, never fried \u00B7 Sealed the same day",
  "Mithila makhana \u00B7 Roasted in Samastipur, Bihar",
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);
  const [lines, setLines] = useState<string[]>(FALLBACK);
  const [show, setShow] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((s) => {
        if (s?.announcement_active === false) { setShow(false); return; }
        if (s?.announcement) setLines([s.announcement, ...FALLBACK.slice(1)]);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % lines.length), 4000);
    return () => clearInterval(t);
  }, [lines.length]);

  if (!show) return null;

  return (
    <div className="relative bg-inkdeep h-11 flex items-center justify-center overflow-hidden">
      {lines.map((l, n) => (
        <span
          key={l}
          className="absolute text-goldsoft text-[11px] tracking-tracksm uppercase transition-all duration-700 px-4 text-center"
          style={{
            opacity: n === i ? 1 : 0,
            transform: `translateY(${n === i ? 0 : 10}px)`,
            pointerEvents: "none",
          }}
        >
          {l}
        </span>
      ))}
    </div>
  );
}