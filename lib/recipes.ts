export type Recipe = {
  slug: string;
  name: string;
  blurb: string;
  time: string;
  serves: string;
  difficulty: string;
  accent: "peri" | "mint" | "salt";
  intro: string;
  uses: string;
  ingredients: { group: string; items: string[] }[];
  steps: { t: string; b: string }[];
  tips: string[];
};

export const recipes: Recipe[] = [
  {
    slug: "makhana-kheer",
    name: "Makhana kheer",
    blurb: "Slow simmered in milk with cardamom and jaggery. The Kojagara classic.",
    time: "30 min",
    serves: "4",
    difficulty: "Easy",
    accent: "salt",
    intro: "In Mithila this is not a dessert you make on a whim. It is what appears at Kojagara, when the full moon comes and makhana is handed round in every house. Milk reduced slowly, makhana softening into it, cardamom and a little jaggery. Nothing clever, and it does not need to be.",
    uses: "Himalayan Pink Salt or raw makhana",
    ingredients: [
      { group: "Base", items: ["1 litre full fat milk", "60 g makhana", "1 tbsp ghee"] },
      { group: "Sweet and spice", items: ["80 g jaggery or 4 tbsp sugar", "4 green cardamom pods, crushed", "A pinch of saffron, optional"] },
      { group: "To finish", items: ["10 pistachios, slivered", "10 almonds, slivered"] },
    ],
    steps: [
      { t: "Toast the makhana", b: "Warm the ghee in a heavy pan. Add the makhana and toast on low for 4 to 5 minutes until it feels crisp and smells nutty. Take half out and crush it roughly, leave the rest whole." },
      { t: "Reduce the milk", b: "In the same pan bring the milk to a boil, then drop to a simmer. Let it reduce for about 10 minutes, scraping the sides back in as it thickens." },
      { t: "Add the makhana", b: "Stir in both the whole and crushed makhana. Simmer another 10 to 12 minutes. The crushed pieces dissolve and thicken the kheer, the whole ones stay soft and bouncy." },
      { t: "Sweeten off the heat", b: "Take the pan off the heat before adding jaggery, or the milk will split. Stir until dissolved, then add cardamom and saffron." },
      { t: "Rest and serve", b: "Leave it 10 minutes. It thickens as it sits. Top with pistachios and almonds. Warm in winter, chilled in summer, both correct." },
    ],
    tips: [
      "Jaggery must go in off the heat. Sugar can go in while simmering.",
      "Crushing half the makhana is the whole trick. It thickens without cornflour.",
      "Leftovers keep 2 days refrigerated and thicken further. Loosen with warm milk.",
    ],
  },
  {
    slug: "makhana-chaat",
    name: "Makhana chaat",
    blurb: "Roasted, then tossed with onion, tomato, lemon and chaat masala.",
    time: "10 min",
    serves: "2",
    difficulty: "Very easy",
    accent: "peri",
    intro: "The fastest thing you can do with makhana that is not simply eating it from the pouch. Everything raw and cold against something warm and crisp, assembled at the last second so nothing goes soft. Ten minutes, most of which is chopping.",
    uses: "Peri Peri or Himalayan Pink Salt",
    ingredients: [
      { group: "The base", items: ["100 g makhana", "1 tsp ghee or oil"] },
      { group: "The chaat", items: ["1 small onion, finely chopped", "1 small tomato, deseeded and chopped", "1 green chilli, minced", "A handful of coriander, chopped", "Juice of half a lemon"] },
      { group: "Seasoning", items: ["1 tsp chaat masala", "Half tsp roasted cumin powder", "Salt to taste", "Sev, to finish"] },
    ],
    steps: [
      { t: "Crisp the makhana", b: "Warm the ghee in a pan and toast the makhana on low for 5 minutes, moving it constantly. It should snap when you press it. Tip onto a plate to cool." },
      { t: "Prep everything else", b: "Chop the onion, tomato, chilli and coriander while the makhana cools. Deseed the tomato or the chaat turns wet." },
      { t: "Season", b: "In a large bowl toss the vegetables with chaat masala, cumin, salt and lemon juice." },
      { t: "Combine last", b: "Add the makhana and toss twice, no more. Top with sev and eat straight away. It stays crisp for about five minutes, which is the point." },
    ],
    tips: [
      "Use Peri Peri and you can skip the chilli entirely.",
      "Never mix ahead. Prep the vegetables, keep the makhana separate, combine at the table.",
      "A spoon of pomegranate is not traditional but it is very good.",
    ],
  },
  {
    slug: "makhana-curry",
    name: "Makhana in curry",
    blurb: "Dropped into a tomato gravy at the end so it stays crisp.",
    time: "25 min",
    serves: "3",
    difficulty: "Medium",
    accent: "mint",
    intro: "Makhana behaves in gravy the way paneer does, except lighter and it does not go rubbery. The one rule is timing. Add it early and you get mush. Add it in the last two minutes and you get soft outside, still with a little bite inside.",
    uses: "Raw or Himalayan Pink Salt makhana",
    ingredients: [
      { group: "Makhana", items: ["100 g makhana", "1 tbsp ghee"] },
      { group: "Gravy", items: ["2 onions, finely chopped", "3 tomatoes, pureed", "1 tbsp ginger garlic paste", "2 tbsp cashews, soaked and ground"] },
      { group: "Spices", items: ["1 tsp cumin seeds", "Half tsp turmeric", "1 tsp coriander powder", "1 tsp red chilli powder", "Half tsp garam masala", "Salt to taste"] },
      { group: "To finish", items: ["2 tbsp cream or thick curd", "A handful of coriander"] },
    ],
    steps: [
      { t: "Toast and set aside", b: "Warm the ghee, toast the makhana on low for 5 minutes until crisp, and take it out of the pan. Do not let it sit in the gravy while you cook." },
      { t: "Build the base", b: "Same pan, cumin seeds until they crackle, then onions until properly golden. This takes 8 minutes and rushing it is the most common mistake." },
      { t: "Spices and tomato", b: "Ginger garlic paste for a minute, then turmeric, coriander and chilli powder. Pour in the tomato puree and cook until the oil separates at the edges." },
      { t: "Thicken", b: "Stir in the ground cashews and about half a cup of water. Simmer 5 minutes until it coats a spoon." },
      { t: "Makhana last", b: "Add the makhana, stir once, cook 2 minutes only. Off the heat, stir in cream and garam masala, scatter coriander. Serve immediately with roti." },
    ],
    tips: [
      "Two minutes. Any longer and the texture is gone.",
      "Cashew paste is what makes it taste restaurant made. Do not skip it.",
      "This does not reheat well. Make the gravy ahead, add makhana when serving.",
    ],
  },
];

export function getRecipe(slug: string) {
  return recipes.find((r) => r.slug === slug);
}