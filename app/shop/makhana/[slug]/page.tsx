import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import Reviews from "@/components/Reviews";
import { getLiveProduct, getLiveProducts } from "@/lib/liveProducts";
import { products, accentClass, accentText, formatPrice } from "@/lib/products";

export const revalidate = 60;

const BULLETS: Record<string, string[]> = {
  "peri-peri": [
    "Whole makhana from the Mithila belt, roasted in small batches in Samastipur.",
    "Tumbled in a chilli and herb blend that builds slowly and keeps going.",
    "Hot-air roasted, never deep fried, and no palm oil.",
    "Naturally gluten free with a single seed at the base.",
    "Sealed the day it is packed, with a date on every pouch.",
  ],
  "garden-mint": [
    "Whole makhana with a clean mint and herb seasoning.",
    "Lighter than the peri peri and easier to keep eating.",
    "Hot-air roasted, never deep fried, and no palm oil.",
    "Naturally gluten free with a single seed at the base.",
    "Sealed the day it is packed, with a date on every pouch.",
  ],
  "himalayan-pink-salt": [
    "Just makhana, a little oil and Himalayan pink salt.",
    "Nothing to hide behind, which is why it shows whether the roast was done properly.",
    "Hot-air roasted, never deep fried, and no palm oil.",
    "Naturally gluten free with a single seed at the base.",
    "Sealed the day it is packed, with a date on every pouch.",
  ],
};

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = products.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: `${p.name} Roasted Makhana - ${p.weightG}g`, description: p.description.slice(0, 155) };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getLiveProduct(slug);
  if (!product) notFound();

  const all = await getLiveProducts();
  const others = all.filter((p) => p.slug !== product.slug);
  const bullets = BULLETS[product.slug] || [product.description];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `Makheshwari ${product.name} Roasted Makhana`,
    description: product.description,
    image: product.images,
    brand: { "@type": "Brand", name: "Makheshwari Foods" },
    countryOfOrigin: "IN",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="max-w-6xl mx-auto px-6 pt-8 text-[11px] tracking-tracksm uppercase text-ink/50">
        <Link href="/shop" className="hover:text-gold transition">Shop</Link>
        <span className="mx-2">/</span>
        <span className="text-ink/80">{product.name}</span>
      </div>

      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-14">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <div className={`h-1.5 w-16 ${accentClass[product.accent]} mb-6`} />
          <p className="text-gold text-[10px] tracking-track uppercase mb-3">Makheshwari Makhana</p>
          <h1 className="font-display text-4xl md:text-5xl leading-tight">{product.name}</h1>
          <p className={`${accentText[product.accent]} text-lg mt-3 font-light`}>{product.hook}</p>

          <div className="flex items-baseline gap-4 mt-7">
            <span className="text-3xl font-display">{formatPrice(product.price)}</span>
            {product.mrp && product.price && product.mrp > product.price && (
              <span className="text-ink/40 line-through">{formatPrice(product.mrp)}</span>
            )}
            <span className="text-ink/50 text-sm">{product.weightG} g</span>
          </div>
          <p className="text-ink/45 text-xs mt-1.5">Inclusive of all taxes</p>

          <ul className="mt-8 space-y-3">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-ink/65 text-sm font-light leading-relaxed">
                <span className="text-gold shrink-0 mt-0.5">&bull;</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-3 mt-8">
            <div className="border border-ink/15 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/65 text-center">Roasted, never fried</div>
            <div className="border border-ink/15 rounded-xl px-5 py-3.5 text-[10px] tracking-tracksm uppercase text-ink/65 text-center">No palm oil</div>
          </div>

          {product.inStock && product.stock > 0 && product.stock < 10 && (
            <p className="text-peri text-sm mt-6 font-light">Only {product.stock} left</p>
          )}

          <div className="mt-8">
            <BuyBox slug={product.slug} inStock={product.inStock} />
          </div>
        </div>
      </section>
      <Reviews slug={product.slug} productName={product.name} />


      <section className="bg-ink mt-12">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-display text-cream text-3xl mb-10">Also try</h2>
          <div className="grid md:grid-cols-2 gap-7">
            {others.map((p) => (
              <Link key={p.slug} href={`/shop/makhana/${p.slug}`} className="group border border-cream/15 hover:border-gold/60 transition">
                <div className={`h-1.5 ${accentClass[p.accent]}`} />
                <div className="p-8 flex items-center gap-6">
                  <img src={p.images[0]} alt={p.name} className="w-20 h-20 object-contain shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-display text-cream text-2xl">{p.name}</h3>
                    <p className={`${accentText[p.accent]} text-sm mt-2 font-light`}>{p.hook}</p>
                  </div>
                  <span className="text-gold text-[11px] tracking-tracksm uppercase">View</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}