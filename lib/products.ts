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
  /**
   * Transcribed from the printed pack panel, which is the declaration of
   * record. Do not add rows the pack does not declare, and do not copy one
   * product's figures to another — oil and seasoning load differ per flavour,
   * so sodium and fat differ with them.
   *
   * An empty array means "no panel published for this product yet"; the
   * product page omits the section entirely rather than showing blanks.
   */
  nutrition: { label: string; value: string }[];
  /** The wording printed above the pack's own panel, shown verbatim. */
  nutritionBasis?: string;
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
    // Transcribed from the printed 60 g pack, in the declared order. The
    // previous four-item list omitted maltodextrin, sugar, the acidity
    // regulators and the flavour enhancers — the things people actually
    // check a label for.
    //
    // The anti-caking agent's INS number is cut off in the pack photo
    // ("Anti-Caking Agent IN…"), so it is declared without a number rather
    // than guessed at. Add it once the full pack text is to hand.
    ingredients:
      "Panchamrit (makhana), sunflower oil, maltodextrin powder, salt, sugar, dehydrated vegetables (onion, garlic), spices & condiments (chilli, pepper), mango powder, vegetable oil (refined soybean), acidifying agents (INS 330, INS 296), flavour enhancers (INS 627, INS 631), anti-caking agent.",
    allergens: "Packed in a facility that also handles nuts and milk products.",
    shelfLifeMonths: "6-8 months from date of packing",
    storage: "Store in a cool, dry place away from direct sunlight. Reseal after opening.",
    nutrition: [
      { label: "Energy", value: "452 kcal" },
      { label: "Protein", value: "9.0 g" },
      { label: "Carbohydrate", value: "64.5 g" },
      { label: "of which sugars", value: "0.9 g" },
      { label: "Total dietary fibre", value: "6.8 g" },
      { label: "Fat", value: "16.4 g" },
      { label: "Sodium", value: "810 mg" },
      { label: "Iron", value: "1.6 mg" },
      { label: "Magnesium", value: "90 mg" },
      { label: "Calcium", value: "55 mg" },
    ],
    nutritionBasis: "Approximate values per 100 g of makhana on roasted basis",
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
    // No panel transcribed for this flavour yet. Peri Peri's figures are not
    // reused here: this pack carries a different seasoning and oil load, so
    // its sodium and fat will not match. The section stays hidden until the
    // printed panel for this pack is entered.
    nutrition: [],
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
    // No panel transcribed for this flavour yet. Peri Peri's figures are not
    // reused here: this pack carries a different seasoning and oil load, so
    // its sodium and fat will not match. The section stays hidden until the
    // printed panel for this pack is entered.
    nutrition: [],
    images: [],
    inStock: true,
  },
];

export const accentClass: Record<Product["accent"], string> = {
  peri: "bg-peri",
  mint: "bg-mint",
  salt: "bg-salt",
};

/**
 * Accent text colours. The packaging colours themselves are all under
 * 4.5:1 on cream (peri 3.95, mint 2.65, salt 2.30), so these darkened
 * partners are what carries body-size text.
 */
/**
 * Very light wash behind the product shot. The three pouches photograph
 * near-identically on white, so at phone size the cards were hard to tell
 * apart; this carries the flavour colour without competing with the pack.
 */
export const accentTint: Record<Product["accent"], string> = {
  peri: "bg-peri/[0.14]",
  mint: "bg-mint/[0.18]",
  salt: "bg-salt/[0.16]",
};

export const accentTextDeep: Record<Product["accent"], string> = {
  peri: "text-perideep",
  mint: "text-mintdeep",
  salt: "text-saltdeep",
};

export function formatPrice(v: number | null) {
  if (v === null) return "\u20B9—";
  return "\u20B9" + v.toLocaleString("en-IN");
}
