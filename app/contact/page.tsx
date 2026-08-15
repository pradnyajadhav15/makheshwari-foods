import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";
import { EMAIL, ADDRESS, FSSAI, GSTIN, LEGAL_ENTITY } from "@/lib/products";

export const metadata: Metadata = {
  title: "Contact us",
  description:
    "Get in touch with Makheshwari Foods, Samastipur, Bihar. Call, email or message us on WhatsApp.",
};

const PHONE = "+91 74850 01464";
const PHONE_RAW = "917485001464";
const MAPS =
  "https://www.google.com/maps/search/Samastipur%2C%20Bihar%20848101%2C%20India/@25.856,85.7868,17z?hl=en";

const details = [
  { t: "Email", lines: [EMAIL], href: `mailto:${EMAIL}` },
  { t: "Phone", lines: [PHONE], href: `tel:+${PHONE_RAW}` },
  { t: "Visit", lines: ["Samastipur, Bihar", "PIN 848101, India"], href: MAPS },
  { t: "Hours", lines: ["Monday to Sunday", "8:00 AM to 9:00 PM"], href: null },
];

export default function Contact() {
  return (
    <>
      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-16 md:pt-20 md:pb-20">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">Contact</p>
            <h1 className="display-xl text-cream">Get in touch</h1>
            <p className="lede text-cream/65 mt-7 max-w-xl">
              Questions about an order, a bulk enquiry, or just want to say hello. Send us a message
              and we will get back to you.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid lg:grid-cols-[0.8fr_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <dl className="border-t border-ink/15">
              {details.map((c) => {
                const body = (
                  <>
                    <dt className="text-[0.64rem] tracking-tracksm uppercase text-ink/70 mb-1.5">
                      {c.t}
                    </dt>
                    <dd className="text-ink body-text">
                      {c.lines.map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                    </dd>
                  </>
                );

                return c.href ? (
                  <a
                    key={c.t}
                    href={c.href}
                    target={c.href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    className="block border-b border-ink/15 py-5 hover:text-golddeep transition group"
                  >
                    {body}
                  </a>
                ) : (
                  <div key={c.t} className="border-b border-ink/15 py-5">
                    {body}
                  </div>
                );
              })}
            </dl>

            <a
              href={`https://wa.me/${PHONE_RAW}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block border border-mint/50 bg-mint/10 px-6 py-6 mt-7 transition hover:bg-mint/20"
            >
              <span className="block font-display text-xl text-ink mb-1">
                Message us on WhatsApp
              </span>
              <span className="block text-ink/70 body-text">
                Usually the fastest way to reach us
              </span>
            </a>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="wrap pb-16 md:pb-24">
        <div className="border border-ink/12 overflow-hidden">
          <iframe
            title="Makheshwari Foods location"
            src="https://maps.google.com/maps?q=Samastipur%2C%20Bihar%20848101&z=13&output=embed"
            className="w-full h-[18rem] md:h-[24rem] border-0 block"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        <p className="text-ink/70 text-[11px] mt-5 text-center">
          {LEGAL_ENTITY}, {ADDRESS} · FSSAI {FSSAI} · GSTIN {GSTIN}
        </p>
      </section>
    </>
  );
}
