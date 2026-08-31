import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IngredientList, StepList } from "@/components/RecipeInteractive";
import { recipes, getRecipe } from "@/lib/recipes";

const bar = { peri: "bg-peri", mint: "bg-mint", salt: "bg-salt" };

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  return {
    title: r.name,
    description: r.blurb,
    alternates: { canonical: `/recipes/${r.slug}` },
  };
}

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) notFound();
  const others = recipes.filter((x) => x.slug !== r.slug);

  const schema = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.name,
    description: r.blurb,
    image: [`https://makheshwarifoods.com/recipes/${r.slug}.jpg`],
    recipeYield: `${r.serves} servings`,
    totalTime: `PT${parseInt(r.time)}M`,
    recipeIngredient: r.ingredients.flatMap((g) => g.items),
    recipeCuisine: "Indian",
    recipeCategory: r.slug === "makhana-kheer" ? "Dessert" : "Snack",
    /* Drawn from the recipe itself rather than invented, so the keywords
       match what the page actually says. */
    keywords: [r.name, "makhana", "fox nuts", "phool makhana", r.uses].join(", "),
    /* Each step gets an anchor so Google can deep link into the method. */
    recipeInstructions: r.steps.map((s, i) => ({
      "@type": "HowToStep",
      name: s.t,
      text: s.b,
      url: `https://makheshwarifoods.com/recipes/${r.slug}#step-${i + 1}`,
    })),
    author: { "@type": "Organization", name: "Makheshwari Foods" },
  };

  const meta: [string, string][] = [
    ["Time", r.time],
    ["Serves", r.serves],
    ["Level", r.difficulty],
    ["Uses", r.uses],
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* Full-bleed image hero with the title over it */}
      <section className="relative isolate overflow-hidden bg-inkdeep flex items-end min-h-[24rem] md:min-h-[32rem]">
        <Image
          src={`/recipes/${r.slug}.jpg`}
          alt={r.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <span className="hero-scrim" aria-hidden="true" />

        <div className="wrap relative z-10 pt-20 pb-10 md:pb-14">
          <Link href="/recipes" className="link-quiet text-cream/70 hover:text-gold mb-5">
            ← All recipes
          </Link>
          <h1 className="display-xl text-cream max-w-3xl">{r.name}</h1>
          <div className={`h-1.5 w-20 ${bar[r.accent]} mt-6`} />
        </div>
      </section>

      <section className="wrap section-sm">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 lg:gap-14 items-start">
          <p className="lede text-ink/70 max-w-2xl">{r.intro}</p>

          <dl className="border border-ink/12 bg-paper p-6 min-w-full lg:min-w-[14rem] grid grid-cols-2 lg:block gap-x-6">
            {meta.map(([k, v]) => (
              <div key={k} className="py-2.5 lg:border-b border-ink/10 last:border-0">
                <dt className="text-ink/70 text-[0.6rem] tracking-tracksm uppercase">{k}</dt>
                <dd className="text-ink body-text mt-0.5">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap pb-14 md:pb-20">
        <div className="grid lg:grid-cols-[20rem_1fr] gap-8 lg:gap-12 items-start">
          <div className="lg:sticky lg:top-28">
            <IngredientList groups={r.ingredients} />
          </div>

          <div>
            <h2 className="display-sm text-ink mb-5">Method</h2>
            <StepList steps={r.steps} />

            <div className="mt-12 bg-ink text-cream p-7 sm:p-9">
              <h2 className="display-sm text-cream mb-6">Worth knowing</h2>
              <ul className="space-y-4">
                {r.tips.map((t) => (
                  <li key={t} className="flex gap-4">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0 mt-2.5" />
                    <p className="text-cream/70 body-text">{t}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-sandsoft/60 border-t border-ink/10">
        <div className="wrap section-sm">
          <p className="marker mb-6">Keep cooking</p>

          <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-10">
            {others.map((o) => (
              <Link
                key={o.slug}
                href={`/recipes/${o.slug}`}
                className="group border border-ink/12 bg-paper p-6 flex items-center gap-5 transition hover:border-gold/60"
              >
                <span className={`w-1 h-12 rounded-full shrink-0 ${bar[o.accent]}`} />
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-xl text-ink group-hover:text-golddeep transition">
                    {o.name}
                  </h3>
                  <p className="text-ink/70 text-xs mt-1">
                    {o.time} · Serves {o.serves}
                  </p>
                </div>
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-golddeep shrink-0 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            ))}
          </div>

          <Link href="/shop" className="btn btn-primary">
            Get the makhana
          </Link>
        </div>
      </section>
    </>
  );
}
