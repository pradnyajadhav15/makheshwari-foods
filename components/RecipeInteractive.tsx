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
    <div className="bg-white rounded-[1.5rem] border border-ink/10 p-8">
      <div className="flex items-baseline justify-between mb-7">
        <h2 className="font-display text-2xl text-ink">Ingredients</h2>
        <span className="text-ink/40 text-xs">{left} to go</span>
      </div>

      {groups.map((g) => (
        <div key={g.group} className="mb-7 last:mb-0">
          <p className="text-gold text-[10px] tracking-tracksm uppercase mb-3.5">{g.group}</p>
          <ul className="space-y-1">
            {g.items.map((it) => {
              const on = done.has(it);
              return (
                <li key={it}>
                  <button type="button" onClick={() => toggle(it)} className="w-full flex items-start gap-3 py-2 text-left group">
                    <span className={`mt-0.5 w-4 h-4 rounded shrink-0 border flex items-center justify-center transition ${on ? "bg-gold border-gold" : "border-ink/25 group-hover:border-gold"}`}>
                      {on && <svg viewBox="0 0 24 24" className="w-3 h-3 text-ink" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                    </span>
                    <span className={`text-sm font-light leading-relaxed transition ${on ? "text-ink/30 line-through" : "text-ink/70"}`}>{it}</span>
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
    <div className="space-y-3">
      {steps.map((s, i) => {
        const on = done.has(i);
        return (
          <button key={s.t} type="button" onClick={() => toggle(i)} className={`w-full text-left rounded-[1.25rem] border p-7 transition-all duration-300 ${on ? "bg-mint/10 border-mint/40" : "bg-white border-ink/10 hover:border-gold/60"}`}>
            <div className="flex gap-6">
              <span className={`shrink-0 w-11 h-11 rounded-full flex items-center justify-center font-display text-lg transition ${on ? "bg-mint/30 text-ink" : "bg-gold/15 text-gold"}`}>
                {on ? <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg> : String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className={`font-display text-xl mb-2 transition ${on ? "text-ink/45" : "text-ink"}`}>{s.t}</h3>
                <p className={`text-sm font-light leading-relaxed transition ${on ? "text-ink/35" : "text-ink/60"}`}>{s.b}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}