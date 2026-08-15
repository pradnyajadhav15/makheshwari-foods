"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, useToast, DemoNotice, Badge, Sk } from "@/components/admin/ui";

type Settings = {
  announcement: string; announcement_active: boolean;
  instagram: string; support_email: string;
  shop_closed_message: string;
};

/**
 * The storefront copy lives in page components and lib/*.ts, not the
 * database — there is no CMS table. The two things that ARE stored and
 * editable (the announcement bar and the Instagram link) are wired up
 * here for real; everything else is listed with where it actually lives
 * so it can be found, rather than shown as a fake editor that silently
 * discards edits.
 */
const CONTENT_MAP = [
  { area: "Homepage hero", where: "components/HeroVideo.tsx", what: "Headline, sub-copy, both CTAs, poster image" },
  { area: "Featured products", where: "Automatic", what: "Pulled live from the products table, ordered by weight" },
  { area: "Promotional banner", where: "Announcement bar", what: "Editable below", editable: true },
  { area: "Brand story", where: "app/our-story/page.tsx", what: "Full story page copy and section headings" },
  { area: "Process / Know your makhana", where: "app/know-your-makhana/page.tsx", what: "Nine process steps and images" },
  { area: "Recipes", where: "lib/recipes.ts", what: "Ingredients, method steps, tips" },
  { area: "FAQs", where: "app/faq/page.tsx", what: "Three groups of questions and answers" },
  { area: "Testimonials", where: "Reviews table", what: "Approved reviews render on product pages" },
  { area: "Footer content", where: "components/Footer.tsx", what: "Link columns, contact block, compliance line" },
  { area: "Social links", where: "Settings + Footer", what: "Instagram editable below; others in the footer" },
];

export default function ContentPage() {
  const { push } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setS(d))
      .catch(() => {});
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setS((p) => (p ? { ...p, [k]: v } : p));
    setDirty(true);
  };

  const save = async () => {
    if (!s) return;
    setBusy(true);
    const r = await fetch("/api/admin/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { push(d.error || "Could not save", "danger"); return; }
    setS(d);
    setDirty(false);
    push("Content saved");
  };

  return (
    <>
      <PageHeader
        title="Website content"
        subtitle="What you can edit here, and where the rest lives"
        actions={
          <button type="button" onClick={save} disabled={busy || !dirty || !s} className="adm-btn adm-btn-primary">
            {busy ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        }
      />

      <div className="mb-5">
        <DemoNotice what="There is no CMS table yet, so most storefront copy is edited in code. The two fields below are stored in the settings table and take effect on the live site immediately." />
      </div>

      <div className="grid xl:grid-cols-[1fr_1.2fr] gap-5">
        <div className="space-y-5">
          <Card title="Promotional banner">
            {!s ? (
              <div className="space-y-3"><Sk className="h-5 w-40" /><Sk className="h-10 w-full" /></div>
            ) : (
              <div className="space-y-4">
                <label className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={s.announcement_active} onChange={(e) => set("announcement_active", e.target.checked)} className="accent-ink w-4 h-4" />
                  Show on the site
                </label>
                <div>
                  <label className="adm-field-label" htmlFor="c-ann">Banner text</label>
                  <input id="c-ann" value={s.announcement} onChange={(e) => set("announcement", e.target.value)} className="adm-input" />
                </div>

                <div>
                  <p className="adm-label mb-2">Live preview</p>
                  <div className="rounded-lg overflow-hidden border border-adminline">
                    <div className={`bg-inkdeep px-4 py-2.5 text-center ${s.announcement_active ? "" : "opacity-35"}`}>
                      <span className="text-goldsoft text-[0.68rem] tracking-[0.18em] uppercase">
                        {s.announcement || "Your message here"}
                      </span>
                    </div>
                    <div className="bg-paper px-4 py-3 flex items-center justify-between">
                      <span className="font-display text-sm text-ink">Makheshwari</span>
                      <span className="text-[0.6rem] tracking-[0.18em] uppercase text-ink/50">Shop · Story · Contact</span>
                    </div>
                  </div>
                  {!s.announcement_active && (
                    <p className="adm-hint">Currently hidden — the bar will not render on the storefront.</p>
                  )}
                </div>
              </div>
            )}
          </Card>

          <Card title="Social links">
            {!s ? (
              <Sk className="h-10 w-full" />
            ) : (
              <div>
                <label className="adm-field-label" htmlFor="c-ig">Instagram URL</label>
                <input id="c-ig" value={s.instagram} onChange={(e) => set("instagram", e.target.value)} className="adm-input" />
                <p className="adm-hint">Used in the footer. YouTube, LinkedIn and WhatsApp are still hard-coded in the footer component.</p>
              </div>
            )}
          </Card>
        </div>

        <Card title="Where the rest of the copy lives" bodyClass="">
          <div className="adm-scroll">
            <table className="adm-table min-w-[36rem]">
              <thead>
                <tr><th>Area</th><th>Managed in</th><th>Contents</th></tr>
              </thead>
              <tbody>
                {CONTENT_MAP.map((c) => (
                  <tr key={c.area}>
                    <td className="font-medium text-ink whitespace-nowrap">{c.area}</td>
                    <td>
                      {c.editable ? (
                        <Badge tone="success">Editable here</Badge>
                      ) : (
                        <code className="font-mono text-[0.68rem] text-adminmuted">{c.where}</code>
                      )}
                    </td>
                    <td className="text-adminmuted">{c.what}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Card className="mt-5" title="Turning this into a real CMS">
        <p className="text-sm text-ink/80 leading-relaxed">
          A single <code className="font-mono text-xs">content</code> table keyed by section — hero headline, story
          paragraphs, FAQ entries, footer blurb — plus image uploads through the existing
          <code className="font-mono text-xs"> /api/admin/upload</code> route would make every row above editable
          from this screen with live preview. It is a contained piece of work; the upload plumbing already exists
          for product images.
        </p>
      </Card>
    </>
  );
}
