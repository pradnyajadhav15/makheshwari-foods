import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { EMAIL, FREE_SHIPPING_OVER } from "@/lib/products";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Common questions about Makheshwari makhana. Shelf life, storage, shipping, bulk orders and more.",
};

const groups = [
  {
    g: "The product",
    q: [
      { q: "What exactly is makhana?", a: "It is the seed of the prickly water lily, grown underwater in the ponds of Bihar and popped with heat. Despite the name fox nut, it is not a nut." },
      { q: "Is it fried?", a: "No. Ours is roasted with hot air in small batches. We do not deep fry and we do not use palm oil." },
      { q: "Is it gluten free?", a: "Yes, naturally. Makhana contains no wheat and we add none." },
      { q: "Does it contain allergens?", a: "The makhana itself does not, but it is packed in a facility that also handles nuts and milk products. Full details are on every pack." },
      { q: "How long does it keep?", a: "Flavoured makhana keeps 6 to 8 months from packing. Raw makhana keeps around 15 months. Every pouch carries a date." },
      { q: "How should I store it?", a: "Cool, dry place away from sunlight. Reseal the pouch after opening, or move it to an airtight jar. Moisture is what makes it go soft." },
      { q: "Why does the size and colour vary?", a: "It is an agricultural product. Seeds differ between ponds and between seasons. We sort by grade, but no two batches look identical." },
    ],
  },
  {
    g: "Ordering and delivery",
    q: [
      { q: "Where do you ship?", a: "Across India. We do not ship internationally at the moment." },
      { q: "What does shipping cost?", a: `Flat \u20B949, and free above \u20B9${FREE_SHIPPING_OVER}.` },
      { q: "How long will it take?", a: "Dispatched within 2 working days, delivered usually in 3 to 7 working days depending on where you are." },
      { q: "How do I track my order?", a: "Tracking details are sent once your order ships. You can also message us on WhatsApp and we will check." },
      { q: "Can I cancel?", a: "Yes, any time before dispatch. Message us on WhatsApp." },
      { q: "Can I return it?", a: "Sealed food cannot be returned for change of mind. If it arrived damaged, wrong or past date, contact us within 48 hours with photos and we will replace or refund." },
    ],
  },
  {
    g: "Bulk and business",
    q: [
      { q: "Do you supply in bulk?", a: "Yes, to retailers, distributors, corporate gifting and exporters, direct from our unit in Samastipur." },
      { q: "Do you do private label?", a: "Get in touch and tell us what you need." },
      { q: "Can I get a GST invoice?", a: "Yes. Every order is invoiced with our GSTIN." },
    ],
  },
];

export default function FAQ() {
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-16 text-center">
        <h1 className="font-display text-cream text-4xl md:text-5xl mb-5">Questions</h1>
        <p className="text-cream/60 font-light max-w-lg mx-auto">Everything people usually ask before they order.</p>
      </section>

      <section className="bg-cream px-6 md:px-14 py-16">
        <div className="max-w-3xl mx-auto space-y-14">
          {groups.map((grp) => (
            <Reveal key={grp.g}>
              <h2 className="font-display text-2xl text-ink mb-7 pb-4 border-b border-gold">{grp.g}</h2>
              <div className="space-y-7">
                {grp.q.map((item) => (
                  <div key={item.q}>
                    <h3 className="font-display text-lg text-ink mb-2">{item.q}</h3>
                    <p className="text-ink/60 font-light leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sand/30 px-6 py-16 text-center">
        <h2 className="font-display text-2xl text-ink mb-5">Still stuck?</h2>
        <p className="text-ink/60 font-light mb-8">Message us and we will answer properly.</p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="https://wa.me/917485001464" target="_blank" rel="noopener noreferrer" className="bg-ink text-cream rounded-full px-9 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">WhatsApp</a>
          <Link href="/contact" className="border border-ink/25 text-ink rounded-full px-9 py-4 text-[11px] tracking-tracksm uppercase hover:border-gold transition">Contact page</Link>
        </div>
      </section>
    </>
  );
}