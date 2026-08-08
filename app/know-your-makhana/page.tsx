import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Know your makhana",
  description: "How makhana travels from the pond beds of Mithila to a sealed pouch. Nine steps, most of them still done by hand.",
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
      <section className="bg-ink px-6 md:px-14 pt-20 pb-14 text-center">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">The process</p>
          <h1 className="font-display text-cream text-4xl md:text-6xl mb-7 leading-tight">Know your makhana</h1>
          <p className="text-cream/65 font-light max-w-2xl mx-auto leading-relaxed">
            Most people meet makhana in a bowl. Nine steps happen before that, and most of them are
            still done by hand.
          </p>
        </Reveal>
      </section>
      

      <section className="bg-cream px-6 md:px-14 py-16">
        <div className="max-w-5xl mx-auto space-y-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={60}>
              <div className={`grid md:grid-cols-2 gap-8 md:gap-12 items-center ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                <div className="md:[direction:ltr] rounded-[1.5rem] overflow-hidden bg-sand/40 aspect-[4/3]">
                  <img src={`/brand/process/${s.n}.jpg`} alt={s.t} className="w-full h-full object-cover" />
                </div>
                <div className="md:[direction:ltr] py-4">
                  <p className="font-display text-gold text-4xl mb-4">{s.n}</p>
                  <h2 className="font-display text-3xl md:text-4xl text-ink mb-5 leading-tight">{s.t}</h2>
                  <p className="text-ink/60 font-light leading-relaxed">{s.b}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      
      <section className="bg-ink px-6 md:px-14 py-20 text-center">
        <Reveal>
          <h2 className="font-display text-cream text-3xl md:text-4xl mb-6 leading-tight">
            Nine steps, and only the last one has our name on it.
          </h2>
          <p className="text-cream/60 font-light max-w-xl mx-auto leading-relaxed mb-10">
            Everything before that belongs to the pond, the season and the people who have been
            doing this in Mithila for generations.
          </p>
          <Link href="/shop" className="inline-block bg-gold text-ink rounded-full px-12 py-4 text-[11px] tracking-tracksm uppercase hover:bg-goldsoft transition">
            Shop the range
          </Link>
        </Reveal>
      </section>
    </>
  );
}