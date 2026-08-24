import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import BulkForm from "@/components/BulkForm";
import { FSSAI, GSTIN, LEGAL_ENTITY } from "@/lib/products";
import { getBlock } from "@/lib/content";

export const metadata: Metadata = {
  title: "Bulk orders",
  description:
    "Wholesale roasted makhana from Samastipur, Bihar. Supply for retailers, distributors, corporate gifting and export. FSSAI licensed.",
};

export const revalidate = 60;

const who = [
  { t: "Retailers", b: "Kirana, supermarkets and speciality food stores." },
  { t: "Distributors", b: "Regional and state-level, with repeat volumes." },
  { t: "Corporate gifting", b: "Festival hampers and employee gift sets." },
  { t: "Exporters", b: "Documentation and packaging for overseas buyers." },
];

const why = [
  { t: "Direct from source", b: "No middle layer. We roast it, we ship it." },
  { t: "FSSAI licensed", b: `Lic. ${FSSAI}. GST invoicing on every order.` },
  { t: "Consistent grade", b: "Sorted by size and colour before packing." },
  { t: "Flexible packing", b: "Standard pouches or your own specification." },
];

export default async function BulkOrders() {
  const c = await getBlock("bulkGrades");

  const grades = [
    { size: c.g1Size, grade: c.g1Grade, rate: c.g1Rate, note: c.g1Note },
    { size: c.g2Size, grade: c.g2Grade, rate: c.g2Rate, note: c.g2Note },
    { size: c.g3Size, grade: c.g3Grade, rate: c.g3Rate, note: c.g3Note },
  ].filter((g) => g.size || g.grade || g.rate);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink text-cream">
        <Image src="/bulk/hero.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/40" />
        <div className="wrap relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">Bulk and wholesale</p>
            <h1 className="display-xl text-cream">Buying by the carton</h1>
            <p className="lede text-cream/65 mt-7 max-w-xl">
              We supply direct from our unit in Samastipur, Bihar. Tell us what you need and we will
              send pricing the same day.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section-sm">
        <Reveal className="max-w-2xl mb-10">
          <p className="marker mb-5">Who we supply</p>
          <h2 className="display-md text-ink">Four kinds of buyer, one roastery.</h2>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 lg:gap-x-10">
          {who.map((w, i) => (
            <Reveal key={w.t} delay={i * 80}>
              <div className="border-t border-ink/15 pt-6 pb-7 h-full">
                <span className="font-display text-golddeep text-sm tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-sm text-ink mt-2.5">{w.t}</h3>
                <p className="text-ink/70 body-text mt-2.5">{w.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {grades.length > 0 && (
        <section className="bg-ink text-cream">
          <div className="wrap section-sm">
            <Reveal className="max-w-2xl mb-10 md:mb-14">
              <p className="marker marker-light mb-5">{c.eyebrow}</p>
              <h2 className="display-md text-cream">{c.heading}</h2>
              {c.body && <p className="text-cream/65 body-text mt-5">{c.body}</p>}
            </Reveal>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {grades.map((g, i) => (
                <Reveal key={g.grade || i} delay={i * 90} className="h-full">
                  <div
                    className={`h-full flex flex-col p-7 md:p-8 border ${
                      i === grades.length - 1
                        ? "border-gold/60 bg-gold/[0.07]"
                        : "border-cream/15 bg-cream/[0.03]"
                    }`}
                  >
                    <p className="marker marker-light">{g.grade}</p>
                    <p className="font-display text-3xl md:text-4xl text-cream mt-4 tabular-nums">
                      {g.size}
                    </p>
                    <p className="text-cream/60 body-text mt-2.5 flex-1">{g.note}</p>
                    {c.moq && (
                      <p className="mt-6 text-cream/45 text-[0.62rem] tracking-tracksm uppercase">
                        {c.moq}
                      </p>
                    )}
                    <p className="mt-5 pt-5 border-t border-cream/15">
                      <span className="font-display text-3xl text-cream tabular-nums">
                        {"\u20B9"}{g.rate}
                      </span>
                      <span className="text-cream/60 text-sm ml-1.5">/ kg</span>
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {c.disclaimer && (
              <p className="text-cream/50 text-[11px] leading-relaxed mt-8 max-w-2xl">
                {c.disclaimer}
              </p>
            )}
          </div>
        </section>
      )}

      <section className="bg-sandsoft/60 border-y border-ink/10">
        <div className="wrap section grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <Reveal>
            <p className="marker mb-5">Why buy direct</p>
            <h2 className="display-md text-ink">Straight from the roastery.</h2>

            <dl className="mt-9 border-t border-ink/15">
              {why.map((w) => (
                <div key={w.t} className="border-b border-ink/15 py-5">
                  <dt className="font-display text-xl text-ink">{w.t}</dt>
                  <dd className="text-ink/70 body-text mt-1.5">{w.b}</dd>
                </div>
              ))}
            </dl>

            <div className="border border-ink/12 bg-paper p-7 mt-9">
              <p className="marker mb-4">Prefer to talk</p>
              
              <a
                href="tel:+917485001464"
                className="block font-display text-2xl md:text-3xl text-ink hover:text-golddeep transition"
              >
                +91 74850 01464
              </a>
              
              <a
                href="https://wa.me/917485001464"
                target="_blank"
                rel="noopener noreferrer"
                className="link-quiet text-golddeep mt-4"
              >
                Message on WhatsApp {"\u2192"}
              </a>
            </div>
          </Reveal>

          <Reveal delay={140}>
            <BulkForm />
          </Reveal>
        </div>
      </section>

      <section className="wrap py-12">
        <p className="text-center text-ink/70 text-[11px] leading-relaxed">
          {LEGAL_ENTITY}, Samastipur, Bihar 848101 {"\u00B7"} FSSAI Lic. {FSSAI} {"\u00B7"} GSTIN {GSTIN}
        </p>
      </section>
    </>
  );
}
