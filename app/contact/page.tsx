import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { EMAIL, ADDRESS, FSSAI, GSTIN, LEGAL_ENTITY } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact us",
  description: "Get in touch with Makheshwari Foods, Samastipur, Bihar. Call, email or message us on WhatsApp.",
};

const PHONE = "+91 7485 001 464";
const PHONE_RAW = "917485001464";
const MAPS = "https://www.google.com/maps/search/Samastipur%2C%20Bihar%20848101%2C%20India/@25.856,85.7868,17z?hl=en";

const cards = [
  { i: "M3 8l9 6 9-6M3 6h18v12H3z", t: "Email us", lines: [EMAIL], href: `mailto:${EMAIL}` },
  { i: "M4 4h4l2 5-2.5 1.5a12 12 0 006 6L15 14l5 2v4a16 16 0 01-16-16z", t: "Call us", lines: [PHONE], href: `tel:+${PHONE_RAW}` },
  { i: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 10a1 1 0 100-2 1 1 0 000 2z", t: "Visit us", lines: ["Samastipur, Bihar", "PIN 848101, India"], href: MAPS },
  { i: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2", t: "Working hours", lines: ["Monday to Sunday", "8:00 AM to 9:00 PM"], href: null },
];

export default function Contact() {
  return (
    <>
      <section className="bg-cream px-6 md:px-14 pt-20 pb-14 text-center">
        <p className="text-gold text-[11px] tracking-track uppercase mb-5">Contact</p>
        <h1 className="font-display text-4xl md:text-6xl text-ink mb-6">Get in touch</h1>
        <p className="text-ink/60 font-light max-w-xl mx-auto leading-relaxed">
          Questions about an order, a bulk enquiry, or just want to say hello. Send us a message and
          we will get back to you.
        </p>
      </section>

      <section className="bg-cream px-6 md:px-14 pb-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="space-y-5">
            {cards.map((c) => {
              const inner = (
                <div className="bg-white rounded-[1.25rem] border border-ink/10 p-7 flex items-start gap-5 h-full transition-all duration-400 hover:border-gold/60 hover:-translate-y-1">
                  <span className="shrink-0 w-12 h-12 rounded-full bg-ink flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#C9A227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={c.i} /></svg>
                  </span>
                  <span className="block">
                    <span className="block text-gold text-[10px] tracking-tracksm uppercase mb-2.5">{c.t}</span>
                    {c.lines.map((l) => (
                      <span key={l} className="block text-ink font-light text-[15px] leading-relaxed">{l}</span>
                    ))}
                  </span>
                </div>
              );
              return c.href ? (
                <a key={c.t} href={c.href} target={c.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="block">{inner}</a>
              ) : (
                <div key={c.t}>{inner}</div>
              );
            })}

            <a href={`https://wa.me/${PHONE_RAW}`} target="_blank" rel="noopener noreferrer" className="block bg-mint/20 border border-mint/40 rounded-[1.25rem] p-7 text-center transition hover:bg-mint/30">
              <span className="block text-ink font-display text-lg mb-1">Message us on WhatsApp</span>
              <span className="block text-ink/55 text-sm font-light">Usually the fastest way to reach us</span>
            </a>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 pb-24">
        <div className="max-w-6xl mx-auto rounded-[1.5rem] overflow-hidden border border-ink/10">
          <iframe title="Makheshwari Foods location" src="https://maps.google.com/maps?q=Samastipur%2C%20Bihar%20848101&z=13&output=embed" className="w-full h-[22rem] border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
        </div>
        <p className="text-center text-ink/45 text-[11px] mt-6">
          {LEGAL_ENTITY}, {ADDRESS} &middot; FSSAI {FSSAI} &middot; GSTIN {GSTIN}
        </p>
      </section>
    </>
  );
}