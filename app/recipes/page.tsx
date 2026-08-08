import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description: "Makhana kheer, makhana chaat and makhana curry. How Mithila kitchens have cooked makhana for generations.",
};

const accentBar = { peri: "bg-peri", mint: "bg-mint", salt: "bg-salt" };

export default function Recipes() {
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-20 text-center">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">From the kitchen</p>
          <h1 className="font-display text-cream text-4xl md:text-6xl mb-6">More than a snack</h1>
          <p className="text-cream/65 font-light max-w-xl mx-auto leading-relaxed">
            Makhana has been cooked in Mithila kitchens for generations, long before anyone put it in
            a pouch.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {recipes.map((r, i) => (
            <Reveal key={r.slug} delay={i * 120}>
              <Link href={`/recipes/${r.slug}`} className="group block bg-white rounded-[1.5rem] border border-ink/10 overflow-hidden h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_30px_60px_-22px_rgba(18,53,42,0.3)]">
                <div className={`h-1.5 ${accentBar[r.accent]}`} />
                <div className="p-9">
                  <div className="flex gap-4 text-[9px] tracking-tracksm uppercase text-ink/40 mb-6">
                    <span>{r.time}</span><span>&middot;</span><span>Serves {r.serves}</span><span>&middot;</span><span>{r.difficulty}</span>
                  </div>
                  <h2 className="font-display text-2xl text-ink mb-4 group-hover:text-gold transition">{r.name}</h2>
                  <p className="text-ink/55 text-sm font-light leading-relaxed mb-7">{r.blurb}</p>
                  <span className="text-gold text-[10px] tracking-tracksm uppercase inline-flex items-center gap-2">
                    Read recipe
                    <span className="transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}