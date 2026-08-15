"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  loop?: boolean;
  className?: string;
  fallback?: React.ReactNode;
};

/**
 * Wraps dotLottie with the guards a hero needs:
 *  - waits for the reduced-motion check before rendering anything, so the
 *    animation never flashes in and then swaps out for the fallback
 *  - falls back if the animation fails to load, rather than leaving a hole
 *
 * The dotLottie runtime fetches a WASM binary from a CDN. If the CSP in
 * next.config.ts is ever actually wired up, `script-src`/`connect-src`
 * will need to allow it or this will silently fall back everywhere.
 */
export default function LottiePlayer({ src, loop = true, className, fallback = null }: Props) {
  const [state, setState] = useState<"checking" | "play" | "fallback">("checking");

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setState(mq.matches ? "fallback" : "play");
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Render the fallback while deciding: it is the safe default, and for
  // a hero it means the poster is already painted for LCP.
  if (state !== "play") return <>{fallback}</>;

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay
      className={className}
      aria-hidden="true"
      onError={() => setState("fallback")}
    />
  );
}
