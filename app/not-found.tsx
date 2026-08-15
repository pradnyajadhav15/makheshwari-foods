import Link from "next/link";

const suggestions = [
  { href: "/shop/makhana/peri-peri", label: "Peri Peri" },
  { href: "/shop/makhana/garden-mint", label: "Garden Mint" },
  { href: "/shop/makhana/himalayan-pink-salt", label: "Himalayan Pink Salt" },
  { href: "/recipes", label: "Recipes" },
  { href: "/know-your-makhana", label: "Know your makhana" },
  { href: "/bulk-orders", label: "Bulk orders" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <section className="wrap-mid section-lg text-center">
      <p className="font-display text-golddeep text-6xl md:text-8xl">404</p>

      <h1 className="display-lg text-ink mt-5">This page went missing.</h1>

      <p className="lede text-ink/70 mt-6 max-w-md mx-auto">
        The link may be old, or the page may have moved. The makhana is still here though.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        <Link href="/shop" className="btn btn-primary">Shop the range</Link>
        <Link href="/" className="btn btn-outline">Back home</Link>
      </div>

      <div className="border-t border-ink/12 mt-14 pt-10">
        <p className="marker marker-center mb-6">Try one of these</p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {suggestions.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="text-ink/70 text-[0.68rem] tracking-tracksm uppercase py-1.5 hover:text-golddeep transition"
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
