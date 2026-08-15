"use client";

import { useId, useState } from "react";
import { inrShort, num } from "@/lib/admin/format";

export type Point = { label: string; value: number; secondary?: number };

/* Dependency-free SVG charts. The project has no charting library and a
   dashboard is not worth 100KB+ of one; these scale to their container
   and stay legible at mobile widths. */

function niceMax(v: number) {
  if (v <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  return Math.ceil(v / mag) * mag;
}

export function LineChart({
  data,
  height = 240,
  money = true,
}: {
  data: Point[];
  height?: number;
  money?: boolean;
}) {
  const id = useId();
  const [hover, setHover] = useState<number | null>(null);

  if (!data.length) return null;

  const W = 800;
  const H = height;
  const padL = 52;
  const padR = 12;
  const padT = 16;
  const padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;

  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const x = (i: number) => padL + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => padT + innerH - (v / max) * innerH;

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(d.value).toFixed(1)}`).join(" ");
  const area = `${line} L${x(data.length - 1).toFixed(1)},${padT + innerH} L${x(0).toFixed(1)},${padT + innerH} Z`;
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((t) => max * t);

  // Keep labels readable when there are many points (e.g. 30 days).
  const step = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto"
        role="img"
        aria-label={`Trend across ${data.length} points`}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t, i) => (
          <g key={i}>
            <line
              x1={padL} x2={W - padR} y1={y(t)} y2={y(t)}
              stroke="var(--color-adminline)" strokeWidth="1"
            />
            <text
              x={padL - 8} y={y(t) + 4} textAnchor="end"
              className="fill-adminmuted" style={{ fontSize: 11 }}
            >
              {money ? inrShort(t) : num(Math.round(t))}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#g-${id})`} />
        <path d={line} fill="none" stroke="var(--color-gold)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

        {data.map((d, i) => (
          <g key={i}>
            {(hover === i || data.length <= 14) && (
              <circle cx={x(i)} cy={y(d.value)} r={hover === i ? 5 : 3} fill="var(--color-ink)" />
            )}
            <rect
              x={x(i) - innerW / data.length / 2}
              y={padT}
              width={innerW / data.length}
              height={innerH}
              fill="transparent"
              onMouseEnter={() => setHover(i)}
            />
            {i % step === 0 && (
              <text
                x={x(i)} y={H - 8} textAnchor="middle"
                className="fill-adminmuted" style={{ fontSize: 11 }}
              >
                {d.label}
              </text>
            )}
          </g>
        ))}
      </svg>

      {hover !== null && (
        <div
          className="absolute -translate-x-1/2 -translate-y-full pointer-events-none adm-card px-3 py-2 shadow-lg text-xs whitespace-nowrap"
          style={{ left: `${(x(hover) / W) * 100}%`, top: `${(y(data[hover].value) / H) * 100}%` }}
        >
          <p className="text-adminmuted">{data[hover].label}</p>
          <p className="font-medium text-ink tabular-nums">
            {money ? inrShort(data[hover].value) : num(data[hover].value)}
          </p>
        </div>
      )}
    </div>
  );
}

export function BarChart({
  data,
  height = 240,
  money = false,
}: {
  data: Point[];
  height?: number;
  money?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  if (!data.length) return null;

  const W = 800;
  const H = height;
  const padL = 52, padR = 12, padT = 16, padB = 30;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const max = niceMax(Math.max(...data.map((d) => d.value), 1));
  const slot = innerW / data.length;
  const bw = Math.min(38, slot * 0.62);
  const y = (v: number) => padT + innerH - (v / max) * innerH;
  const ticks = [0, 0.5, 1].map((t) => max * t);
  const step = Math.max(1, Math.ceil(data.length / 10));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Bar chart">
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="var(--color-adminline)" />
          <text x={padL - 8} y={y(t) + 4} textAnchor="end" className="fill-adminmuted" style={{ fontSize: 11 }}>
            {money ? inrShort(t) : num(Math.round(t))}
          </text>
        </g>
      ))}
      {data.map((d, i) => {
        const cx = padL + slot * i + slot / 2;
        return (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <rect
              x={cx - bw / 2}
              y={y(d.value)}
              width={bw}
              height={Math.max(2, padT + innerH - y(d.value))}
              rx="4"
              fill={hover === i ? "var(--color-ink)" : "var(--color-gold)"}
              className="transition-[fill]"
            />
            {i % step === 0 && (
              <text x={cx} y={H - 8} textAnchor="middle" className="fill-adminmuted" style={{ fontSize: 11 }}>
                {d.label}
              </text>
            )}
            <title>{`${d.label}: ${money ? inrShort(d.value) : num(d.value)}`}</title>
          </g>
        );
      })}
    </svg>
  );
}

/** Horizontal share bars — used for rating distribution and category mix. */
export function ShareBars({
  rows,
  money = false,
}: {
  rows: { label: string; value: number; hint?: string }[];
  money?: boolean;
}) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 mb-1.5">
            <span className="text-sm text-ink truncate">{r.label}</span>
            <span className="text-xs text-adminmuted tabular-nums shrink-0">
              {r.hint ?? (money ? inrShort(r.value) : num(r.value))}
            </span>
          </div>
          <div className="h-2 rounded-full bg-sandsoft overflow-hidden">
            <div
              className="h-full rounded-full bg-gold transition-[width] duration-500"
              style={{ width: `${Math.max(2, (r.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Tiny inline trend line for stat tiles. */
export function Spark({ values }: { values: number[] }) {
  if (values.length < 2) return null;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const pts = values
    .map((v, i) => `${(i / (values.length - 1)) * 60},${18 - ((v - min) / range) * 16}`)
    .join(" ");
  const rising = values[values.length - 1] >= values[0];
  return (
    <svg viewBox="0 0 60 20" className="w-16 h-5 overflow-visible" aria-hidden="true">
      <polyline
        points={pts}
        fill="none"
        stroke={rising ? "var(--color-mintdeep)" : "var(--color-perideep)"}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
