"use client";

import { useState } from "react";

export function IngredientList({ groups }: { groups: { group: string; items: string[] }[] }) {
  const [done, setDone] = useState<Set<string>>(new Set());

  const toggle = (k: string) => {
    const next = new Set(done);
    next.has(k) ? next.delete(k) : next.add(k);
    setDone(next);
  };

  const all = groups.flatMap((g) => g.items);
  const left = all.length - done.size;

  return (
    <div className="border border-ink/12 bg-paper p-6 sm:p-8">
      <div className="flex items-baseline justify-between mb-6">
        <h2 className="display-sm text-ink">Ingredients</h2>
        <span className="text-ink/45 text-xs tabular-nums">{left} to go</span>
      </div>

      {groups.map((g) => (
        <div key={g.group} className="mb-6 last:mb-0">
          <p className="marker mb-3">{g.group}</p>
          <ul>
            {g.items.map((it) => {
              const on = done.has(it);
              return (
                <li key={it}>
                  <button
                    type="button"
                    onClick={() => toggle(it)}
                    aria-pressed={on}
                    className="w-full flex items-start gap-3 py-2.5 text-left group"
                  >
                    <span
                      className={`mt-0.5 w-[18px] h-[18px] rounded shrink-0 border flex items-center justify-center transition ${
                        on ? "bg-gold border-gold" : "border-ink/25 group-hover:border-gold"
                      }`}
                    >
                      {on && (
                        <svg viewBox="0 0 24 24" className="w-3 h-3 text-ink" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <span className={`body-text transition ${on ? "text-ink/30 line-through" : "text-ink/75"}`}>
                      {it}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function StepList({ steps }: { steps: { t: string; b: string }[] }) {
  const [done, setDone] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    const next = new Set(done);
    next.has(i) ? next.delete(i) : next.add(i);
    setDone(next);
  };

  return (
    <div className="border-t border-ink/15">
      {steps.map((s, i) => {
        const on = done.has(i);
        return (
          <button
            key={s.t}
            type="button"
            onClick={() => toggle(i)}
            aria-pressed={on}
            className={`w-full text-left border-b border-ink/15 py-6 transition-colors ${
              on ? "bg-mint/10" : "hover:bg-sandsoft/40"
            }`}
          >
            <div className="flex gap-5 px-1">
              <span
                className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-sm tabular-nums transition ${
                  on ? "bg-mint/40 text-ink" : "bg-gold/15 text-golddeep"
                }`}
              >
                {on ? (
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  String(i + 1).padStart(2, "0")
                )}
              </span>
              <div className="min-w-0">
                <h3 className={`font-display text-xl transition ${on ? "text-ink/45" : "text-ink"}`}>
                  {s.t}
                </h3>
                <p className={`body-text mt-1.5 transition ${on ? "text-ink/35" : "text-ink/65"}`}>
                  {s.b}
                </p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
