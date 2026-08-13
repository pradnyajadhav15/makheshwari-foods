import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ProductCard from "@/components/ProductCard";
import { products } from "@/lib/products";


import HeroVideo from "@/components/HeroVideo";
export default function Home() {
  return (
    <>
      <HeroVideo />
      <section className="bg-cream px-6 md:px-14 pb-10">
        <div className="max-w-6xl mx-auto -mt-16 relative z-20 bg-ink rounded-[1.5rem] px-6 py-9 grid grid-cols-2 md:grid-cols-4 gap-8 shadow-[0_25px_50px_-20px_rgba(18,53,42,0.45)]">
          {[
            { t: "FSSAI licensed", s: "Lic. 10426330000072" },
            { t: "Roasted, never fried", s: "Hot air, small batch" },
            { t: "Ships across India", s: "Free over 499" },
            { t: "Sealed fresh", s: "Dated on every pack" },
          ].map((f) => (
            <div key={f.t} className="text-center">
              <p className="text-gold text-[11px] tracking-tracksm uppercase">{f.t}</p>
              <p className="text-cream/50 text-[10px] mt-1.5">{f.s}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 py-28">
        <Reveal className="max-w-3xl mx-auto text-center">
          <p className="text-gold text-[11px] tracking-track uppercase mb-5">Raw and natural</p>
          <h2 className="font-display text-4xl md:text-6xl text-ink leading-tight mb-8">
            Pure, natural,
            <br />
            and nothing else.
          </h2>
          <p className="text-ink/65 text-lg font-light leading-relaxed mb-5">
            Our raw makhana is 100% plant based and naturally gluten free, sourced from the ponds of
            the Mithila belt and sorted by hand for size and colour.
          </p>
          <p className="text-ink/65 text-lg font-light leading-relaxed mb-12">
            Perfect on its own or added to your own cooking. Just the natural crunch, with no
            additives, no preservatives and nothing to hide behind.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { t: "100% plant based", d: "M12 3v18M8 7c0 2 1.8 3.5 4 3.5M16 11c0 2-1.8 3.5-4 3.5" },
              { t: "Naturally gluten free", d: "M12 3v18M12 8c-2.5-1.5-4-1-4-1s.5 2.5 4 3.5M12 8c2.5-1.5 4-1 4-1s-.5 2.5-4 3.5M12 14c-2.5-1.5-4-1-4-1s.5 2.5 4 3.5M12 14c2.5-1.5 4-1 4-1s-.5 2.5-4 3.5" },
              { t: "No additives", d: "M12 4a8 8 0 100 16 8 8 0 000-16zM8 8l8 8" },
              { t: "No preservatives", d: "M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3z" },
              { t: "Single ingredient", d: "M12 4a8 8 0 100 16 8 8 0 000-16zM12 9v6M9 12h6" },
              { t: "Hand sorted", d: "M8 12V6a1.5 1.5 0 013 0v5M11 11V5a1.5 1.5 0 013 0v6M14 11V7a1.5 1.5 0 013 0v8a5 5 0 01-5 5H10a4 4 0 01-3.5-2L5 15" },
              { t: "Roasted, never fried", d: "M12 3c2.5 3 4.5 5 4.5 8a4.5 4.5 0 01-9 0c0-3 2-5 4.5-8z" },
              { t: "Exclusively vegetarian", d: "M12 3a9 9 0 100 18 9 9 0 000-18zM8 12h8" },
            ].map((b) => (
              <span key={b.t} className="inline-flex items-center gap-2.5 border border-ink/20 rounded-full pl-4 pr-5 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold hover:text-ink transition duration-300">
                <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d={b.d} /></svg>
                {b.t}
              </span>
            ))}
          </div>

          <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
            Explore all
          </Link>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 pb-24">
        <Reveal>
          <p className="text-gold text-[11px] tracking-track uppercase mb-4">The range</p>
          <h2 className="font-display text-4xl md:text-5xl text-ink mb-3">Flavoured makhana</h2>
          <p className="text-ink/60 font-light max-w-xl mb-14">
            Whole makhana, roasted in small batches and seasoned by hand. Three flavours now, more
            on the way.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-8 perspective">
          {products.map((p, i) => (
            <Reveal key={p.slug} delay={i * 130}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-cream">
        <div className="grid md:grid-cols-2 items-stretch">
          <Reveal>
            <div className="h-full min-h-[16rem] md:min-h-[20rem] bg-sand/40">
              <Image src="/brand/harvest.jpg" alt="Makhana harvest in the ponds of Mithila" width={900} height={700} sizes="(max-width: 768px) 100vw, 50vw" className="w-full h-full object-cover" />
            </div>
          </Reveal>
          <Reveal delay={160}>
            <div className="px-8 md:px-12 py-12 flex flex-col justify-center h-full">
              <p className="text-gold text-[11px] tracking-track uppercase mb-5">Know your makhana</p>
              <h2 className="font-display text-3xl md:text-4xl text-ink mb-5 leading-tight">It begins waist-deep in water.</h2>
              <p className="text-ink/65 font-light leading-relaxed mb-8">Makhana does not grow on a plant you can walk up to. It grows underwater, on a prickly water lily rooted in the pond bed, and every seed is brought up by hand. We buy from those ponds, roast in Samastipur, and seal the same day.</p>
              <Link href="/know-your-makhana" className="self-start bg-ink text-cream rounded-full px-11 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
                Know more
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

<section className="bg-sand/30 px-6 md:px-14 py-24">
        <Reveal className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-gold text-[11px] tracking-track uppercase mb-4">Why choose us</p>
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-5">
              Closer to the pond than anyone else.
            </h2>
            <p className="text-ink/60 font-light max-w-2xl mx-auto leading-relaxed">
              Most makhana leaves Bihar in sacks and gets packed under someone else&apos;s name. Ours
              never leaves.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-7">
            {[
              { t: "Roasted at source", b: "We roast in Samastipur, inside the belt where the crop grows. No long haul before it reaches the pouch.", d: "M12 3c2.5 3 4.5 5 4.5 8a4.5 4.5 0 01-9 0c0-3 2-5 4.5-8z" },
              { t: "Small batch, always", b: "Batches are sized so nothing sits waiting. Every pouch is sealed the day it is packed and carries a date.", d: "M5 8h14l-1.5 12h-11L5 8zM9 8V6a3 3 0 016 0v2" },
              { t: "Hand sorted", b: "Graded by size and colour before packing, so what you open is even rather than a mix of whatever came up.", d: "M8 12V6a1.5 1.5 0 013 0v5M11 11V5a1.5 1.5 0 013 0v6M14 11V7a1.5 1.5 0 013 0v8a5 5 0 01-5 5H10a4 4 0 01-3.5-2L5 15" },
              { t: "Never deep fried", b: "Hot air only, and no palm oil. It takes longer and costs more, and it is the only way to keep makhana light.", d: "M4 12h16M7 8c1.5-2 3-2 5 0s3.5 2 5 0M7 16c1.5 2 3 2 5 0s3.5-2 5 0" },
              { t: "FSSAI licensed", b: "Licence 10426330000072, GST invoiced, and every claim on the pack is one we can stand behind.", d: "M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3zM9 12l2 2 4-4" },
              { t: "Answered by a person", b: "Message the WhatsApp number and Sonu or someone on the team replies. Not a bot, not a ticket queue.", d: "M21 12a8 8 0 11-3.2-6.4L21 4l-1 4M4 12a8 8 0 0013.5 5.8" },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 90}>
                <div className="bg-white rounded-[1.5rem] border border-ink/10 p-9 h-full transition-all duration-500 hover:-translate-y-2 hover:border-gold/60 hover:shadow-[0_25px_50px_-22px_rgba(18,53,42,0.3)]">
                  <span className="inline-flex w-12 h-12 rounded-full bg-gold/15 items-center justify-center mb-6">
                    <svg viewBox="0 0 24 24" className="w-5 h-5 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d={c.d} /></svg>
                  </span>
                  <h3 className="font-display text-2xl text-ink mb-3">{c.t}</h3>
                  <p className="text-ink/55 text-sm font-light leading-relaxed">{c.b}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="bg-cream px-6 md:px-14 py-24">
        <Reveal className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-4">
            <div>
              <p className="text-gold text-[11px] tracking-track uppercase mb-4">From the kitchen</p>
              <h2 className="font-display text-4xl md:text-5xl text-ink">More than a snack</h2>
            </div>
            <Link href="/recipes" className="text-ink/60 text-[11px] tracking-tracksm uppercase hover:text-gold transition">
              All recipes &rarr;
            </Link>
          </div>
          <p className="text-ink/60 font-light max-w-xl mb-14">
            Makhana has been cooked in Mithila kitchens for generations, long before anyone put it
            in a pouch.
          </p>

          <div className="grid md:grid-cols-3 gap-7">
            {[
              { t: "Makhana kheer", b: "Slow simmered in milk with cardamom and jaggery. The Kojagara classic.", time: "30 min", href: "/recipes/makhana-kheer" },
              { t: "Makhana chaat", b: "Roasted, then tossed with onion, tomato, lemon and chaat masala.", time: "10 min", href: "/recipes/makhana-chaat" },
              { t: "Makhana in curry", b: "Dropped into a tomato gravy at the end so it stays crisp.", time: "25 min", href: "/recipes/makhana-curry" },
            ].map((r, i) => (
              <Reveal key={r.t} delay={i * 120}>
                <Link href={r.href} className="block group rounded-[1.5rem] bg-white border border-ink/10 p-9 h-full transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_28px_55px_-20px_rgba(18,53,42,0.25)]">
                  <span className="inline-block text-[9px] tracking-track uppercase text-ink/45 mb-6">
                    {r.time}
                  </span>
                  <h3 className="font-display text-2xl text-ink mb-4 group-hover:text-gold transition">
                    {r.t}
                  </h3>
                  <p className="text-ink/55 text-sm font-light leading-relaxed">{r.b}</p>
                  <span className="inline-block mt-7 text-gold text-[10px] tracking-tracksm uppercase">
                    Read recipe &rarr;
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </section>

<section className="bg-gold px-6 md:px-14 py-20">
        <Reveal className="max-w-5xl mx-auto text-center">
          <p className="text-ink/60 text-[11px] tracking-track uppercase mb-4">Also available on</p>
          <h2 className="font-display text-ink text-3xl md:text-4xl mb-4">Buy where you already shop</h2>
          <p className="text-ink/60 font-light mb-14">Same makhana, same Samastipur roastery.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ n: "Amazon", f: "amazon", u: "https://www.amazon.in/Makheshwari-Makhana-Roasted-Non-Fried-Crunchy/dp/B0H4ZW8W6N" }, { n: "Flipkart", f: "flipkart", u: "https://www.flipkart.com/makheshwari-makhana-gm01-fox-nut/p/itm936f89f66380e" }, { n: "IndiaMART", f: "indiamart", u: "https://www.indiamart.com/proddetail/makheshwari-makhana-sonu-enterprises-2859488333273.html" }].map((m) => (
              <a key={m.n} href={m.u} target="_blank" rel="noopener noreferrer" title={`Buy on ${m.n}`} className="group bg-white rounded-[1.25rem] h-24 flex items-center justify-center px-8 transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-16px_rgba(18,53,42,0.4)]">
                <Image src={`/marketplaces/${m.f}.jpg`} alt={m.n} width={160} height={48} className="max-h-11 max-w-[70%] w-auto object-contain transition-transform duration-400 group-hover:scale-105" />
              </a>
            ))}
          </div>
        </Reveal>
      </section>

<section className="bg-cream px-6 md:px-14 py-24">
        <Reveal className="max-w-4xl mx-auto">
          <div className="rounded-[2rem] bg-gradient-to-br from-mint/20 to-gold/25 p-12 md:p-16 text-center">
            <p className="text-gold text-[11px] tracking-track uppercase mb-5">Bulk and reseller</p>
            <h2 className="font-display text-3xl md:text-5xl text-ink mb-5">Buying by the carton?</h2>
            <p className="text-ink/60 font-light max-w-xl mx-auto leading-relaxed">
              We supply retailers, distributors and corporate gifting direct from our Samastipur
              unit.
            </p>
            <Link
              href="/bulk-orders"
              className="inline-block mt-9 bg-ink text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition"
            >
              Request bulk pricing
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
