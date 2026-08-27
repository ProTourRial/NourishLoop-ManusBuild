import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, Pressable, SectionList, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";
import { trpc } from "@/lib/trpc";
import type { ShoppingListItem } from "@/shared/nourish";

const categoryLabels: Record<ShoppingListItem["category"], string> = { base: "Bases", protein: "Proteins & pairings", produce: "Produce", flavor: "Flavor makers", extras: "Optional extras" };

export default function ShoppingListScreen() {
  const router = useRouter();
  const { weeklyPlan, savedIdeas, shoppingChecks, toggleShoppingItem } = useNourish();
  const ideaIds = useMemo(() => Array.from(new Set([...(weeklyPlan?.days.map((day) => day.idea.id) ?? []), ...savedIdeas.map((idea) => idea.id)])), [weeklyPlan, savedIdeas]);
  const shoppingQuery = trpc.nourish.shoppingList.useQuery({ ideaIds }, { enabled: ideaIds.length > 0 });
  const sections = useMemo(() => Object.entries(categoryLabels).map(([category, title]) => ({ title, data: (shoppingQuery.data ?? []).filter((item) => item.category === category) })).filter((section) => section.data.length > 0), [shoppingQuery.data]);
  const checkedCount = (shoppingQuery.data ?? []).filter((item) => shoppingChecks[item.id]).length;

  if (ideaIds.length === 0) return <ScreenContainer className="px-5 justify-center"><View style={styles.empty}><View style={styles.emptyIcon}><MaterialCommunityIcons name="cart-outline" size={28} color="#1F5A4C" /></View><Text style={styles.emptyTitle}>Your list will grow from what helps.</Text><Text style={styles.emptyCopy}>Build a flexible week or save an idea first. We’ll turn its components into an adaptable shopping list.</Text><PrimaryButton label="Build my week" onPress={() => router.replace("/weekly-plan" as never)} icon="calendar-heart" /></View></ScreenContainer>;
  if (shoppingQuery.isLoading) return <ScreenContainer className="items-center justify-center gap-3"><ActivityIndicator color="#1F5A4C" size="large" /><Text style={styles.loadingText}>Gathering flexible staples…</Text></ScreenContainer>;

  return <ScreenContainer className="px-5"><SectionList sections={sections} keyExtractor={(item) => item.id} contentContainerStyle={styles.content} ListHeaderComponent={<View style={styles.header}><View style={styles.nav}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialCommunityIcons name="arrow-left" size={22} color="#21312B" /></Pressable><Text style={styles.navLabel}>SHOPPING LIST</Text><View style={styles.backPlaceholder} /></View><Text style={styles.title}>A list that can bend with you.</Text><Text style={styles.copy}>{checkedCount === 0 ? "Start with what feels useful. Every item has an easy alternative." : `${checkedCount} item${checkedCount === 1 ? "" : "s"} checked. Take what helps and leave the rest.`}</Text></View>} renderSectionHeader={({ section }) => <Text style={styles.sectionTitle}>{section.title}</Text>} renderItem={({ item }) => <ShoppingItem item={item} checked={Boolean(shoppingChecks[item.id])} onPress={() => { haptic.selection(); toggleShoppingItem(item.id); }} />} ListFooterComponent={<Text style={styles.footer}>This is not a prescription. Fresh, frozen, canned, store-brand, or a familiar substitute can all be part of the plan.</Text>} /></ScreenContainer>;
}

function ShoppingItem({ item, checked, onPress }: { item: ShoppingListItem; checked: boolean; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.item, checked && styles.itemChecked, pressed && styles.pressed]}><View style={[styles.checkbox, checked && styles.checkboxChecked]}>{checked ? <MaterialCommunityIcons name="check" size={15} color="#FFFFFF" /> : null}</View><View style={styles.itemText}><Text style={[styles.itemName, checked && styles.checkedText]}>{item.name}</Text><Text style={[styles.alternatives, checked && styles.checkedText]}>Instead: {item.alternatives.join(" · ")}</Text><Text style={[styles.source, checked && styles.checkedText]}>Used in {item.sourceIdeaIds.length} meal idea{item.sourceIdeaIds.length === 1 ? "" : "s"}</Text></View></Pressable>;
}

const styles = StyleSheet.create({ content: { paddingTop: 8, paddingBottom: 32, gap: 7 }, header: { gap: 8, marginBottom: 13 }, nav: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }, back: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#ECEDE8" }, backPlaceholder: { width: 42 }, navLabel: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900" }, title: { color: "#21312B", fontSize: 29, lineHeight: 35, fontWeight: "800" }, copy: { color: "#61756B", fontSize: 14, lineHeight: 20 }, sectionTitle: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, letterSpacing: 0.9, fontWeight: "900", textTransform: "uppercase", marginTop: 15, marginBottom: 6 }, item: { padding: 14, gap: 12, flexDirection: "row", alignItems: "flex-start", backgroundColor: "#FFFFFF", borderRadius: 17, borderWidth: 1, borderColor: "#ECEDE8", marginBottom: 8 }, itemChecked: { backgroundColor: "#F0F4F0", borderColor: "#DCE9DF" }, checkbox: { width: 23, height: 23, borderRadius: 7, borderWidth: 1.5, borderColor: "#9FAFA6", alignItems: "center", justifyContent: "center", marginTop: 1 }, checkboxChecked: { backgroundColor: "#1F5A4C", borderColor: "#1F5A4C" }, itemText: { flex: 1, gap: 3 }, itemName: { color: "#21312B", fontSize: 15, lineHeight: 20, fontWeight: "800" }, alternatives: { color: "#6F8176", fontSize: 12, lineHeight: 17 }, source: { color: "#8A978F", fontSize: 10, lineHeight: 14, fontWeight: "700" }, checkedText: { textDecorationLine: "line-through", color: "#7E8D84" }, footer: { color: "#6F8176", fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 12, marginTop: 20 }, empty: { alignItems: "center", gap: 12, paddingHorizontal: 17 }, emptyIcon: { width: 64, height: 64, borderRadius: 32, backgroundColor: "#DCE9DF", alignItems: "center", justifyContent: "center" }, emptyTitle: { color: "#21312B", fontSize: 22, lineHeight: 28, fontWeight: "800", textAlign: "center" }, emptyCopy: { color: "#6F8176", fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 7 }, loadingText: { color: "#61756B", fontSize: 14, lineHeight: 19, fontWeight: "700" }, pressed: { opacity: 0.68, transform: [{ scale: 0.985 }] },
});
