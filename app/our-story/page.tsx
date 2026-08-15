import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "Makheshwari Foods roasts makhana in Samastipur, Bihar, where it grows. Our story, how we work, and what we refuse to do.",
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

const values = [
  { t: "Quality", b: "Graded before it is packed" },
  { t: "Hygiene", b: "Clean unit, clean hands" },
  { t: "Freshness", b: "Dated, sealed same day" },
  { t: "Honest pricing", b: "No inflated MRP games" },
  { t: "Trust", b: "The reason people reorder" },
];

export default function OurStory() {
  return (
    <>
      {/* Hero — left-aligned, matching the home hero rather than the old
          centred treatment */}
      <section className="relative isolate overflow-hidden bg-inkdeep flex items-end min-h-[26rem] md:min-h-[34rem]">
        <Image
          src="/brand/story-hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <span className="hero-scrim" aria-hidden="true" />

        <div className="wrap relative z-10 pt-24 pb-12 md:pb-16">
          <div className="max-w-2xl">
            <p className="marker marker-light mb-6">Our story</p>
            <h1 className="display-xl text-cream">Rooted in Bihar.</h1>
            <p className="lede text-cream/75 mt-6 max-w-lg">
              We roast makhana in Samastipur, where it grows. That is the whole idea.
            </p>
          </div>
        </div>
      </section>

      {/* The beginning — narrow measure for long reading */}
      <section className="wrap section">
        <div className="grid lg:grid-cols-[0.5fr_1fr] gap-8 lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-28">
              <p className="marker mb-5">The beginning</p>
              <h2 className="display-md text-ink">
                It started with a crop nobody was branding.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="max-w-xl space-y-5 text-ink/70">
              <p className="lede">
                Makhana has been part of Mithila for centuries. Eaten at Kojagara, given at weddings,
                cooked into kheer in every kitchen. What it never had was a brand that treated it
                properly.
              </p>
              <p className="body-text">
                Most makhana leaves Bihar in sacks and gets packed somewhere else, under someone
                else&apos;s name. We wanted to do the opposite. Keep the whole thing here, from the pond
                to the pouch.
              </p>
              <p className="body-text">
                Sonu Kumar started Makheshwari in 2025. He had years in trading behind him and one
                observation in front of him: Mithila Makhana had carried a GI tag since 2022, the
                crop was recognised, the region was recognised, and almost nobody was building a
                brand on it.
              </p>
              <p className="body-text">
                Today four to five of us run it. Small enough that every batch passes through hands
                that know what it should look like.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Pull quote */}
      <section className="bg-sandsoft/70 border-y border-ink/10">
        <div className="wrap-mid section text-center">
          <Reveal>
            <p className="marker marker-center mb-6">Where we are</p>
            <h2 className="display-md text-ink">In the middle of makhana country.</h2>
            <p className="lede text-ink/65 mt-7 max-w-xl mx-auto">
              Samastipur sits inside the Mithila belt. Bihar grows close to ninety percent of
              India&apos;s makhana, and the National Makhana Board was set up here to build the industry
              around it.
            </p>
            <p className="font-display text-2xl md:text-4xl text-ink mt-12 leading-tight">
              We are not borrowing that story.
              <br />
              We are in it.
            </p>
          </Reveal>
        </div>
      </section>

      {/* How we work */}
      <section className="wrap section">
        <Reveal className="max-w-2xl mb-12">
          <p className="marker mb-5">How we work</p>
          <h2 className="display-lg text-ink">Three things we do differently.</h2>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-x-8 lg:gap-x-14">
          {how.map((h, i) => (
            <Reveal key={h.t} delay={i * 100}>
              <div className="border-t border-ink/15 pt-7 h-full">
                <span className="font-display text-gold text-sm tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-sm text-ink mt-3">{h.t}</h3>
                <p className="text-ink/60 body-text mt-3">{h.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* What we will not do */}
      <section className="bg-ink text-cream">
        <div className="wrap section">
          <Reveal className="max-w-2xl mb-12">
            <p className="marker marker-light mb-5">What we will not do</p>
            <h2 className="display-lg text-cream">The short list.</h2>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-x-10 gap-y-0">
            {wont.map((w, i) => (
              <Reveal key={w.t} delay={i * 100}>
                <div className="border-t border-cream/20 py-8 h-full">
                  <span className="font-display text-gold text-sm tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="display-sm text-cream mt-3">{w.t}</h3>
                  <p className="text-cream/60 body-text mt-3">{w.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="wrap section">
        <Reveal className="max-w-2xl mb-12">
          <p className="marker mb-5">What we hold to</p>
          <h2 className="display-lg text-ink">Five things, every batch</h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-x-6 lg:gap-x-10 gap-y-0">
          {values.map((v, i) => (
            <Reveal key={v.t} delay={i * 70}>
              <div className="border-t border-ink/15 pt-6 pb-7 h-full">
                <h3 className="display-sm text-ink">{v.t}</h3>
                <p className="text-ink/55 body-text mt-2">{v.b}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <p className="text-ink/45 text-sm font-light mt-10">
          Run by Sonu Kumar and a team of five in Samastipur, Bihar.
        </p>
      </section>

      {/* Next */}
      <section className="bg-sandsoft/70 border-t border-ink/10">
        <div className="wrap section-sm grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div>
            <p className="marker mb-5">What comes next</p>
            <h2 className="display-md text-ink">
              Makhana is where we started, not where we stop.
            </h2>
          </div>
          <div>
            <p className="text-ink/65 body-text mb-7">
              The roastery does not only do one thing, and Bihar does not only grow one crop.
            </p>
            <Link href="/shop" className="btn btn-primary">
              See what we make
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
