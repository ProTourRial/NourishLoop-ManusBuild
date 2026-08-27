import { describe, expect, it } from "vitest";
import { listIdeas, recommendIdea } from "../server/nourish-service";

describe("NourishLoop recommendation service", () => {
  it("returns a five-minute option for a short, fresh check-in", () => {
    const recommendation = recommendIdea({
      hunger: "peckish",
      energy: "low",
      time: "five",
      mood: "fresh",
      ingredients: ["apple"],
      dietary: ["vegan", "dairy-free"],
    });

    expect(recommendation.idea.timeMinutes).toBeLessThanOrEqual(5);
    expect(recommendation.idea.dietary).toContain("vegan");
    expect(recommendation.matchReason).toContain("5 minutes");
  });

  it("filters the catalogue by every selected dietary preference", () => {
    const ideas = listIdeas(["vegan", "gluten-free"]);
    expect(ideas.length).toBeGreaterThan(0);
    expect(ideas.every((idea) => idea.dietary.includes("vegan") && idea.dietary.includes("gluten-free"))).toBe(true);
  });
});
