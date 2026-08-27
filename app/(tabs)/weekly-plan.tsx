import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { IconBadge, PrimaryButton } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";
import { trpc } from "@/lib/trpc";
import type { NourishCheckIn, WeeklyPlanDay } from "@/shared/nourish";

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const { preferences, weeklyPlan, setWeeklyPlan } = useNourish();
  const input: NourishCheckIn = { hunger: "ready", energy: "steady", time: "fifteen", mood: "warm", ingredients: [], dietary: preferences.dietary, allergens: preferences.allergens, avoidIngredients: preferences.avoidIngredients, budget: preferences.budget };
  const weeklyQuery = trpc.nourish.weeklyPlan.useQuery(input);

  useEffect(() => { if (!weeklyPlan && weeklyQuery.data) setWeeklyPlan(weeklyQuery.data); }, [weeklyPlan, weeklyQuery.data, setWeeklyPlan]);
  const regenerate = async () => { haptic.light(); const result = await weeklyQuery.refetch(); if (result.data) { setWeeklyPlan(result.data); haptic.success(); } };
  const swapDay = (index: number) => {
    if (!weeklyPlan) return;
    const current = weeklyPlan.days[index];
    const next = current.swaps[0];
    if (!next) return;
    haptic.selection();
    setWeeklyPlan({ ...weeklyPlan, days: weeklyPlan.days.map((day, dayIndex) => dayIndex === index ? { ...day, idea: next, swaps: [...day.swaps.slice(1), current.idea] } : day) });
  };

  if (!weeklyPlan && weeklyQuery.isLoading) return <ScreenContainer className="items-center justify-center gap-3"><ActivityIndicator color="#1F5A4C" size="large" /><Text style={styles.loadingText}>Building a flexible week…</Text></ScreenContainer>;
  const plan = weeklyPlan ?? weeklyQuery.data;
  if (!plan) return <ScreenContainer className="px-5 justify-center"><PrimaryButton label="Try building your week again" onPress={regenerate} icon="refresh" /></ScreenContainer>;

  return (
    <ScreenContainer className="px-5">
      <FlatList
        data={plan.days}
        keyExtractor={(item) => item.day}
        contentContainerStyle={styles.content}
        ListHeaderComponent={<View style={styles.header}><View style={styles.nav}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialCommunityIcons name="arrow-left" size={22} color="#21312B" /></Pressable><Text style={styles.navLabel}>YOUR WEEK</Text><Pressable onPress={() => router.push("/shopping-list" as never)} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialCommunityIcons name="cart-outline" size={21} color="#1F5A4C" /></Pressable></View><View style={styles.hero}><IconBadge icon="calendar-heart" color="#1F5A4C" background="#DCE9DF" /><View style={styles.heroText}><Text style={styles.kicker}>FREE, FLEXIBLE SUPPORT</Text><Text style={styles.title}>{plan.title}</Text><Text style={styles.copy}>{plan.subtitle}</Text></View></View><View style={styles.actions}><Pressable onPress={() => router.push("/shopping-list" as never)} style={({ pressed }) => [styles.shoppingAction, pressed && styles.pressed]}><MaterialCommunityIcons name="cart-outline" size={18} color="#1F5A4C" /><Text style={styles.shoppingText}>Build shopping list</Text></Pressable><Pressable onPress={regenerate} style={({ pressed }) => [styles.regenerate, pressed && styles.pressed]}><MaterialCommunityIcons name="refresh" size={18} color="#1F5A4C" /><Text style={styles.regenerateText}>Refresh week</Text></Pressable></View><Text style={styles.listLabel}>KEEP WHAT FITS. SWAP WHAT DOESN’T.</Text></View>}
        renderItem={({ item, index }) => <PlanDayCard day={item} onSwap={() => swapDay(index)} />}
        ListFooterComponent={<Text style={styles.footer}>This is a starting point, not a set of rules. A saved idea or a simple snack is always allowed to take its place.</Text>}
      />
    </ScreenContainer>
  );
}

function PlanDayCard({ day, onSwap }: { day: WeeklyPlanDay; onSwap: () => void }) {
  return <View style={styles.dayCard}><View style={styles.dayTop}><Text style={styles.dayName}>{day.day}</Text><View style={styles.timePill}><MaterialCommunityIcons name="clock-outline" size={14} color="#1F5A4C" /><Text style={styles.timeText}>{day.idea.timeMinutes} min</Text></View></View><Text style={styles.dayTitle}>{day.idea.title}</Text><Text style={styles.dayCopy}>{day.idea.subtitle}</Text><View style={styles.tagRow}>{day.idea.tags.slice(0, 2).map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View><Pressable onPress={onSwap} disabled={day.swaps.length === 0} style={({ pressed }) => [styles.swapButton, pressed && styles.pressed]}><MaterialCommunityIcons name="swap-horizontal" size={19} color="#1F5A4C" /><Text style={styles.swapText}>Swap this idea</Text></Pressable></View>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 32, gap: 12 }, header: { gap: 18, marginBottom: 7 }, nav: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#ECEDE8" }, navLabel: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900" }, hero: { gap: 13 }, heroText: { gap: 5 }, kicker: { color: "#6F8176", fontSize: 11, lineHeight: 15, letterSpacing: 1, fontWeight: "900" }, title: { color: "#21312B", fontSize: 30, lineHeight: 37, fontWeight: "800" }, copy: { color: "#61756B", fontSize: 15, lineHeight: 21 }, actions: { flexDirection: "row", gap: 9 }, shoppingAction: { flex: 1, minHeight: 44, borderRadius: 14, backgroundColor: "#DCE9DF", flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center", paddingHorizontal: 10 }, shoppingText: { color: "#1F5A4C", fontSize: 13, lineHeight: 18, fontWeight: "800" }, regenerate: { minHeight: 44, borderRadius: 14, paddingHorizontal: 12, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6E1", flexDirection: "row", gap: 6, alignItems: "center" }, regenerateText: { color: "#1F5A4C", fontSize: 13, lineHeight: 18, fontWeight: "800" }, listLabel: { color: "#6F8176", fontSize: 10, lineHeight: 14, letterSpacing: 0.8, fontWeight: "900" }, dayCard: { backgroundColor: "#FFFFFF", borderRadius: 21, padding: 16, gap: 8, borderWidth: 1, borderColor: "#ECEDE8" }, dayTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, dayName: { color: "#1F5A4C", fontSize: 12, lineHeight: 17, fontWeight: "900", letterSpacing: 0.7, textTransform: "uppercase" }, timePill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 5, backgroundColor: "#F0F4F0", borderRadius: 99 }, timeText: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, fontWeight: "800" }, dayTitle: { color: "#21312B", fontSize: 18, lineHeight: 23, fontWeight: "800" }, dayCopy: { color: "#61756B", fontSize: 13, lineHeight: 19 }, tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 }, tag: { paddingHorizontal: 8, paddingVertical: 5, borderRadius: 8, backgroundColor: "#F5F4F0" }, tagText: { color: "#52675C", fontSize: 10, lineHeight: 14, fontWeight: "800" }, swapButton: { alignSelf: "flex-start", minHeight: 36, paddingHorizontal: 5, marginTop: 2, flexDirection: "row", gap: 7, alignItems: "center" }, swapText: { color: "#1F5A4C", fontSize: 13, lineHeight: 18, fontWeight: "800" }, footer: { color: "#6F8176", fontSize: 12, lineHeight: 18, textAlign: "center", paddingHorizontal: 14, marginTop: 9 }, loadingText: { color: "#61756B", fontSize: 14, lineHeight: 19, fontWeight: "700" }, pressed: { opacity: 0.68, transform: [{ scale: 0.985 }] },
});
