import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BulkForm from "@/components/BulkForm";
import { FSSAI, GSTIN, LEGAL_ENTITY } from "@/lib/products";

export const metadata: Metadata = {
  title: "Bulk orders",
  description: "Wholesale roasted makhana from Samastipur, Bihar. Supply for retailers, distributors, corporate gifting and export. FSSAI licensed.",
};

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

export default function BulkOrders() {
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-20 text-center">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">Bulk and wholesale</p>
          <h1 className="font-display text-cream text-4xl md:text-6xl mb-6 leading-tight">Buying by the carton</h1>
          <p className="text-cream/65 font-light max-w-xl mx-auto leading-relaxed">
            We supply direct from our unit in Samastipur, Bihar. Tell us what you need and we will
            send pricing the same day.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-20">
        <Reveal className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl text-ink text-center mb-14">Who we supply</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-7">
            {who.map((w, i) => (
              <Reveal key={w.t} delay={i * 100}>
                <div className="border-t border-gold pt-6 h-full">
                  <h3 className="font-display text-xl text-ink mb-3">{w.t}</h3>
                  <p className="text-ink/55 text-sm font-light leading-relaxed">{w.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-sand/30 px-6 md:px-14 py-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <Reveal>
            <p className="text-gold text-[11px] tracking-track uppercase mb-5">Why buy direct</p>
            <h2 className="font-display text-3xl md:text-4xl text-ink mb-10 leading-tight">
              Straight from the roastery.
            </h2>
            <div className="space-y-8">
              {why.map((w) => (
                <div key={w.t} className="border-l-2 border-gold pl-6">
                  <h3 className="font-display text-xl text-ink mb-2">{w.t}</h3>
                  <p className="text-ink/55 text-sm font-light leading-relaxed">{w.b}</p>
                </div>
              ))}
            </div>
            <div className="mt-12 bg-white rounded-[1.25rem] border border-ink/10 p-7">
              <p className="text-ink/50 text-[10px] tracking-tracksm uppercase mb-3">Prefer to talk</p>
              <a href="tel:+917485001464" className="block font-display text-2xl text-ink hover:text-gold transition">+91 7485 001 464</a>
              <a href="https://wa.me/917485001464" target="_blank" rel="noopener noreferrer" className="inline-block mt-4 text-mint text-sm hover:text-ink transition">Message on WhatsApp &rarr;</a>
            </div>
          </Reveal>

          <Reveal delay={160}>
            <BulkForm />
          </Reveal>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 py-16">
        <p className="text-center text-ink/45 text-[11px] leading-relaxed">
          {LEGAL_ENTITY}, Samastipur, Bihar 848101 &middot; FSSAI Lic. {FSSAI} &middot; GSTIN {GSTIN}
        </p>
      </section>
    </>
  );
}