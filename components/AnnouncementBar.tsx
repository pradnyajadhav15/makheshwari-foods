"use client";

import { useEffect, useState } from "react";

const lines = [
  "Free shipping over \u20B9499 \u00B7 Dispatched in 2 days",
  "Roasted, never fried \u00B7 Sealed the same day",
  "Mithila makhana \u00B7 Roasted in Samastipur, Bihar",
];

export default function AnnouncementBar() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % lines.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="bg-inkdeep h-11 flex items-center justify-center overflow-hidden">
      {lines.map((l, n) => (
        <span
          key={l}
          className="text-goldsoft text-[11px] tracking-tracksm uppercase transition-all duration-700 absolute"
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