"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import LottiePlayer from "@/components/LottiePlayer";

/* The still behind the video. This is a real photograph of the Mithila
   makhana ponds, which is why it is kept in preference to a frame pulled
   from hero.mp4 — it is the image most visitors actually see, since the
   video is desktop-only, and it evidences the "pond-grown in Samastipur"
   line sitting on top of it.

   It also removes the need for a poster attribute on the video: .hero-media
   is opacity 0 until canplay, so this shows through the whole time the
   video is loading. A poster would just be a second fetch of the same
   picture. */
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

/* The video is 2.2MB (WebM) / 2.9MB (MP4) after re-encoding, down from a
   38MB source. Still not something to push over mobile data for a purely
   decorative background, so small screens and data-saver keep the still. */
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
            {/* WebM first: browsers take the first source they can play, and
                VP9 is 25% smaller than the H.264 at matched quality. Safari
                below 15 has no WebM, hence the MP4. */}
            <source src="/video/hero.webm" type="video/webm" />
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
