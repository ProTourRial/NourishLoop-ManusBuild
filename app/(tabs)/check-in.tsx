import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { ChoiceChip, PrimaryButton, SectionTitle } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";
import { trpc } from "@/lib/trpc";
import type { EnergyLevel, FoodMood, HungerLevel, NourishCheckIn, TimeWindow } from "@/shared/nourish";

const ingredientChoices = ["Eggs", "Bread", "Yogurt", "Rice", "Beans", "Greens", "Fruit", "Noodles"];
const defaultCheckIn: NourishCheckIn = { hunger: "ready", energy: "steady", time: "fifteen", mood: "warm", ingredients: [], dietary: [], allergens: [], avoidIngredients: [], budget: "flexible" };

export default function CheckInScreen() {
  const router = useRouter();
  const { preferences, setLatestRecommendation } = useNourish();
  const [form, setForm] = useState<NourishCheckIn>({ ...defaultCheckIn, dietary: preferences.dietary, allergens: preferences.allergens, avoidIngredients: preferences.avoidIngredients, budget: preferences.budget });
  const [submitted, setSubmitted] = useState<NourishCheckIn | null>(null);
  const recommendation = trpc.nourish.recommend.useQuery(submitted ?? defaultCheckIn, { enabled: Boolean(submitted), retry: 1 });

  useEffect(() => {
    if (recommendation.data) {
      setLatestRecommendation(recommendation.data);
      haptic.success();
      router.replace("/idea" as never);
    }
  }, [recommendation.data, router, setLatestRecommendation]);

  const update = <K extends keyof NourishCheckIn>(key: K, value: NourishCheckIn[K]) => { haptic.selection(); setForm((current) => ({ ...current, [key]: value })); };
  const toggleIngredient = (ingredient: string) => update("ingredients", form.ingredients.includes(ingredient) ? form.ingredients.filter((value) => value !== ingredient) : [...form.ingredients, ingredient]);
  const submit = () => { haptic.light(); setSubmitted(form); };

  return (
    <ScreenContainer className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.nav}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialCommunityIcons name="arrow-left" size={22} color="#21312B" /></Pressable><Text style={styles.navTitle}>Quick check-in</Text><View style={styles.back} /></View>
        <View style={styles.intro}><Text style={styles.kicker}>LESS THAN A MINUTE</Text><Text style={styles.title}>Let’s make the next food decision simpler.</Text><Text style={styles.copy}>Choose what fits today. There are no right answers here.</Text></View>

        <Question label="How hungry are you?" choices={[{ label: "A little", value: "peckish" }, { label: "Ready for food", value: "ready" }, { label: "Very hungry", value: "very-hungry" }]} selected={form.hunger} onChoose={(value) => update("hunger", value as HungerLevel)} />
        <Question label="How is your energy?" choices={[{ label: "Low", value: "low" }, { label: "Steady", value: "steady" }, { label: "Bright", value: "bright" }]} selected={form.energy} onChoose={(value) => update("energy", value as EnergyLevel)} />
        <Question label="How much time feels realistic?" choices={[{ label: "5 min", value: "five" }, { label: "15 min", value: "fifteen" }, { label: "30 min", value: "thirty" }]} selected={form.time} onChoose={(value) => update("time", value as TimeWindow)} />
        <Question label="What kind of food sounds good?" choices={[{ label: "Warm", value: "warm" }, { label: "Fresh", value: "fresh" }, { label: "Crunchy", value: "crunchy" }, { label: "Cozy", value: "comfort" }]} selected={form.mood} onChoose={(value) => update("mood", value as FoodMood)} />

        <View style={styles.ingredientSection}><SectionTitle eyebrow="Optional" title="What do you have around?" /><View style={styles.choices}>{ingredientChoices.map((ingredient) => <ChoiceChip key={ingredient} label={ingredient} selected={form.ingredients.includes(ingredient)} onPress={() => toggleIngredient(ingredient)} />)}</View></View>

        {recommendation.isFetching ? <View style={styles.loading}><ActivityIndicator color="#1F5A4C" /><Text style={styles.loadingText}>Finding a practical idea for this moment…</Text></View> : null}
        {recommendation.isError ? <Text style={styles.error}>We could not reach the meal service. Please try again.</Text> : null}
        <PrimaryButton label={recommendation.isFetching ? "Creating your idea" : "Create my meal idea"} onPress={submit} icon="creation" disabled={recommendation.isFetching} />
      </ScrollView>
    </ScreenContainer>
  );
}

function Question({ label, choices, selected, onChoose }: { label: string; choices: { label: string; value: string }[]; selected: string; onChoose: (value: string) => void }) {
  return <View style={styles.question}><Text style={styles.questionLabel}>{label}</Text><View style={styles.choices}>{choices.map((choice) => <ChoiceChip key={choice.value} label={choice.label} selected={choice.value === selected} onPress={() => onChoose(choice.value)} />)}</View></View>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 30, gap: 25 }, nav: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#ECEDE8" }, navTitle: { color: "#21312B", fontSize: 15, fontWeight: "800" }, intro: { gap: 8 }, kicker: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, letterSpacing: 1.1, fontWeight: "900" }, title: { color: "#21312B", fontSize: 28, lineHeight: 34, fontWeight: "800" }, copy: { color: "#6F8176", fontSize: 15, lineHeight: 21 }, question: { gap: 11 }, questionLabel: { color: "#21312B", fontSize: 16, lineHeight: 21, fontWeight: "800" }, choices: { flexDirection: "row", flexWrap: "wrap", gap: 8 }, ingredientSection: { gap: 13 }, loading: { minHeight: 46, paddingHorizontal: 15, borderRadius: 15, backgroundColor: "#EFF4F0", flexDirection: "row", alignItems: "center", gap: 10 }, loadingText: { flex: 1, color: "#355047", fontSize: 13, lineHeight: 18, fontWeight: "600" }, error: { color: "#B5473D", fontSize: 13, lineHeight: 18 }, pressed: { opacity: 0.68 },
});
