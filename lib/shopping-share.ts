import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform, Share } from "react-native";

import type { ShoppingListItem } from "@/shared/nourish";
import { formatShoppingListForShare } from "@/shared/shopping-share";

export type ShoppingShareStatus = "shared" | "unavailable" | "cancelled";

export async function shareShoppingList(items: ShoppingListItem[], checked: Record<string, boolean>): Promise<ShoppingShareStatus> {
  const content = formatShoppingListForShare(items, checked);
  if (Platform.OS === "web") {
    try {
      await Share.share({ title: "NourishLoop shopping list", message: content });
      return "shared";
    } catch {
      return "unavailable";
    }
  }

  if (!(await Sharing.isAvailableAsync())) return "unavailable";
  const file = new File(Paths.cache, "nourishloop-shopping-list.txt");
  file.create({ overwrite: true, intermediates: true });
  file.write(content);
  try {
    await Sharing.shareAsync(file.uri, { dialogTitle: "Share your NourishLoop shopping list", mimeType: "text/plain", UTI: "public.plain-text" });
    return "shared";
  } catch {
    return "cancelled";
  }
}
