import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { FREE_SHIPPING_OVER } from "@/lib/products";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Common questions about Makheshwari makhana. Shelf life, storage, shipping, bulk orders and more.",
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
      { q: "What does shipping cost?", a: `Flat ₹49, and free above ₹${FREE_SHIPPING_OVER}.` },
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

/* Schema so the answers can surface directly in search results. */
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: groups.flatMap((g) =>
    g.q.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    }))
  ),
};

export default function FAQ() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">Help</p>
            <h1 className="display-xl text-cream">Questions</h1>
            <p className="lede text-cream/65 mt-7 max-w-lg">
              Everything people usually ask before they order.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid lg:grid-cols-[0.4fr_1fr] gap-10 lg:gap-16">
          <nav aria-label="Sections" className="lg:sticky lg:top-28 self-start">
            <p className="marker mb-5">Jump to</p>
            <ul className="space-y-2.5">
              {groups.map((grp) => (
                <li key={grp.g}>
                  <a
                    href={`#${grp.g.toLowerCase().replace(/\s+/g, "-")}`}
                    className="text-ink/65 body-text hover:text-gold transition"
                  >
                    {grp.g}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="space-y-14">
            {groups.map((grp) => (
              <Reveal key={grp.g}>
                <section
                  id={grp.g.toLowerCase().replace(/\s+/g, "-")}
                  className="scroll-mt-28"
                >
                  <h2 className="display-sm text-ink pb-4 border-b border-ink/20">{grp.g}</h2>

                  {/* Native <details> — accessible and keyboard-operable
                      with no JavaScript. */}
                  <div>
                    {grp.q.map((item) => (
                      <details key={item.q} className="group border-b border-ink/10">
                        <summary className="flex items-start justify-between gap-5 py-5 cursor-pointer list-none [&::-webkit-details-marker]:hidden">
                          <h3 className="font-display text-lg md:text-xl text-ink leading-snug">
                            {item.q}
                          </h3>
                          <span className="shrink-0 mt-1 w-6 h-6 flex items-center justify-center text-gold transition-transform duration-300 group-open:rotate-45">
                            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                              <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                            </svg>
                          </span>
                        </summary>
                        <p className="text-ink/65 body-text pb-5 pr-10 -mt-1">{item.a}</p>
                      </details>
                    ))}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sandsoft/70 border-t border-ink/10">
        <div className="wrap section-sm grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div>
            <p className="marker mb-5">Still stuck?</p>
            <h2 className="display-md text-ink">Message us and we will answer properly.</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/917485001464"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              WhatsApp
            </a>
            <Link href="/contact" className="btn btn-outline">
              Contact page
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
