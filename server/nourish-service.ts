import { nourishIdeas } from "../shared/nourish-dataset";
import type { AllergenPreference, NourishCheckIn, NourishIdea, NourishRecommendation, NourishWeeklyPlan, ShoppingListItem } from "../shared/nourish";

const timeBudget: Record<NourishCheckIn["time"], number> = { five: 5, fifteen: 15, thirty: 30 };
const dayLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const allergenTerms: Record<AllergenPreference, string[]> = {
  nuts: ["nut", "peanut"],
  eggs: ["egg"],
  dairy: ["yogurt", "cheese", "cottage"],
  soy: ["soy", "tofu", "edamame", "tamari"],
  gluten: ["bread", "toast", "noodle", "pita", "tortilla", "granola", "oat", "cracker"],
  sesame: ["sesame", "tahini"],
};

function overlapScore<T>(source: T[], chosen: T[]): number {
  return chosen.filter((value) => source.includes(value)).length;
}

function ideaText(idea: NourishIdea): string {
  return [...idea.components.map((component) => component.item), ...idea.substitutions, ...idea.tags].join(" ").toLowerCase();
}

function matchesAvoidance(idea: NourishIdea, checkIn: NourishCheckIn): boolean {
  const text = ideaText(idea);
  const allergenMatch = (checkIn.allergens ?? []).some((allergen) => allergenTerms[allergen].some((term) => text.includes(term)));
  const avoidedIngredientMatch = (checkIn.avoidIngredients ?? []).some((item) => item.trim().length > 0 && text.includes(item.toLowerCase()));
  return allergenMatch || avoidedIngredientMatch;
}

function createConstraintFirstFallback(checkIn: NourishCheckIn): NourishIdea {
  return {
    id: "constraint-first-flexible-plate",
    title: "A familiar flexible plate",
    subtitle: "A build-your-own idea for when the catalogue needs to make more room for your boundaries.",
    timeMinutes: timeBudget[checkIn.time],
    moods: [checkIn.mood],
    energyFit: [checkIn.energy],
    hungerFit: [checkIn.hunger],
    dietary: checkIn.dietary,
    tags: ["Flexible", "Check labels", "Use what works"],
    components: [
      { role: "Base", item: "A familiar base that works for you" },
      { role: "Protein", item: "A familiar protein that works for you" },
      { role: "Produce", item: "Any fruit or vegetable you feel good about" },
      { role: "Flavor", item: "A label-checked sauce, seasoning, or topping" },
    ],
    steps: ["Choose a base and protein you know feel workable.", "Add a fruit or vegetable if it is available and appealing.", "Check labels and preparation surfaces before adding any flavour or topping."],
    substitutions: ["Use a familiar pantry or freezer alternative.", "Keep the components separate if that makes the choice simpler today."],
    encouragement: "Your boundaries matter. A familiar choice can be the most supportive place to start.",
  };
}

function scoreIdea(idea: NourishIdea, checkIn: NourishCheckIn): number {
  const timeScore = idea.timeMinutes <= timeBudget[checkIn.time] ? 5 : Math.max(0, 3 - Math.ceil((idea.timeMinutes - timeBudget[checkIn.time]) / 10));
  const moodScore = overlapScore(idea.moods, [checkIn.mood]) * 4;
  const hungerScore = overlapScore(idea.hungerFit, [checkIn.hunger]) * 3;
  const energyScore = overlapScore(idea.energyFit, [checkIn.energy]) * 2;
  const dietaryScore = checkIn.dietary.length === 0 || checkIn.dietary.every((preference) => idea.dietary.includes(preference)) ? 3 : -10;
  const ingredientScore = idea.components.filter((component) => checkIn.ingredients.some((ingredient) => component.item.toLowerCase().includes(ingredient.toLowerCase()))).length;
  const pantryScore = checkIn.budget === "pantry-first" && idea.tags.some((tag) => tag === "Pantry-friendly" || tag === "Leftovers") ? 4 : 0;
  const budgetScore = checkIn.budget === "budget-conscious" && (idea.tags.includes("Pantry-friendly") || idea.tags.includes("Batch-friendly")) ? 3 : 0;
  return timeScore + moodScore + hungerScore + energyScore + dietaryScore + ingredientScore + pantryScore + budgetScore;
}

function rankedIdeas(checkIn: NourishCheckIn): NourishIdea[] {
  const dietaryCandidates = nourishIdeas.filter((idea) => checkIn.dietary.length === 0 || checkIn.dietary.every((preference) => idea.dietary.includes(preference)));
  const compatibleCandidates = dietaryCandidates.filter((idea) => !matchesAvoidance(idea, checkIn));
  const candidates = compatibleCandidates.length > 0 ? compatibleCandidates : [createConstraintFirstFallback(checkIn)];
  return candidates
    .map((idea) => ({ idea, score: scoreIdea(idea, checkIn) }))
    .sort((left, right) => right.score - left.score || left.idea.title.localeCompare(right.idea.title))
    .map(({ idea }) => idea);
}

export function listIdeas(dietary: NourishCheckIn["dietary"] = []) {
  return nourishIdeas.filter((idea) => dietary.length === 0 || dietary.every((preference) => idea.dietary.includes(preference)));
}

export function recommendIdea(checkIn: NourishCheckIn): NourishRecommendation {
  const ranked = rankedIdeas(checkIn);
  const idea = ranked[0] ?? nourishIdeas[0];
  const ingredientMention = checkIn.ingredients.length > 0 ? ` You mentioned ${checkIn.ingredients.slice(0, 2).join(" and ")}, so make any easy swap that keeps this workable.` : " Use what is easiest to reach today; the substitutions are part of the plan.";
  const constraintMention = (checkIn.allergens?.length ?? 0) + (checkIn.avoidIngredients?.length ?? 0) > 0 ? " I also kept your ingredient considerations in mind; please still check labels and preparation surfaces yourself." : "";
  return {
    idea,
    matchReason: `This fits a ${checkIn.mood} mood with about ${timeBudget[checkIn.time]} minutes available.${ingredientMention}${constraintMention}`,
    gentleNudge: checkIn.hunger === "very-hungry" ? "Start with the part you can assemble first. You can add the rest as you go." : "You do not need to earn a meal. Let this be one small helpful decision.",
  };
}

export function buildWeeklyPlan(checkIn: NourishCheckIn): NourishWeeklyPlan {
  const ranked = rankedIdeas(checkIn);
  const selected = ranked.slice(0, Math.min(5, Math.max(3, ranked.length)));
  const days = selected.map((idea, index) => ({
    day: dayLabels[index],
    idea,
    swaps: ranked.filter((candidate) => candidate.id !== idea.id && !selected.slice(0, index).some((chosen) => chosen.id === candidate.id)).slice(0, 3),
  }));
  const budgetCopy = checkIn.budget === "pantry-first" ? "Built around pantry-friendly options and easy swaps." : checkIn.budget === "budget-conscious" ? "Practical ideas with flexible ingredients and repeatable staples." : "A flexible set of ideas that can shift with your week.";
  return { title: "A flexible week", subtitle: `${budgetCopy} Nothing here is fixed—swap anything that no longer fits.`, days };
}

function categoryForRole(role: string): ShoppingListItem["category"] {
  const normalized = role.toLowerCase();
  if (normalized.includes("protein") || normalized.includes("pairing")) return "protein";
  if (normalized.includes("vegetable") || normalized.includes("fruit") || normalized.includes("green") || normalized.includes("color")) return "produce";
  if (normalized.includes("sauce") || normalized.includes("flavor") || normalized.includes("warmth") || normalized.includes("brightener")) return "flavor";
  if (normalized.includes("base") || normalized.includes("wrap")) return "base";
  return "extras";
}

function primaryItemName(item: string): string {
  return item.split(/\s+(?:or|and)\s+|,/i)[0].trim();
}

function alternativeItems(item: string, role: string): string[] {
  const embedded = item.split(/\s+or\s+/i).slice(1).map((entry) => entry.trim()).filter(Boolean);
  const roleAlternatives: Partial<Record<ShoppingListItem["category"], string[]>> = {
    base: ["Any bread, rice, noodles, or grain you already enjoy"],
    protein: ["Beans, lentils, tofu, eggs, or another familiar protein"],
    produce: ["Fresh, frozen, or canned produce that is easy to use"],
    flavor: ["A favorite sauce, citrus, herbs, or pantry seasoning"],
    extras: ["Any optional topping that adds comfort or crunch"],
  };
  return [...embedded, ...(roleAlternatives[categoryForRole(role)] ?? [])].slice(0, 2);
}

export function buildShoppingList(ideaIds: string[]): ShoppingListItem[] {
  const uniqueIdeas = Array.from(new Set(ideaIds)).map((id) => nourishIdeas.find((idea) => idea.id === id)).filter((idea): idea is NourishIdea => Boolean(idea));
  const items = new Map<string, ShoppingListItem>();
  for (const idea of uniqueIdeas) {
    for (const component of idea.components) {
      const name = primaryItemName(component.item);
      const key = name.toLowerCase();
      const current = items.get(key);
      if (current) {
        current.sourceIdeaIds = [...new Set([...current.sourceIdeaIds, idea.id])];
      } else {
        items.set(key, { id: key.replace(/[^a-z0-9]+/g, "-"), name, category: categoryForRole(component.role), alternatives: alternativeItems(component.item, component.role), sourceIdeaIds: [idea.id] });
      }
    }
  }
  return [...items.values()].sort((left, right) => left.category.localeCompare(right.category) || left.name.localeCompare(right.name));
}
