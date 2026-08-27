import type { ShoppingListItem } from "./nourish";

const categoryLabels: Record<ShoppingListItem["category"], string> = {
  base: "Bases",
  protein: "Proteins & pairings",
  produce: "Produce",
  flavor: "Flavor makers",
  extras: "Optional extras",
};

export function formatShoppingListForShare(items: ShoppingListItem[], checked: Record<string, boolean>): string {
  const grouped = items.reduce<Record<ShoppingListItem["category"], ShoppingListItem[]>>((groups, item) => {
    groups[item.category].push(item);
    return groups;
  }, { base: [], protein: [], produce: [], flavor: [], extras: [] });
  const body = (Object.keys(categoryLabels) as ShoppingListItem["category"][])
    .filter((category) => grouped[category].length > 0)
    .map((category) => {
      const entries = grouped[category].map((item) => {
        const mark = checked[item.id] ? "✓" : "☐";
        const alternatives = item.alternatives.length > 0 ? `\n  Instead: ${item.alternatives.join(" · ")}` : "";
        return `${mark} ${item.name}${alternatives}`;
      });
      return `${categoryLabels[category]}\n${entries.join("\n")}`;
    })
    .join("\n\n");
  return `NourishLoop shopping list\n\n${body}\n\nA flexible list for your week. Fresh, frozen, canned, store-brand, or a familiar substitute can all work.`;
}
