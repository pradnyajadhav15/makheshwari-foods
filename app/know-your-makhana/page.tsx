import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Know your makhana",
  description:
    "How makhana travels from the pond beds of Mithila to a sealed pouch. Nine steps, most of them still done by hand.",
};

const steps = [
  { n: "01", t: "Harvesting", b: "Makhana grows on a water lily rooted in the pond bed. There is no machine for this part. Divers work the shallow ponds of Mithila by feel, bringing seed pods up from the silt, load after load, right through the season." },
  { n: "02", t: "Separation", b: "What comes up is not yet food. Each seed carries a tough outer covering that has to be stripped away before anything else can happen. Do this badly and every step after it suffers." },
  { n: "03", t: "Extraction", b: "The edible kernel is worked free from the shell. It is slow, repetitive work, and it decides how much of the harvest survives to become a saleable product." },
  { n: "04", t: "Cleaning and washing", b: "Pond silt clings to everything. Kernels are cleaned of grit and debris, then washed until the water runs clear. Nothing downstream can fix a batch that skipped this." },
  { n: "05", t: "Sun drying", b: "Washed kernels are spread out to dry under open sun. This is not just about removing water. It brings the moisture to the exact point where the seed will burst cleanly instead of scorching or staying shut." },
  { n: "06", t: "Grading", b: "Dried seeds are sorted by size. Size dictates how a seed responds to heat, so a mixed batch pops unevenly. This is why grade matters and why the larger grades cost more." },
  { n: "07", t: "Pre-heating and tempering", b: "Seeds are warmed, then rested. The pause matters as much as the heat: it loosens the kernel inside its shell so that when full heat arrives, the seed is ready to give way." },
  { n: "08", t: "Roasting and popping", b: "Full heat, and the shell fails. The kernel bursts out white and light, and in Mithila that pop is called lawa. The window is seconds wide. Early and it stays hard, late and it burns." },
  { n: "09", t: "Sorting and packing", b: "Lawa is checked for colour, size and uniformity, then roasted with seasoning and sealed the same day. Every pouch carries a date, because freshness is the one thing you cannot add back later." },
];

export default function KnowYourMakhana() {
  return (
    <>
      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">The process</p>
            <h1 className="display-xl text-cream">
              Know your
              <br />
              makhana
            </h1>
            <p className="lede text-cream/65 mt-7 max-w-xl">
              Most people meet makhana in a bowl. Nine steps happen before that, and most of them
              are still done by hand.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="space-y-16 md:space-y-24">
          {steps.map((s, i) => (
            <Reveal key={s.n}>
              {/* Alternating sides via grid order — the old build used
                  `direction: rtl` overrides, which flipped punctuation too. */}
              <article className="grid md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">
                <div
                  className={`relative aspect-[4/3] overflow-hidden bg-sandsoft ${
                    i % 2 === 1 ? "md:order-2" : ""
                  }`}
                >
                  <Image
                    src={`/brand/process/${s.n}.jpg`}
                    alt={s.t}
                    fill
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover"
                  />
                </div>

                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <p className="font-display text-golddeep text-3xl md:text-4xl tabular-nums">{s.n}</p>
                  <h2 className="display-md text-ink mt-3">{s.t}</h2>
                  <p className="text-ink/75 lede mt-5 max-w-lg">{s.b}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-ink text-cream">
        <div className="wrap section-sm grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <h2 className="display-md text-cream">
            Nine steps, and only the last one has our name on it.
          </h2>
          <div>
            <p className="text-cream/60 body-text mb-8">
              Everything before that belongs to the pond, the season and the people who have been
              doing this in Mithila for generations.
            </p>
            <Link href="/shop" className="btn btn-gold">
              Shop the range
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
