import Link from "next/link";
import { FSSAI, GSTIN, LEGAL_ENTITY, ADDRESS, EMAIL, INSTAGRAM } from "@/lib/products";

const quick = [
  { href: "/our-story", label: "About us" },
  { href: "/shop", label: "Our products" },
  { href: "/know-your-makhana", label: "Know your makhana" },
  { href: "/recipes", label: "Recipes" },
  { href: "/bulk-orders", label: "Bulk orders" },
  { href: "/contact", label: "Contact us" },
  { href: "/faq", label: "FAQ" },
];

const policies = [
  { href: "/shipping-returns", label: "Shipping and returns" },
  { href: "/terms", label: "Terms of service" },
  { href: "/privacy", label: "Privacy policy" },
];

export default function Footer() {
  return (
    <footer className="bg-inkdeep text-cream/70">
      <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-12 md:gap-10">

        <div>
          <p className="font-display text-cream text-2xl leading-tight">Makheshwari Foods</p>
          <p className="text-gold text-[9px] tracking-track mt-2 mb-6">ROOTED IN BIHAR</p>
          <p className="text-sm font-light leading-relaxed mb-7">
            Roasted makhana from the ponds of Mithila, made in small batches and sealed the day it
            is packed.
          </p>
          <p className="text-sm font-light leading-relaxed">{ADDRESS}</p>
          <a href="tel:+917485001464" className="block text-sm font-light mt-3 hover:text-gold transition">+91 7485 001 464</a>
          <a href={`mailto:${EMAIL}`} className="block text-sm font-light mt-2 hover:text-gold transition break-words">{EMAIL}</a>
        </div>

        <div>
          <p className="text-cream text-[11px] tracking-tracksm uppercase mb-6">Quick links</p>
          <ul className="space-y-3.5 text-sm font-light">
            {quick.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold transition">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-cream text-[11px] tracking-tracksm uppercase mb-6">Policies</p>
          <ul className="space-y-3.5 text-sm font-light">
            {policies.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-gold transition">{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-cream text-[11px] tracking-tracksm uppercase mb-6">Follow</p>
          <ul className="space-y-3.5 text-sm font-light">
            <li>
              <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">Instagram</a>
            </li>
            <li>
              <a href="https://www.youtube.com/@MakheshwariMakhana07" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">YouTube</a>
            </li>
            <li>
              <a href="https://in.linkedin.com/in/sonu-kumar-248730423" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">LinkedIn</a>
            </li>
            <li>
              <a href="https://wa.me/917485001464" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">WhatsApp</a>
            </li>
            <li>
              <a href="https://www.amazon.in/Makheshwari-Makhana-Roasted-Non-Fried-Crunchy/dp/B0H4ZW8W6N" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">Amazon</a>
            </li>
            <li>
              <a href="https://www.flipkart.com/makheshwari-makhana-gm01-fox-nut/p/itm936f89f66380e" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">Flipkart</a>
            </li>
            <li>
              <a href="https://www.indiamart.com/proddetail/makheshwari-makhana-sonu-enterprises-2859488333273.html" target="_blank" rel="noopener noreferrer" className="hover:text-gold transition">IndiaMART</a>
            </li>
          </ul>
        </div>

      </div>

      <div className="border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-[11px] text-cream/45 leading-relaxed">
          <p>Marketed by {LEGAL_ENTITY}, {ADDRESS} &nbsp;&middot;&nbsp; FSSAI Lic. No. {FSSAI} &nbsp;&middot;&nbsp; GSTIN {GSTIN}</p>
          <p className="mt-2.5">&copy; {new Date().getFullYear()} Makheshwari Foods &middot; Samastipur, Bihar &middot; Roasted, never fried.</p>
        </div>
      </div>
    </footer>
  );
}