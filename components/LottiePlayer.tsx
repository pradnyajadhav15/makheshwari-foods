"use client";

import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { useEffect, useState } from "react";

type Props = {
  src: string;
  loop?: boolean;
  className?: string;
  fallback?: React.ReactNode;
};

export default function LottiePlayer({ src, loop = true, className, fallback = null }: Props) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  if (reduced) return <>{fallback}</>;

  return (
    <DotLottieReact
      src={src}
      loop={loop}
      autoplay
      className={className}
      aria-hidden="true"
    />
  );
}