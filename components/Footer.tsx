"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FSSAI, GSTIN, LEGAL_ENTITY, ADDRESS, EMAIL, INSTAGRAM } from "@/lib/products";

const shop = [
  { href: "/shop", label: "All makhana" },
  { href: "/shop/makhana/peri-peri", label: "Peri Peri" },
  { href: "/shop/makhana/garden-mint", label: "Garden Mint" },
  { href: "/shop/makhana/himalayan-pink-salt", label: "Himalayan Pink Salt" },
  { href: "/bulk-orders", label: "Bulk & reseller" },
];

const learn = [
  { href: "/our-story", label: "Our story" },
  { href: "/know-your-makhana", label: "Know your makhana" },
  { href: "/recipes", label: "Recipes" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact us" },
];

const help = [
  { href: "/account", label: "Track your order" },
  { href: "/shipping-returns", label: "Shipping & returns" },
  { href: "/terms", label: "Terms of service" },
  { href: "/privacy", label: "Privacy policy" },
];

const social = [
  { href: INSTAGRAM, label: "Instagram" },
  { href: "https://www.youtube.com/@MakheshwariMakhana07", label: "YouTube" },
  { href: "https://wa.me/917485001464", label: "WhatsApp" },
  { href: "https://in.linkedin.com/in/sonu-kumar-248730423", label: "LinkedIn" },
];

const marketplaces = [
  { href: "https://www.amazon.in/Makheshwari-Makhana-Roasted-Non-Fried-Crunchy/dp/B0H4ZW8W6N", label: "Amazon" },
  { href: "https://www.flipkart.com/makheshwari-makhana-gm01-fox-nut/p/itm936f89f66380e", label: "Flipkart" },
  { href: "https://www.indiamart.com/proddetail/makheshwari-makhana-sonu-enterprises-2859488333273.html", label: "IndiaMART" },
];

function Column({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <p className="text-cream/70 text-[0.62rem] tracking-tracksm uppercase mb-5">{title}</p>
      <ul className="space-y-3">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="text-cream/75 text-sm font-light hover:text-gold transition">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  /* The admin has its own chrome — Header already guards this way, but
     Footer never did, so the storefront footer was rendering underneath
     the dashboard. */
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-inkdeep text-cream">
      {/* Masthead */}
      <div className="wrap pt-16 pb-12 md:pt-20 md:pb-14">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-20 items-start">
          <div className="max-w-md">
            <p className="font-display text-cream text-3xl md:text-4xl leading-tight">
              Roasted where it grows.
            </p>
            <p className="text-cream/60 body-text mt-5">
              Whole makhana from the ponds of the Mithila belt, hot-air roasted in small batches in
              Samastipur and sealed the day it is packed.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop" className="btn btn-gold">Shop the range</Link>
              <Link href="/bulk-orders" className="btn btn-ghost-light">Bulk enquiry</Link>
            </div>
          </div>

          <div className="lg:justify-self-end lg:text-right">
            <p className="text-cream/70 text-[0.62rem] tracking-tracksm uppercase mb-5">Talk to us</p>
            <a href="tel:+917485001464" className="block font-display text-2xl md:text-3xl text-cream hover:text-gold transition">
              +91 74850 01464
            </a>
            <a href={`mailto:${EMAIL}`} className="block text-cream/70 text-sm font-light mt-3 hover:text-gold transition break-words">
              {EMAIL}
            </a>
            <p className="text-cream/70 text-sm font-light mt-4 leading-relaxed">
              {LEGAL_ENTITY}
              <br />
              {ADDRESS} 848101
            </p>
          </div>
        </div>
      </div>

      {/* Link grid */}
      <div className="border-t border-cream/10">
        <div className="wrap py-12 md:py-14 grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
          <Column title="Shop" links={shop} />
          <Column title="Learn" links={learn} />
          <Column title="Help" links={help} />

          <div>
            <p className="text-cream/70 text-[0.62rem] tracking-tracksm uppercase mb-5">Follow</p>
            <ul className="space-y-3">
              {social.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/75 text-sm font-light hover:text-gold transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>

            <p className="text-cream/70 text-[0.62rem] tracking-tracksm uppercase mt-9 mb-5">
              Also on
            </p>
            <ul className="space-y-3">
              {marketplaces.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/75 text-sm font-light hover:text-gold transition"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Compliance */}
      <div className="border-t border-cream/10">
        <div className="wrap py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[11px] text-cream/70 leading-relaxed">
          <p>
            Marketed by {LEGAL_ENTITY}, {ADDRESS} · FSSAI Lic. {FSSAI} · GSTIN {GSTIN}
          </p>
          <p className="md:text-right">
            © {new Date().getFullYear()} Makheshwari Foods · Roasted, never fried.
          </p>
        </div>
      </div>
    </footer>
  );
}
