export const dietaryOptions = ["vegetarian", "vegan", "dairy-free", "gluten-free"] as const;
export const hungerOptions = ["peckish", "ready", "very-hungry"] as const;
export const energyOptions = ["low", "steady", "bright"] as const;
export const timeOptions = ["five", "fifteen", "thirty"] as const;
export const foodMoodOptions = ["warm", "fresh", "crunchy", "comfort"] as const;
export const allergenOptions = ["nuts", "eggs", "dairy", "soy", "gluten", "sesame"] as const;
export const budgetOptions = ["flexible", "pantry-first", "budget-conscious"] as const;

export type DietaryOption = (typeof dietaryOptions)[number];
export type HungerLevel = (typeof hungerOptions)[number];
export type EnergyLevel = (typeof energyOptions)[number];
export type TimeWindow = (typeof timeOptions)[number];
export type FoodMood = (typeof foodMoodOptions)[number];
export type AllergenPreference = (typeof allergenOptions)[number];
export type BudgetPreference = (typeof budgetOptions)[number];

export type NourishCheckIn = {
  hunger: HungerLevel;
  energy: EnergyLevel;
  time: TimeWindow;
  mood: FoodMood;
  ingredients: string[];
  dietary: DietaryOption[];
  allergens?: AllergenPreference[];
  avoidIngredients?: string[];
  budget?: BudgetPreference;
};

export type MealComponent = {
  role: string;
  item: string;
};

export type NourishIdea = {
  id: string;
  title: string;
  subtitle: string;
  timeMinutes: number;
  moods: FoodMood[];
  energyFit: EnergyLevel[];
  hungerFit: HungerLevel[];
  dietary: DietaryOption[];
  tags: string[];
  components: MealComponent[];
  steps: string[];
  substitutions: string[];
  encouragement: string;
};

export type NourishRecommendation = {
  idea: NourishIdea;
  matchReason: string;
  gentleNudge: string;
};

export type WeeklyPlanDay = {
  day: string;
  idea: NourishIdea;
  swaps: NourishIdea[];
};

export type NourishWeeklyPlan = {
  title: string;
  subtitle: string;
  days: WeeklyPlanDay[];
};

export type ShoppingListItem = {
  id: string;
  name: string;
  category: "base" | "protein" | "produce" | "flavor" | "extras";
  alternatives: string[];
  sourceIdeaIds: string[];
};
