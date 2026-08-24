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
  bulkGrades: {
    eyebrow: "Grades and pricing",
    heading: "Three grades, priced by size.",
    body: "Makhana is graded by the diameter of the popped seed. Larger pops take more raw seed per kilo, which is what moves the rate.",
    g1Size: "12 - 15 mm",
    g1Grade: "4 SUTA HP",
    g1Rate: "570",
    g1Note: "Everyday retail grade",
    g2Size: "15 - 18 mm",
    g2Grade: "5 SUTA HP",
    g2Rate: "930",
    g2Note: "Most requested by distributors",
    g3Size: "19 - 23 mm",
    g3Grade: "6+ Premium",
    g3Rate: "1,230",
    g3Note: "Largest pop, gifting and export",
    moq: "Minimum order 100 kg",
    disclaimer: "Indicative rates, exclusive of GST and freight. Final pricing depends on order volume, packing specification and prevailing market rates.",
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
  bulkGrades: {
    label: "Bulk grades and pricing",
    fields: {
      eyebrow: { label: "Eyebrow" },
      heading: { label: "Heading" },
      body: { label: "Intro", multiline: true },
      g1Size: { label: "Grade 1 - size" },
      g1Grade: { label: "Grade 1 - grade" },
      g1Rate: { label: "Grade 1 - rate per kg" },
      g1Note: { label: "Grade 1 - note" },
      g2Size: { label: "Grade 2 - size" },
      g2Grade: { label: "Grade 2 - grade" },
      g2Rate: { label: "Grade 2 - rate per kg" },
      g2Note: { label: "Grade 2 - note" },
      g3Size: { label: "Grade 3 - size" },
      g3Grade: { label: "Grade 3 - grade" },
      g3Rate: { label: "Grade 3 - rate per kg" },
      g3Note: { label: "Grade 3 - note" },
      moq: { label: "Minimum order line" },
      disclaimer: { label: "Pricing disclaimer", multiline: true },
    },
  },
};

