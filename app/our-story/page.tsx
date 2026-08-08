import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our story",
  description: "Makheshwari Foods roasts makhana in Samastipur, Bihar, where it grows. Our story, how we work, and what we refuse to do.",
};

const how = [
  { t: "We buy close", b: "Our makhana comes from the Mithila belt, from growers we can drive to." },
  { t: "We roast small", b: "Batches sized so nothing sits waiting. Hot air, never a deep fryer." },
  { t: "We seal same-day", b: "Every pouch is dated. Flavoured keeps six to eight months, raw keeps fifteen." },
];

const wont = [
  { t: "No deep frying, ever", b: "Roasting takes longer and costs more. It is the only way to get a makhana that stays light instead of heavy." },
  { t: "No mystery sourcing", b: "If we cannot tell you which district it came from, we do not sell it." },
  { t: "No claims we cannot back", b: "You will not find the word superfood on our packs. It is a seed from a pond in Bihar. That is enough." },
];

export default function OurStory() {
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-24 text-center">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-6">Our story</p>
          <h1 className="font-display text-cream text-5xl md:text-7xl leading-[1.05] mb-8">Rooted in Bihar.</h1>
          <p className="text-cream/70 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed">
            We roast makhana in Samastipur, where it grows. That is the whole idea.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-24">
        <Reveal className="max-w-3xl mx-auto">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">The beginning</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-10 leading-tight">It started with a crop nobody was branding.</h2>
          <p className="text-ink/70 text-lg font-light leading-relaxed mb-6">
            Makhana has been part of Mithila for centuries. Eaten at Kojagara, given at weddings,
            cooked into kheer in every kitchen. What it never had was a brand that treated it
            properly.
          </p>
          <p className="text-ink/70 text-lg font-light leading-relaxed mb-6">
            Most makhana leaves Bihar in sacks and gets packed somewhere else, under someone else&apos;s
            name. We wanted to do the opposite. Keep the whole thing here, from the pond to the
            pouch.
          </p>
          <p className="text-ink/70 text-lg font-light leading-relaxed mb-6">
            Sonu Kumar started Makheshwari in 2025. He had years in trading behind him and one
            observation in front of him: Mithila Makhana had carried a GI tag since 2022, the crop
            was recognised, the region was recognised, and almost nobody was building a brand on it.
          </p>
          <p className="text-ink/70 text-lg font-light leading-relaxed">
            Today four to five of us run it. Small enough that every batch passes through hands that
            know what it should look like.
          </p>
        </Reveal>
      </section>

      <section className="bg-sand/30 px-6 md:px-14 py-24">
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">Where we are</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-10 leading-tight">In the middle of makhana country.</h2>
          <p className="text-ink/70 text-lg font-light leading-relaxed mb-6">
            Samastipur sits inside the Mithila belt. Bihar grows close to ninety percent of India&apos;s
            makhana, and the National Makhana Board was set up here to build the industry around it.
          </p>
          <p className="font-display text-2xl md:text-3xl text-ink mt-12">
            We are not borrowing that story. We are in it.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-24">
        <Reveal className="max-w-5xl mx-auto">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">How we work</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-14 leading-tight">Three things we do differently.</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {how.map((h, i) => (
              <Reveal key={h.t} delay={i * 120}>
                <div className="border-t border-gold pt-7 h-full">
                  <h3 className="font-display text-2xl text-ink mb-4">{h.t}</h3>
                  <p className="text-ink/60 font-light leading-relaxed">{h.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-ink px-6 md:px-14 py-24">
        <Reveal className="max-w-4xl mx-auto">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">What we will not do</p>
          <h2 className="font-display text-cream text-4xl md:text-5xl mb-14 leading-tight">The short list.</h2>
          <div className="space-y-10">
            {wont.map((w, i) => (
              <Reveal key={w.t} delay={i * 120}>
                <div className="border-l-2 border-gold pl-8">
                  <h3 className="font-display text-cream text-2xl mb-3">{w.t}</h3>
                  <p className="text-cream/60 font-light leading-relaxed">{w.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-24">
        <Reveal className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-[11px] tracking-track uppercase mb-5">What we hold to</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink">Five things, every batch</h2>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            {[{ t: "Quality", b: "Graded before it is packed" }, { t: "Hygiene", b: "Clean unit, clean hands" }, { t: "Freshness", b: "Dated, sealed same day" }, { t: "Honest pricing", b: "No inflated MRP games" }, { t: "Trust", b: "The reason people reorder" }].map((v, i) => (
              <Reveal key={v.t} delay={i * 90}>
                <div className="text-center border-t border-gold pt-6 h-full">
                  <h3 className="font-display text-xl text-ink mb-3">{v.t}</h3>
                  <p className="text-ink/55 text-sm font-light leading-relaxed">{v.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="text-center text-ink/45 text-sm font-light mt-14">
            Run by Sonu Kumar and a team of five in Samastipur, Bihar.
          </p>
        </Reveal>
      </section>

      <section className="bg-sand/30 px-6 md:px-14 py-24">
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">What comes next</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-8 leading-tight">
            Makhana is where we started, not where we stop.
          </h2>
          <p className="text-ink/65 text-lg font-light leading-relaxed mb-12">
            The roastery does not only do one thing, and Bihar does not only grow one crop.
          </p>
          <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-12 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
            See what we make
          </Link>
        </Reveal>
      </section>
    </>
  );
}