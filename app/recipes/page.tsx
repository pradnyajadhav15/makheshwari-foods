import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { recipes } from "@/lib/recipes";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "Makhana kheer, makhana chaat and makhana curry. How Mithila kitchens have cooked makhana for generations.",
};

export default function Recipes() {
  return (
    <>
      <section className="bg-ink text-cream">
        <div className="wrap pt-14 pb-16 md:pt-20 md:pb-24">
          <div className="max-w-3xl">
            <p className="marker marker-light mb-6">From the kitchen</p>
            <h1 className="display-xl text-cream">More than a snack</h1>
            <p className="lede text-cream/65 mt-7 max-w-xl">
              Makhana has been cooked in Mithila kitchens for generations, long before anyone put it
              in a pouch.
            </p>
          </div>
        </div>
      </section>

      <section className="wrap section">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recipes.map((r, i) => (
            <Reveal key={r.slug} delay={i * 90} className="h-full">
              <Link href={`/recipes/${r.slug}`} className="group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden bg-sandsoft">
                  <Image
                    src={`/recipes/${r.slug}.jpg`}
                    alt={r.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[900ms] group-hover:scale-105"
                  />
                </div>

                <div className="flex gap-3 text-[0.62rem] tracking-tracksm uppercase text-ink/70 mt-5">
                  <span>{r.time}</span>
                  <span>·</span>
                  <span>Serves {r.serves}</span>
                  <span>·</span>
                  <span>{r.difficulty}</span>
                </div>

                <h2 className="display-sm text-ink mt-3 group-hover:text-golddeep transition">
                  {r.name}
                </h2>
                <p className="text-ink/70 body-text mt-2">{r.blurb}</p>

                <span className="link-quiet text-golddeep mt-4">
                  Read recipe
                  <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="bg-sandsoft/70 border-t border-ink/10">
        <div className="wrap section-sm grid md:grid-cols-2 gap-8 md:gap-14 items-center">
          <h2 className="display-md text-ink">Start with the makhana.</h2>
          <div>
            <p className="text-ink/75 body-text mb-7">
              Every one of these works with our roasted range, or with plain raw makhana if you would
              rather season it yourself.
            </p>
            <Link href="/shop" className="btn btn-primary">
              Shop the range
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
