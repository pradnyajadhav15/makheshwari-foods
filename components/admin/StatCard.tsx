"use client";

import Link from "next/link";
import { Spark } from "@/components/admin/Charts";
import { Sk } from "@/components/admin/ui";

export function StatCard({
  label,
  value,
  change,
  compare,
  spark,
  href,
  tone = "neutral",
  loading = false,
}: {
  label: string;
  value: string;
  change?: number | null;
  compare?: string;
  spark?: number[];
  href?: string;
  tone?: "neutral" | "warn" | "danger";
  loading?: boolean;
}) {
  if (loading) {
    return (
      <div className="adm-card adm-card-pad" aria-busy="true">
        <Sk className="h-3 w-24 mb-4" />
        <Sk className="h-8 w-28 mb-3" />
        <Sk className="h-3 w-32" />
      </div>
    );
  }

  const rising = typeof change === "number" && change > 0;
  const falling = typeof change === "number" && change < 0;

  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="adm-label">{label}</p>
        {spark && spark.length > 1 && <Spark values={spark} />}
      </div>

      <p
        className={`adm-num mt-3 ${
          tone === "danger" ? "text-perideep" : tone === "warn" ? "text-golddeep" : "text-ink"
        }`}
      >
        {value}
      </p>

      <div className="flex items-center gap-2 mt-2.5 min-h-[1.25rem]">
        {typeof change === "number" && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-medium tabular-nums ${
              rising ? "text-mintdeep" : falling ? "text-perideep" : "text-adminmuted"
            }`}
          >
            <svg viewBox="0 0 12 12" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.8">
              {rising ? (
                <path d="M2 8l4-4 4 4" strokeLinecap="round" strokeLinejoin="round" />
              ) : falling ? (
                <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M2 6h8" strokeLinecap="round" />
              )}
            </svg>
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
        {compare && <span className="text-xs text-adminmuted truncate">{compare}</span>}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className="adm-card adm-card-pad block transition hover:border-ink/30">
        {body}
      </Link>
    );
  }
  return <div className="adm-card adm-card-pad">{body}</div>;
}
