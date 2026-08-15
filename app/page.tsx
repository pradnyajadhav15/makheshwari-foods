import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import HeroVideo from "@/components/HeroVideo";
import { getLiveProducts } from "@/lib/liveProducts";

export const revalidate = 60;

const TRUST = [
  "FSSAI licensed · 10426330000072",
  "Roasted, never fried",
  "Free shipping over ₹499",
  "Sealed the day it is packed",
  "Hand sorted in Samastipur",
];

const REASONS = [
  {
    t: "Roasted at source",
    b: "We roast in Samastipur, inside the belt where the crop grows. No long haul before it reaches the pouch.",
  },
  {
    t: "Small batch, always",
    b: "Batches are sized so nothing sits waiting. Every pouch is sealed the day it is packed and carries a date.",
  },
  {
    t: "Hand sorted",
    b: "Graded by size and colour before packing, so what you open is even rather than a mix of whatever came up.",
  },
  {
    t: "Never deep fried",
    b: "Hot air only, and no palm oil. It takes longer and costs more, and it is the only way to keep makhana light.",
  },
  {
    t: "FSSAI licensed",
    b: "Licence 10426330000072, GST invoiced, and every claim on the pack is one we can stand behind.",
  },
  {
    t: "Answered by a person",
    b: "Message the WhatsApp number and Sonu or someone on the team replies. Not a bot, not a ticket queue.",
  },
];

const RECIPES = [
  { t: "Makhana kheer", b: "Slow simmered in milk with cardamom and jaggery. The Kojagara classic.", time: "30 min", href: "/recipes/makhana-kheer", img: "/recipes/makhana-kheer.jpg" },
  { t: "Makhana chaat", b: "Roasted, then tossed with onion, tomato, lemon and chaat masala.", time: "10 min", href: "/recipes/makhana-chaat", img: "/recipes/makhana-chaat.jpg" },
  { t: "Makhana in curry", b: "Dropped into a tomato gravy at the end so it stays crisp.", time: "25 min", href: "/recipes/makhana-curry", img: "/recipes/makhana-curry.jpg" },
];

const MARKETPLACES = [
  { n: "Amazon", f: "amazon", u: "https://www.amazon.in/Makheshwari-Makhana-Roasted-Non-Fried-Crunchy/dp/B0H4ZW8W6N" },
  { n: "Flipkart", f: "flipkart", u: "https://www.flipkart.com/makheshwari-makhana-gm01-fox-nut/p/itm936f89f66380e" },
  { n: "IndiaMART", f: "indiamart", u: "https://www.indiamart.com/proddetail/makheshwari-makhana-sonu-enterprises-2859488333273.html" },
];

export default async function Home() {
  const products = await getLiveProducts();

  return (
    <>
      <HeroVideo />

      {/* Trust strip — a quiet marquee rather than a floating card that
          overlapped the hero and stacked badly on phones */}
      <div className="bg-ink text-cream/70 overflow-hidden border-b border-cream/10">
        <div className="flex whitespace-nowrap animate-marquee py-3.5">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex shrink-0" aria-hidden={dup === 1}>
              {TRUST.map((t) => (
                <span
                  key={t}
                  className="flex items-center gap-3 px-6 text-[0.65rem] tracking-tracksm uppercase"
                >
                  <span className="w-1 h-1 rounded-full bg-gold shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* PRODUCTS — moved directly under the hero. Previously these sat
          below a long essay section, a third of the way down the page. */}
      <section className="wrap section">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-5 mb-9 md:mb-12">
            <div className="max-w-xl">
              <p className="marker mb-5">The range</p>
              <h2 className="display-lg text-ink">Three flavours,<br />one honest crunch.</h2>
            </div>
            <Link href="/shop" className="link-quiet text-ink/60 hover:text-ink">
              All products →
            </Link>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90} className="h-full">
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Origin — asymmetric split, image bleeding to the edge */}
      <section className="bg-ink text-cream overflow-hidden">
        <div className="grid lg:grid-cols-2 items-stretch">
          <div className="relative min-h-[15rem] sm:min-h-[22rem] lg:min-h-[34rem] order-1 lg:order-none">
            <Image
              src="/brand/harvest.jpg"
              alt="Makhana harvest in the ponds of Mithila"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>

          <Reveal>
            <div className="h-full flex flex-col justify-center px-[clamp(1.15rem,5vw,4.5rem)] py-14 md:py-20">
              <p className="marker marker-light mb-5">Know your makhana</p>
              <h2 className="display-lg text-cream">It begins waist-deep in water.</h2>
              <p className="lede text-cream/65 mt-6 max-w-md">
                Makhana does not grow on a plant you can walk up to. It grows underwater, on a
                prickly water lily rooted in the pond bed, and every seed is brought up by hand.
              </p>
              <p className="text-cream/55 body-text mt-4 max-w-md">
                We buy from those ponds, roast in Samastipur, and seal the same day.
              </p>
              <Link href="/know-your-makhana" className="btn btn-light self-start mt-9">
                See how it is made
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Why us — numbered editorial list. Replaces six white drop-shadow
          cards with icons, which was the most template-like block on the page. */}
      <section className="wrap section">
        <Reveal className="max-w-2xl mb-12 md:mb-16">
          <p className="marker mb-5">Why choose us</p>
          <h2 className="display-lg text-ink">Closer to the pond than anyone else.</h2>
          <p className="lede text-ink/60 mt-6">
            Most makhana leaves Bihar in sacks and gets packed under someone else&apos;s name. Ours
            never leaves.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-14 gap-y-0">
          {REASONS.map((c, i) => (
            <Reveal key={c.t} delay={i * 70}>
              <div className="border-t border-ink/15 py-7 md:py-9 h-full">
                <span className="font-display text-gold text-sm tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-sm text-ink mt-3">{c.t}</h3>
                <p className="text-ink/60 body-text mt-3">{c.b}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Purity — full-bleed sand field, centred for contrast with the
          left-aligned sections above and below */}
      <section className="bg-sandsoft/70 border-y border-ink/10">
        <div className="wrap-mid section text-center">
          <Reveal>
            <p className="marker marker-center mb-6">Raw and natural</p>
            <h2 className="display-lg text-ink">Pure, natural,<br />and nothing else.</h2>
            <p className="lede text-ink/65 mt-7 max-w-xl mx-auto">
              Sourced from the ponds of the Mithila belt and sorted by hand for size and colour. No
              additives, no preservatives, and nothing to hide behind.
            </p>

            <ul className="flex flex-wrap justify-center gap-x-2 gap-y-2.5 mt-10">
              {[
                "100% plant based",
                "Naturally gluten free",
                "No additives",
                "No preservatives",
                "Single ingredient",
                "Hand sorted",
                "Roasted, never fried",
                "Exclusively vegetarian",
              ].map((t) => (
                <li
                  key={t}
                  className="border border-ink/20 rounded-full px-4 py-2 text-[0.64rem] tracking-tracksm uppercase text-ink/65"
                >
                  {t}
                </li>
              ))}
            </ul>

            <Link href="/shop" className="btn btn-primary mt-10">
              Explore all
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Recipes — now with the images that already sit unused in /public */}
      <section className="wrap section">
        <Reveal>
          <div className="flex items-end justify-between flex-wrap gap-5 mb-9 md:mb-12">
            <div className="max-w-xl">
              <p className="marker mb-5">From the kitchen</p>
              <h2 className="display-lg text-ink">More than a snack</h2>
              <p className="text-ink/60 body-text mt-5">
                Makhana has been cooked in Mithila kitchens for generations, long before anyone put
                it in a pouch.
              </p>
            </div>
            <Link href="/recipes" className="link-quiet text-ink/60 hover:text-ink">
              All recipes →
            </Link>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 md:gap-7">
          {RECIPES.map((r, i) => (
            <Reveal key={r.t} delay={i * 90} className="h-full">
              <Link href={r.href} className="group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-sandsoft">
                  <Image
                    src={r.img}
                    alt={r.t}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                  <span className="absolute top-3 left-3 bg-paper/90 text-ink text-[0.6rem] tracking-tracksm uppercase px-3 py-1.5 rounded-full">
                    {r.time}
                  </span>
                </div>
                <h3 className="display-sm text-ink mt-5 group-hover:text-gold transition">{r.t}</h3>
                <p className="text-ink/60 body-text mt-2">{r.b}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Marketplaces */}
      <section className="bg-ink text-cream">
        <div className="wrap section-sm">
          <Reveal className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-16">
            <div className="lg:w-1/3">
              <p className="marker marker-light mb-5">Also available on</p>
              <h2 className="display-md text-cream">Buy where you already shop</h2>
              <p className="text-cream/55 body-text mt-4">
                Same makhana, same Samastipur roastery.
              </p>
            </div>

            <div className="lg:flex-1 grid grid-cols-3 gap-3 md:gap-5">
              {MARKETPLACES.map((m) => (
                <a
                  key={m.n}
                  href={m.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`Buy on ${m.n}`}
                  className="group bg-paper h-20 md:h-28 flex items-center justify-center transition-colors hover:bg-gold"
                >
                  {/* These three logos have very different aspect ratios and
                      differing amounts of baked-in whitespace, so scale each
                      to fit its tile rather than capping a shared height. */}
                  <Image
                    src={`/marketplaces/${m.f}.jpg`}
                    alt={m.n}
                    width={220}
                    height={220}
                    className="w-full h-full object-contain p-3 md:p-4 mix-blend-multiply"
                  />
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Bulk */}
      <section className="wrap section">
        <Reveal>
          <div className="border border-ink/15 bg-paper px-6 py-12 md:px-16 md:py-16 grid lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-16 items-center">
            <div>
              <p className="marker mb-5">Bulk & reseller</p>
              <h2 className="display-md text-ink">Buying by the carton?</h2>
              <p className="text-ink/60 body-text mt-5 max-w-md">
                We supply retailers, distributors and corporate gifting direct from our Samastipur
                unit, with GST invoicing and custom pack sizes.
              </p>
            </div>
            <div className="lg:justify-self-end">
              <Link href="/bulk-orders" className="btn btn-primary">
                Request bulk pricing
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
