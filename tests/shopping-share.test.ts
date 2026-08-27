import { describe, expect, it } from "vitest";
import { formatShoppingListForShare } from "../shared/shopping-share";
import type { ShoppingListItem } from "../shared/nourish";

const items: ShoppingListItem[] = [
  { id: "beans", name: "White beans", category: "protein", alternatives: ["Chickpeas", "Lentils"], sourceIdeaIds: ["tomato-bean-scoop"] },
  { id: "rice", name: "Rice", category: "base", alternatives: ["Noodles"], sourceIdeaIds: ["weeknight-rice-skillet", "sesame-noodle-cup"] },
];

describe("shopping-list sharing", () => {
  it("formats a grouped, checkable list with alternatives", () => {
    const text = formatShoppingListForShare(items, { beans: true });
    expect(text).toContain("NourishLoop shopping list");
    expect(text).toContain("Bases\n☐ Rice");
    expect(text).toContain("Proteins & pairings\n✓ White beans");
    expect(text).toContain("Instead: Chickpeas · Lentils");
  });
});
