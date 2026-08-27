import { nourishIdeas } from "../shared/nourish-dataset";
import type { NourishCheckIn, NourishIdea, NourishRecommendation } from "../shared/nourish";

const timeBudget: Record<NourishCheckIn["time"], number> = { five: 5, fifteen: 15, thirty: 30 };

function overlapScore<T>(source: T[], chosen: T[]): number {
  return chosen.filter((value) => source.includes(value)).length;
}

function scoreIdea(idea: NourishIdea, checkIn: NourishCheckIn): number {
  const timeScore = idea.timeMinutes <= timeBudget[checkIn.time] ? 5 : Math.max(0, 3 - Math.ceil((idea.timeMinutes - timeBudget[checkIn.time]) / 10));
  const moodScore = overlapScore(idea.moods, [checkIn.mood]) * 4;
  const hungerScore = overlapScore(idea.hungerFit, [checkIn.hunger]) * 3;
  const energyScore = overlapScore(idea.energyFit, [checkIn.energy]) * 2;
  const dietaryScore = checkIn.dietary.length === 0 || checkIn.dietary.every((preference) => idea.dietary.includes(preference)) ? 3 : -10;
  const ingredientScore = idea.components.filter((component) =>
    checkIn.ingredients.some((ingredient) => component.item.toLowerCase().includes(ingredient.toLowerCase())),
  ).length;
  return timeScore + moodScore + hungerScore + energyScore + dietaryScore + ingredientScore;
}

export function listIdeas(dietary: NourishCheckIn["dietary"] = []) {
  return nourishIdeas.filter((idea) => dietary.length === 0 || dietary.every((preference) => idea.dietary.includes(preference)));
}

export function recommendIdea(checkIn: NourishCheckIn): NourishRecommendation {
  const candidates = listIdeas(checkIn.dietary);
  const ranked = (candidates.length > 0 ? candidates : nourishIdeas)
    .map((idea) => ({ idea, score: scoreIdea(idea, checkIn) }))
    .sort((left, right) => right.score - left.score || left.idea.title.localeCompare(right.idea.title));
  const idea = ranked[0].idea;
  const ingredientMention = checkIn.ingredients.length > 0 ? ` You mentioned ${checkIn.ingredients.slice(0, 2).join(" and ")}, so make any easy swap that keeps this workable.` : " Use what is easiest to reach today; the substitutions are part of the plan.";
  return {
    idea,
    matchReason: `This fits a ${checkIn.mood} mood with about ${timeBudget[checkIn.time]} minutes available.${ingredientMention}`,
    gentleNudge: checkIn.hunger === "very-hungry" ? "Start with the part you can assemble first. You can add the rest as you go." : "You do not need to earn a meal. Let this be one small helpful decision.",
  };
}
