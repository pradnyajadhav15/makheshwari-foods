import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IngredientList, StepList } from "@/components/RecipeInteractive";
import { recipes, getRecipe } from "@/lib/recipes";

const bar = { peri: "bg-peri", mint: "bg-mint", salt: "bg-salt" };
const soft = { peri: "bg-peri/10", mint: "bg-mint/10", salt: "bg-salt/10" };

export function generateStaticParams() {
  return recipes.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const r = getRecipe(slug);
  if (!r) return {};
  return { title: r.name, description: r.blurb };
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
    recipeYield: `${r.serves} servings`,
    totalTime: `PT${parseInt(r.time)}M`,
    recipeIngredient: r.ingredients.flatMap((g) => g.items),
    recipeInstructions: r.steps.map((s) => ({ "@type": "HowToStep", name: s.t, text: s.b })),
    author: { "@type": "Organization", name: "Makheshwari Foods" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className={`${soft[r.accent]} px-6 md:px-14 pt-10 pb-16`}>
        <div className="max-w-5xl mx-auto">
          <Link href="/recipes" className="text-ink/45 text-[10px] tracking-tracksm uppercase hover:text-gold transition">&larr; All recipes</Link>

          <div className="grid md:grid-cols-[1fr_auto] gap-10 items-end mt-8">
            <div>
              <h1 className="font-display text-5xl md:text-7xl text-ink leading-[1.03]">{r.name}</h1>
              <div className={`h-1.5 w-20 ${bar[r.accent]} mt-6`} />
              <p className="text-ink/65 text-lg font-light leading-relaxed max-w-xl mt-7">{r.intro}</p>
            </div>

            <div className="bg-white rounded-[1.25rem] border border-ink/10 p-7 min-w-[13rem]">
              {[
                ["Time", r.time],
                ["Serves", r.serves],
                ["Level", r.difficulty],
                ["Uses", r.uses],
              ].map(([k, v]) => (
                <div key={k} className="py-2.5 border-b border-ink/10 last:border-0">
                  <p className="text-ink/40 text-[9px] tracking-tracksm uppercase">{k}</p>
                  <p className="text-ink text-sm font-light mt-0.5">{v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 py-14">
        <div className="max-w-5xl mx-auto grid md:grid-cols-[20rem_1fr] gap-8 items-start">
          <div className="md:sticky md:top-28">
            <IngredientList groups={r.ingredients} />
          </div>

          <div>
            <h2 className="font-display text-2xl text-ink mb-6">Method</h2>
            <StepList steps={r.steps} />

            <div className="mt-12 bg-ink rounded-[1.5rem] p-9">
              <h2 className="font-display text-cream text-2xl mb-7">Worth knowing</h2>
              <div className="space-y-5">
                {r.tips.map((t) => (
                  <div key={t} className="flex gap-4">
                    <span className="text-gold shrink-0 mt-1">&bull;</span>
                    <p className="text-cream/70 text-sm font-light leading-relaxed">{t}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-cream px-6 md:px-14 pb-20">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {others.map((o) => (
              <Link key={o.slug} href={`/recipes/${o.slug}`} className="group bg-white rounded-[1.25rem] border border-ink/10 p-7 flex items-center gap-5 transition-all duration-400 hover:-translate-y-1.5 hover:border-gold/60">
                <span className={`w-1 h-12 rounded-full ${bar[o.accent]}`} />
                <div className="flex-1">
                  <h3 className="font-display text-xl text-ink group-hover:text-gold transition">{o.name}</h3>
                  <p className="text-ink/40 text-xs mt-1">{o.time} &middot; Serves {o.serves}</p>
                </div>
                <span className="text-gold transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-12 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
              Get the makhana
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}