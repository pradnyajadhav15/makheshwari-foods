import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getLiveProducts } from "@/lib/liveProducts";

export const metadata: Metadata = {
  title: "Our products",
  description: "Roasted makhana from Samastipur, Bihar. Peri Peri, Garden Mint and Himalayan Pink Salt. Roasted, never fried.",
};

export const revalidate = 60;

export default async function Shop() {
  const products = await getLiveProducts();
  return (
    <>
      <section className="bg-ink px-6 md:px-14 py-20 text-center">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">Our products</p>
          <h1 className="font-display text-cream text-4xl md:text-6xl mb-6">Flavoured makhana</h1>
          <p className="text-cream/65 font-light max-w-xl mx-auto leading-relaxed">
            Whole makhana from the Mithila belt, roasted in small batches and seasoned by hand.
          </p>
        </Reveal>
      </section>

      <section className="bg-cream border-b border-ink/10">
        <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap justify-center gap-3">
          <span className="bg-ink text-cream rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase">Makhana</span>
          <span className="border border-ink/20 text-ink/40 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase">Namkeen &middot; soon</span>
          <span className="border border-ink/20 text-ink/40 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase">Gift boxes &middot; soon</span>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 py-20">
        <div className="max-w-6xl mx-auto">
          <p className="text-ink/50 text-sm font-light mb-10">{products.length} products</p>
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <Reveal key={p.slug} delay={i * 120}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-sand/30 px-6 md:px-14 py-20">
        <Reveal className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl text-ink mb-5">Need a bigger quantity?</h2>
          <p className="text-ink/60 font-light max-w-lg mx-auto leading-relaxed mb-9">
            We supply retailers, distributors and corporate gifting direct from our Samastipur unit.
          </p>
          <Link href="/bulk-orders" className="inline-block bg-ink text-cream rounded-full px-11 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
            Request bulk pricing
          </Link>
        </Reveal>
      </section>
    </>
  );
}