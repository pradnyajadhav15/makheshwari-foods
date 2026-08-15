import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { getLiveProducts } from "@/lib/liveProducts";
import { FREE_SHIPPING_OVER } from "@/lib/products";

export const metadata: Metadata = {
  title: "Our products",
  description:
    "Roasted makhana from Samastipur, Bihar. Peri Peri, Garden Mint and Himalayan Pink Salt. Roasted, never fried.",
};

export const revalidate = 60;

export default async function Shop() {
  const products = await getLiveProducts();

  return (
    <>
      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">The range</p>
            <h1 className="display-xl text-cream">
              Flavoured
              <br />
              makhana
            </h1>
            <p className="lede text-cream/65 mt-7 max-w-xl">
              Whole makhana from the Mithila belt, hot-air roasted in small batches and seasoned by
              hand. Three flavours now, more on the way.
            </p>
          </div>
        </div>
      </section>

      {/* Category rail */}
      {/* Offsets include the header's 1px bottom border, or the rail
          overlaps it by a pixel once both are pinned. */}
      <div className="bg-paper border-b border-ink/10 sticky top-[calc(4rem+1px)] lg:top-[calc(5rem+1px)] z-30">
        <div className="wrap py-3.5 flex gap-2.5 overflow-x-auto no-bar">
          <span className="btn btn-primary shrink-0 min-h-0 py-2.5 px-5">Makhana</span>
          <span className="shrink-0 inline-flex items-center rounded-full border border-ink/15 text-ink/35 px-5 py-2.5 text-[0.66rem] tracking-tracksm uppercase whitespace-nowrap">
            Namkeen · soon
          </span>
          <span className="shrink-0 inline-flex items-center rounded-full border border-ink/15 text-ink/35 px-5 py-2.5 text-[0.66rem] tracking-tracksm uppercase whitespace-nowrap">
            Gift boxes · soon
          </span>
        </div>
      </div>

      <section className="wrap section">
        <div className="flex items-baseline justify-between flex-wrap gap-3 mb-8 md:mb-10">
          <p className="text-ink/50 text-sm font-light">
            {products.length} {products.length === 1 ? "product" : "products"}
          </p>
          <p className="text-ink/50 text-sm font-light">
            Free shipping over ₹{FREE_SHIPPING_OVER}
          </p>
        </div>

        {/* 2-up on phones — the old single column made each card fill the screen */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sandsoft/60 border-t border-ink/10">
        <div className="wrap section-sm grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <div>
            <p className="marker mb-4">Bulk & reseller</p>
            <h2 className="display-md text-ink">Buying by the carton?</h2>
          </div>
          <div>
            <p className="text-ink/65 body-text mb-7">
              We supply retailers, distributors and corporate gifting direct from our Samastipur
              unit, with GST invoicing and custom pack sizes.
            </p>
            <Link href="/bulk-orders" className="btn btn-primary">
              Request bulk pricing
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
