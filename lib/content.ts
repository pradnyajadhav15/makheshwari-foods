import { supabaseAdmin } from "@/lib/supabase";

/**
 * Editable storefront copy, backed by the `content` table.
 *
 * Every getter falls back to the defaults below, so the site renders
 * identically whether or not supabase/03_content.sql has been run. That
 * matters because the code and the migration deploy separately — the
 * storefront must not break in the window between them.
 */

export type ContentBlock = Record<string, string>;

export const CONTENT_DEFAULTS: Record<string, ContentBlock> = {
  hero: {
    eyebrow: "Pond-grown in Samastipur, Bihar",
    heading: "Roasted where\nit grows.",
    body: "Whole makhana from the ponds of the Mithila belt. Hot-air roasted, never fried, and sealed the day it is packed.",
    ctaLabel: "Shop the range",
    ctaHref: "/shop",
    altLabel: "Know your makhana",
    altHref: "/know-your-makhana",
    footnote: "FSSAI licensed · Free shipping over ₹499",
  },
  origin: {
    eyebrow: "Know your makhana",
    heading: "It begins waist-deep in water.",
    body: "Makhana does not grow on a plant you can walk up to. It grows underwater, on a prickly water lily rooted in the pond bed, and every seed is brought up by hand.",
    body2: "We buy from those ponds, roast in Samastipur, and seal the same day.",
  },
  purity: {
    eyebrow: "Raw and natural",
    heading: "Pure, natural,\nand nothing else.",
    body: "Sourced from the ponds of the Mithila belt and sorted by hand for size and colour. No additives, no preservatives, and nothing to hide behind.",
  },
  bulk: {
    eyebrow: "Bulk & reseller",
    heading: "Buying by the carton?",
    body: "We supply retailers, distributors and corporate gifting direct from our Samastipur unit, with GST invoicing and custom pack sizes.",
  },
  footer: {
    heading: "Roasted where it grows.",
    body: "Whole makhana from the ponds of the Mithila belt, hot-air roasted in small batches in Samastipur and sealed the day it is packed.",
  },
};

/** Human labels for the admin editor, and which fields are long-form. */
export const CONTENT_SCHEMA: Record<string, { label: string; fields: Record<string, { label: string; multiline?: boolean }> }> = {
  hero: {
    label: "Homepage hero",
    fields: {
      eyebrow: { label: "Eyebrow" },
      heading: { label: "Headline", multiline: true },
      body: { label: "Sub-copy", multiline: true },
      ctaLabel: { label: "Primary button" },
      ctaHref: { label: "Primary link" },
      altLabel: { label: "Secondary button" },
      altHref: { label: "Secondary link" },
      footnote: { label: "Footnote" },
    },
  },
  origin: {
    label: "Origin section",
    fields: {
      eyebrow: { label: "Eyebrow" },
      heading: { label: "Heading", multiline: true },
      body: { label: "Paragraph one", multiline: true },
      body2: { label: "Paragraph two", multiline: true },
    },
  },
  purity: {
    label: "Purity section",
    fields: {
      eyebrow: { label: "Eyebrow" },
      heading: { label: "Heading", multiline: true },
      body: { label: "Body", multiline: true },
    },
  },
  bulk: {
    label: "Bulk callout",
    fields: {
      eyebrow: { label: "Eyebrow" },
      heading: { label: "Heading" },
      body: { label: "Body", multiline: true },
    },
  },
  footer: {
    label: "Footer masthead",
    fields: {
      heading: { label: "Heading" },
      body: { label: "Body", multiline: true },
    },
  },
};

export async function getContent(): Promise<Record<string, ContentBlock>> {
  try {
    const { data, error } = await supabaseAdmin.from("content").select("key,value");
    if (error || !data) return CONTENT_DEFAULTS;

    const out: Record<string, ContentBlock> = {};
    for (const key of Object.keys(CONTENT_DEFAULTS)) {
      const row = data.find((r) => r.key === key);
      // Merge over defaults so a partially-filled row never loses fields.
      out[key] = { ...CONTENT_DEFAULTS[key], ...((row?.value as ContentBlock) || {}) };
    }
    return out;
  } catch {
    return CONTENT_DEFAULTS;
  }
}

export async function getBlock(key: string): Promise<ContentBlock> {
  const all = await getContent();
  return all[key] ?? CONTENT_DEFAULTS[key] ?? {};
}
