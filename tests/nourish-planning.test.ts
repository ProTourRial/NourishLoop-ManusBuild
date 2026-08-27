import { describe, expect, it } from "vitest";
import { buildShoppingList, buildWeeklyPlan, recommendIdea } from "../server/nourish-service";
import type { NourishCheckIn } from "../shared/nourish";

const baseCheckIn: NourishCheckIn = {
  hunger: "ready",
  energy: "steady",
  time: "fifteen",
  mood: "warm",
  ingredients: ["Rice", "Beans"],
  dietary: [],
  allergens: [],
  avoidIngredients: [],
  budget: "pantry-first",
};

describe("NourishLoop planning services", () => {
  it("builds a non-repeating flexible plan of three to five practical ideas", () => {
    const plan = buildWeeklyPlan(baseCheckIn);
    expect(plan.days.length).toBeGreaterThanOrEqual(3);
    expect(plan.days.length).toBeLessThanOrEqual(5);
    expect(new Set(plan.days.map((day) => day.idea.id)).size).toBe(plan.days.length);
    expect(plan.days.every((day) => day.swaps.every((swap) => swap.id !== day.idea.id))).toBe(true);
  });

  it("combines meal components into a shopping list with useful alternatives", () => {
    const plan = buildWeeklyPlan(baseCheckIn);
    const list = buildShoppingList(plan.days.map((day) => day.idea.id));
    expect(list.length).toBeGreaterThan(0);
    expect(list.some((item) => item.sourceIdeaIds.length > 0)).toBe(true);
    expect(list.every((item) => item.alternatives.length > 0)).toBe(true);
  });

  it("keeps a personal avoid-list out of the top recommendation when alternatives exist", () => {
    const recommendation = recommendIdea({ ...baseCheckIn, avoidIngredients: ["lentils"] });
    expect(recommendation.idea.id).not.toBe("golden-lentil-soup");
  });

  it("returns a boundary-first fallback rather than a conflicting catalogue idea", () => {
    const recommendation = recommendIdea({ ...baseCheckIn, allergens: ["nuts", "eggs", "dairy", "soy", "gluten", "sesame"] });
    expect(recommendation.idea.id).toBe("constraint-first-flexible-plate");
    expect(recommendation.idea.encouragement).toContain("boundaries matter");
  });
});
