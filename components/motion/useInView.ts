"use client";

import { useEffect, useRef, useState } from "react";

type UseInViewOptions = {
  /** 0-1. How much of the element must be visible before it fires. */
  threshold?: number;
  /** Shrink the viewport so the reveal fires slightly before the edge. */
  rootMargin?: string;
  /** Fire once and stop observing. Set false to re-animate on scroll back. */
  once?: boolean;
};

/**
 * Single-element IntersectionObserver.
 * Returns inView=true immediately when the observer is unavailable (SSR
 * hydration edge cases, very old browsers) or when the user has asked for
 * reduced motion - content must never be trapped at opacity 0.
 */
export function useInView<T extends HTMLElement = HTMLElement>({
  threshold = 0.2,
  rootMargin = "0px 0px -10% 0px",
  once = true,
}: UseInViewOptions = {}) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, inView };
}