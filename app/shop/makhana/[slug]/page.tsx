import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductGallery from "@/components/ProductGallery";
import BuyBox from "@/components/BuyBox";
import StickyBuyBar from "@/components/StickyBuyBar";
import Reviews from "@/components/Reviews";
import { getLiveProducts } from "@/lib/liveProducts";
import { products, accentClass, accentTextDeep, formatPrice } from "@/lib/products";

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
  const all = await getLiveProducts();
  const product = all.find((p) => p.slug === slug);
  if (!product) notFound();

  const others = all.filter((p) => p.slug !== product.slug);
  const bullets = BULLETS[product.slug] || [product.description];
  const saving =
    product.mrp && product.price && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

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

  const specs = [
    { k: "Net weight", v: `${product.weightG} g` },
    { k: "Ingredients", v: product.ingredients },
    { k: "Allergen advice", v: product.allergens },
    { k: "Shelf life", v: product.shelfLifeMonths },
    { k: "Storage", v: product.storage },
    { k: "Country of origin", v: "India · Samastipur, Bihar" },
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <div className="wrap pt-6 pb-2">
        <nav aria-label="Breadcrumb" className="text-[0.68rem] tracking-tracksm uppercase text-ink/70">
          <Link href="/shop" className="hover:text-golddeep transition">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-ink/75">{product.name}</span>
        </nav>
      </div>

      <section className="wrap pb-14 md:pb-20 pt-4 grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="lg:sticky lg:top-28">
          <ProductGallery images={product.images} name={product.name} />
        </div>

        <div>
          <div className={`h-1.5 w-14 ${accentClass[product.accent]} mb-6`} />

          <p className="marker mb-4">Makheshwari makhana</p>

          <h1 className="display-lg text-ink">{product.name}</h1>

          <p className={`${accentTextDeep[product.accent]} lede mt-3`}>{product.hook}</p>

          <div className="flex items-baseline flex-wrap gap-x-3 gap-y-1 mt-7">
            <span className="font-display text-3xl md:text-4xl text-ink">
              {formatPrice(product.price)}
            </span>
            {product.mrp && product.price && product.mrp > product.price && (
              <span className="text-ink/70 text-lg line-through">{formatPrice(product.mrp)}</span>
            )}
            {saving && (
              <span className="bg-mint/20 text-ink text-[0.68rem] tracking-tracksm uppercase px-2.5 py-1 rounded-full">
                Save {saving}%
              </span>
            )}
          </div>
          <p className="text-ink/70 text-xs mt-1.5">
            {product.weightG} g · inclusive of all taxes
          </p>

          {product.inStock && product.stock > 0 && product.stock < 10 && (
            <p className="text-perideep text-sm mt-5 font-light">
              Only {product.stock} left in stock
            </p>
          )}

          {/* Anchor the sticky mobile bar watches */}
          <div id="buybox-anchor" className="mt-8">
            <BuyBox slug={product.slug} inStock={product.inStock} stock={product.stock} />
          </div>

          <ul className="mt-10 space-y-3.5 border-t border-ink/10 pt-8">
            {bullets.map((b) => (
              <li key={b} className="flex gap-3 text-ink/70 body-text">
                <span className="text-gold shrink-0 mt-[0.45rem] w-1.5 h-1.5 rounded-full bg-gold" />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="grid grid-cols-2 gap-2.5 mt-8">
            {["Roasted, never fried", "No palm oil", "Gluten free", "FSSAI licensed"].map((t) => (
              <div
                key={t}
                className="border border-ink/12 px-4 py-3 text-[0.66rem] tracking-tracksm uppercase text-ink/75 text-center"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specification table — this data was already in lib/products.ts
          but the old page never rendered it. */}
      <section className="bg-sandsoft/60 border-y border-ink/10">
        <div className="wrap section-sm grid lg:grid-cols-[0.8fr_1.2fr] gap-8 lg:gap-16">
          <div>
            <p className="marker mb-4">The detail</p>
            <h2 className="display-md text-ink">What is in the pouch</h2>
            <p className="text-ink/70 body-text mt-4 max-w-sm">
              {product.description}
            </p>
          </div>

          <div>
            <dl className="divide-y divide-ink/10 border-t border-ink/10">
              {specs.map((s) => (
                <div key={s.k} className="py-4 grid sm:grid-cols-[10rem_1fr] gap-1 sm:gap-6">
                  <dt className="text-[0.66rem] tracking-tracksm uppercase text-ink/70 pt-0.5">
                    {s.k}
                  </dt>
                  <dd className="text-ink/75 body-text">{s.v}</dd>
                </div>
              ))}
            </dl>

            {/* Omitted entirely when no panel has been transcribed for this
                pack — an empty or dashed table would read as a real
                declaration of nothing. */}
            {product.nutrition.length > 0 && (
              <div className="mt-10">
                <h3 className="text-[0.66rem] tracking-tracksm uppercase text-ink/70 mb-4">
                  Nutrition information
                </h3>
                <table className="w-full border-t border-ink/10">
                  <caption className="sr-only">
                    {product.nutritionBasis ?? "Nutrition information"}
                  </caption>
                  <tbody className="divide-y divide-ink/10">
                    {product.nutrition.map((n) => (
                      <tr key={n.label}>
                        <th scope="row" className="text-left font-normal text-ink/75 body-text py-2.5 pr-4">
                          {n.label}
                        </th>
                        <td className="text-right text-ink tabular-nums body-text py-2.5 whitespace-nowrap">
                          {n.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {product.nutritionBasis && (
                  <p className="text-ink/70 text-[0.72rem] mt-3 leading-relaxed">
                    {product.nutritionBasis}. As printed on the pack.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <Reviews slug={product.slug} productName={product.name} />

      <section className="bg-ink">
        <div className="wrap section-sm">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-9">
            <div>
              <p className="marker marker-light mb-4">The rest of the range</p>
              <h2 className="display-md text-cream">Also try</h2>
            </div>
            <Link href="/shop" className="link-quiet text-cream/70 hover:text-gold">
              All products →
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/shop/makhana/${p.slug}`}
                className="group border border-cream/15 hover:border-gold/60 transition bg-inkdeep/40"
              >
                <div className={`h-1.5 ${accentClass[p.accent]}`} />
                <div className="p-5 md:p-7 flex items-center gap-5">
                  <div className="w-20 h-20 shrink-0 bg-white flex items-center justify-center">
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      width={80}
                      height={80}
                      className="w-16 h-16 object-contain"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-cream text-xl md:text-2xl leading-tight">{p.name}</h3>
                    <p className={"text-cream/70 text-sm mt-1.5 font-light"}>{p.hook}</p>
                    <p className="text-cream/70 text-sm mt-2">
                      {formatPrice(p.price)} · {p.weightG} g
                    </p>
                  </div>
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <StickyBuyBar
        slug={product.slug}
        name={product.name}
        price={product.price}
        inStock={product.inStock}
      />
    </>
  );
}
