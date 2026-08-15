"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LottiePlayer from "@/components/LottiePlayer";

/* No real poster frame exists yet — /video/poster.jpg was referenced by an
   older build but never added, so this is the one landscape brand still we
   have. Replace with a frame pulled from hero.mp4 when there is one. */
const POSTER = "/brand/story-hero.jpg";

/* Drop a .lottie or .json into /public/lottie and point this at it to use
   an animated hero instead of the video. Null = use the video. */
const LOTTIE_SRC: string | null = null;

const WIDE = "(min-width: 1024px)";
const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeMedia(cb: () => void) {
  const a = window.matchMedia(WIDE);
  const b = window.matchMedia(REDUCED);
  a.addEventListener("change", cb);
  b.addEventListener("change", cb);
  return () => {
    a.removeEventListener("change", cb);
    b.removeEventListener("change", cb);
  };
}

/* hero.mp4 is ~38MB. Sending that to a phone on mobile data is not a
   reasonable default, so small screens and data-saver get the still. */
function shouldPlayVideo() {
  if (LOTTIE_SRC) return false;
  if (window.matchMedia(REDUCED).matches) return false;
  if (!window.matchMedia(WIDE).matches) return false;
  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  return !conn?.saveData && !/2g/.test(conn?.effectiveType ?? "");
}

export default function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);

  const useVideo = useSyncExternalStore(subscribeMedia, shouldPlayVideo, () => false);

  useEffect(() => {
    if (!useVideo) return;
    ref.current?.play().catch(() => {});
  }, [useVideo]);

  return (
    <section className="hero flex items-end lg:items-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${POSTER})` }}
        aria-hidden="true"
      />

      {LOTTIE_SRC ? (
        <LottiePlayer src={LOTTIE_SRC} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        useVideo && (
          <video
            ref={ref}
            className={`hero-media ${ready ? "is-ready" : ""}`}
            poster={POSTER}
            muted
            loop
            autoPlay
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
            onLoadedData={() => setReady(true)}
            onCanPlay={() => setReady(true)}
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
        )
      )}

      <div className="hero-scrim" />

      <div className="wrap relative z-10 w-full pt-24 pb-12 sm:pt-28 sm:pb-16 lg:py-0">
        <div className="max-w-2xl">
          <p className="marker marker-light mb-6 animate-fade-up">
            Pond-grown in Samastipur, Bihar
          </p>

          <h1
            className="display-xl text-cream animate-fade-up"
            style={{ animationDelay: "90ms" }}
          >
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
            className="mt-9 flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "270ms" }}
          >
            <Link href="/shop" className="btn btn-light">
              Shop the range
            </Link>
            <Link href="/know-your-makhana" className="btn btn-ghost-light">
              Know your makhana
            </Link>
          </div>

          <p
            className="text-cream/70 text-[0.7rem] tracking-tracksm uppercase mt-8 animate-fade-up"
            style={{ animationDelay: "360ms" }}
          >
            FSSAI licensed · Free shipping over ₹499
          </p>
        </div>
      </div>
    </section>
  );
}
