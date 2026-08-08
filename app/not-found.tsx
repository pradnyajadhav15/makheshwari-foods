import Link from "next/link";

export default function NotFound() {
  return (
    <section className="bg-cream px-6 md:px-14 py-28">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-display text-gold text-7xl md:text-8xl mb-6">404</p>
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-5 leading-tight">
          This page went missing.
        </h1>
        <p className="text-ink/60 text-lg font-light leading-relaxed mb-12">
          The link may be old, or the page may have moved. The makhana is still here though.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <Link href="/shop" className="bg-ink text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
            Shop the range
          </Link>
          <Link href="/" className="border border-ink text-ink rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition">
            Back home
          </Link>
        </div>

        <div className="border-t border-ink/10 pt-10">
          <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-5">Try one of these</p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-ink/60 text-[11px] tracking-tracksm uppercase">
            <Link href="/shop/makhana/peri-peri" className="hover:text-gold transition">Peri Peri</Link>
            <Link href="/shop/makhana/garden-mint" className="hover:text-gold transition">Garden Mint</Link>
            <Link href="/shop/makhana/himalayan-pink-salt" className="hover:text-gold transition">Himalayan Pink Salt</Link>
            <Link href="/recipes" className="hover:text-gold transition">Recipes</Link>
            <Link href="/know-your-makhana" className="hover:text-gold transition">Know your makhana</Link>
            <Link href="/bulk-orders" className="hover:text-gold transition">Bulk orders</Link>
            <Link href="/contact" className="hover:text-gold transition">Contact</Link>
          </div>
        </div>
      </div>
    </section>
  );
}