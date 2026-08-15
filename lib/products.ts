export type Product = {
  slug: string;
  name: string;
  hook: string;
  accent: "peri" | "mint" | "salt";
  weightG: number;
  price: number | null;
  mrp: number | null;
  description: string;
  ingredients: string;
  allergens: string;
  shelfLifeMonths: string;
  storage: string;
  nutrition: { label: string; value: string }[];
  images: string[];
  inStock: boolean;
};

export const FSSAI = "10426330000072";
export const GSTIN = "10ERSPK0044M2ZP";
export const LEGAL_ENTITY = "Sonu Enterprises";
export const ADDRESS = "Samastipur, Bihar";
export const EMAIL = "makheshwarimakhana@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/makheshwari_makhana/";
export const FREE_SHIPPING_OVER = 499;

export const products: Product[] = [
  {
    slug: "peri-peri",
    name: "Peri Peri",
    hook: "Loud. Unapologetic. Bring water.",
    accent: "peri",
    weightG: 60,
    price: 149,
    mrp: 179,
    description:
      "Whole makhana roasted until it snaps, then tumbled in a chilli and herb blend that builds slowly and then doesn't stop. Our most-ordered flavour, and the one people buy in threes.",
    ingredients: "Makhana (fox nut), edible vegetable oil, peri peri seasoning, iodised salt.",
    allergens: "Packed in a facility that also handles nuts and milk products.",
    shelfLifeMonths: "6-8 months from date of packing",
    storage: "Store in a cool, dry place away from direct sunlight. Reseal after opening.",
    nutrition: [
      { label: "Energy", value: "— kcal" },
      { label: "Protein", value: "— g" },
      { label: "Carbohydrate", value: "— g" },
      { label: "of which sugars", value: "— g" },
      { label: "Total fat", value: "— g" },
      { label: "Sodium", value: "— mg" },
    ],
    images: [],
    inStock: true,
  },
  {
    slug: "garden-mint",
    name: "Garden Mint",
    hook: "Cold, sharp, oddly refreshing.",
    accent: "mint",
    weightG: 100,
    price: 199,
    mrp: 239,
    description:
      "Roasted makhana with a clean mint and herb seasoning. Lighter than the peri peri and easier to keep eating, which is either a feature or a problem depending on your afternoon.",
    ingredients: "Makhana (fox nut), edible vegetable oil, mint seasoning, iodised salt.",
    allergens: "Packed in a facility that also handles nuts and milk products.",
    shelfLifeMonths: "6-8 months from date of packing",
    storage: "Store in a cool, dry place away from direct sunlight. Reseal after opening.",
    nutrition: [
      { label: "Energy", value: "— kcal" },
      { label: "Protein", value: "— g" },
      { label: "Carbohydrate", value: "— g" },
      { label: "of which sugars", value: "— g" },
      { label: "Total fat", value: "— g" },
      { label: "Sodium", value: "— mg" },
    ],
    images: [],
    inStock: true,
  },
  {
    slug: "himalayan-pink-salt",
    name: "Himalayan Pink Salt",
    hook: "The one you finish without noticing.",
    accent: "salt",
    weightG: 150,
    price: 259,
    mrp: 299,
    description:
      "Just makhana, a little oil and Himalayan pink salt. Nothing to hide behind, which is why it's the one that shows whether the roast was done properly.",
    ingredients: "Makhana (fox nut), edible vegetable oil, Himalayan pink salt.",
    allergens: "Packed in a facility that also handles nuts and milk products.",
    shelfLifeMonths: "6-8 months from date of packing",
    storage: "Store in a cool, dry place away from direct sunlight. Reseal after opening.",
    nutrition: [
      { label: "Energy", value: "— kcal" },
      { label: "Protein", value: "— g" },
      { label: "Carbohydrate", value: "— g" },
      { label: "of which sugars", value: "— g" },
      { label: "Total fat", value: "— g" },
      { label: "Sodium", value: "— mg" },
    ],
    images: [],
    inStock: true,
  },
];

export const accentClass: Record<Product["accent"], string> = {
  peri: "bg-peri",
  mint: "bg-mint",
  salt: "bg-salt",
};

/** Bright accents — for fills, bars, and text on DARK backgrounds only. */
export const accentText: Record<Product["accent"], string> = {
  peri: "text-peri",
  mint: "text-mint",
  salt: "text-salt",
};

/**
 * Darkened partners for accent text on LIGHT backgrounds. The packaging
 * colours are all under 4.5:1 on cream (peri 3.95, mint 2.65, salt 2.30),
 * so they cannot carry body-size text there.
 */
export const accentTextDeep: Record<Product["accent"], string> = {
  peri: "text-perideep",
  mint: "text-mintdeep",
  salt: "text-saltdeep",
};

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function formatPrice(v: number | null) {
  if (v === null) return "\u20B9—";
  return "\u20B9" + v.toLocaleString("en-IN");
}
