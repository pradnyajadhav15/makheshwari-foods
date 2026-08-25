"use client";

import type { CSSProperties, ElementType, ReactNode } from "react";
import { useInView } from "./useInView";

type ClipHeadingProps = {
  /** One entry per visual line. You control the line breaks, not the browser. */
  lines: ReactNode[];
  /** h1, h2, p - whatever the section needs. Defaults to h2. */
  as?: ElementType;
  className?: string;
  /** Classes on each line wrapper (rarely needed). */
  lineClassName?: string;
  delay?: number;
  /** Delay between lines in ms. */
  stagger?: number;
  threshold?: number;
  once?: boolean;
};

/**
 * Masked line reveal: each line sits inside an overflow-hidden block and slides
 * up from below its own baseline. The small padding/negative-margin pair in the
 * CSS stops descenders (g, y, p) getting clipped.
 *
 * Do not use this on the hero h1 if it is the LCP element - render that one
 * statically and let the hero image carry the entrance instead.
 */
export default function ClipHeading({
  lines,
  as: Tag = "h2",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 90,
  threshold = 0.3,
  once = true,
}: ClipHeadingProps) {
  const { ref, inView } = useInView<HTMLElement>({ threshold, once });

  return (
    <Tag
      ref={ref}
      data-inview={inView ? "true" : "false"}
      className={["mk-lines", className].filter(Boolean).join(" ")}
    >
      {lines.map((line, i) => (
        <span
          key={i}
          className={["mk-line", lineClassName].filter(Boolean).join(" ")}
        >
          <span style={{ "--mk-delay": `${delay + i * stagger}ms` } as CSSProperties}>
            {line}
          </span>
        </span>
      ))}
    </Tag>
  );
}