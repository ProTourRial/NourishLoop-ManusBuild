import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { IconBadge, PrimaryButton, SectionTitle, SmallLink } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";

export default function IdeaScreen() {
  const router = useRouter();
  const { latestRecommendation, savedIdeas, saveIdea } = useNourish();
  if (!latestRecommendation) return <ScreenContainer className="px-5 justify-center"><PrimaryButton label="Start a check-in" onPress={() => router.replace("/check-in" as never)} /></ScreenContainer>;
  const { idea, matchReason, gentleNudge } = latestRecommendation;
  const isSaved = savedIdeas.some((saved) => saved.id === idea.id);
  const save = () => { haptic.success(); saveIdea(idea); };

  return (
    <ScreenContainer className="px-5">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.nav}><Pressable onPress={() => router.back()} style={({ pressed }) => [styles.back, pressed && styles.pressed]}><MaterialCommunityIcons name="arrow-left" size={22} color="#21312B" /></Pressable><Text style={styles.navTitle}>Your next meal</Text><Pressable onPress={save} style={({ pressed }) => [styles.back, isSaved && styles.savedBack, pressed && styles.pressed]}><MaterialCommunityIcons name={isSaved ? "bookmark" : "bookmark-outline"} size={21} color="#1F5A4C" /></Pressable></View>
        <View style={styles.hero}><View style={styles.heroMeta}><View style={styles.timePill}><MaterialCommunityIcons name="clock-outline" size={15} color="#1F5A4C" /><Text style={styles.timeText}>{idea.timeMinutes} min</Text></View><Text style={styles.ideaKicker}>MADE FOR THIS MOMENT</Text></View><Text style={styles.title}>{idea.title}</Text><Text style={styles.subtitle}>{idea.subtitle}</Text><View style={styles.tagRow}>{idea.tags.map((tag) => <View key={tag} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>)}</View></View>
        <View style={styles.reason}><IconBadge icon="heart-outline" color="#A65F38" background="#FCE8DA" /><Text style={styles.reasonText}>{matchReason}</Text></View>
        <View style={styles.section}><SectionTitle eyebrow="Build the plate" title="A flexible balance" /><View style={styles.componentList}>{idea.components.map((component) => <View key={component.role} style={styles.component}><View style={styles.componentDot} /><View style={styles.componentText}><Text style={styles.componentRole}>{component.role}</Text><Text style={styles.componentItem}>{component.item}</Text></View></View>)}</View></View>
        <View style={styles.section}><SectionTitle eyebrow="Keep it simple" title="Make it your way" /><View style={styles.stepList}>{idea.steps.map((step, index) => <View key={step} style={styles.step}><Text style={styles.stepNumber}>{index + 1}</Text><Text style={styles.stepText}>{step}</Text></View>)}</View></View>
        <View style={styles.swapCard}><View style={styles.swapHeading}><MaterialCommunityIcons name="swap-horizontal" size={21} color="#1F5A4C" /><Text style={styles.swapTitle}>Easy swaps are welcome</Text></View>{idea.substitutions.map((swap) => <Text key={swap} style={styles.swapText}>• {swap}</Text>)}</View>
        <View style={styles.nudge}><MaterialCommunityIcons name="leaf" size={19} color="#1F5A4C" /><Text style={styles.nudgeText}>{gentleNudge}</Text></View>
        <PrimaryButton label={isSaved ? "Saved to your calm corner" : "Save this idea"} onPress={save} icon={isSaved ? "check" : "bookmark-plus-outline"} />
        <SmallLink label="I want a different idea" onPress={() => router.replace("/check-in" as never)} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 30, gap: 22 }, nav: { height: 42, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, back: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#ECEDE8" }, savedBack: { backgroundColor: "#DCE9DF", borderColor: "#DCE9DF" }, navTitle: { color: "#21312B", fontSize: 15, fontWeight: "800" }, hero: { backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EBECE8", borderRadius: 25, padding: 21, gap: 13 }, heroMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }, timePill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 99, backgroundColor: "#DCE9DF" }, timeText: { color: "#1F5A4C", fontSize: 12, lineHeight: 16, fontWeight: "800" }, ideaKicker: { color: "#6F8176", fontSize: 10, lineHeight: 14, letterSpacing: 0.8, fontWeight: "900" }, title: { color: "#21312B", fontSize: 29, lineHeight: 35, fontWeight: "800" }, subtitle: { color: "#61756B", fontSize: 15, lineHeight: 21 }, tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 }, tag: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 9, backgroundColor: "#F5F4F0" }, tagText: { color: "#52675C", fontSize: 11, lineHeight: 14, fontWeight: "700" }, reason: { backgroundColor: "#FFF5ED", borderRadius: 20, padding: 15, flexDirection: "row", gap: 12, alignItems: "flex-start" }, reasonText: { flex: 1, color: "#815136", fontSize: 14, lineHeight: 20, paddingTop: 1 }, section: { gap: 13 }, componentList: { backgroundColor: "#FFFFFF", borderRadius: 20, padding: 17, gap: 16, borderWidth: 1, borderColor: "#ECEDE8" }, component: { flexDirection: "row", gap: 12, alignItems: "flex-start" }, componentDot: { width: 10, height: 10, borderRadius: 5, marginTop: 5, backgroundColor: "#F3B284" }, componentText: { flex: 1, gap: 2 }, componentRole: { color: "#1F5A4C", fontSize: 12, lineHeight: 16, fontWeight: "900", textTransform: "uppercase", letterSpacing: 0.65 }, componentItem: { color: "#21312B", fontSize: 15, lineHeight: 20, fontWeight: "600" }, stepList: { gap: 12 }, step: { flexDirection: "row", alignItems: "flex-start", gap: 12 }, stepNumber: { color: "#FFFFFF", backgroundColor: "#1F5A4C", width: 25, height: 25, borderRadius: 13, textAlign: "center", paddingTop: 3, overflow: "hidden", fontSize: 12, lineHeight: 17, fontWeight: "800" }, stepText: { flex: 1, color: "#465C51", fontSize: 15, lineHeight: 21, paddingTop: 1 }, swapCard: { borderRadius: 20, backgroundColor: "#F0F4F0", padding: 17, gap: 8 }, swapHeading: { flexDirection: "row", gap: 8, alignItems: "center" }, swapTitle: { color: "#21312B", fontSize: 15, lineHeight: 20, fontWeight: "800" }, swapText: { color: "#547066", fontSize: 13, lineHeight: 19 }, nudge: { flexDirection: "row", alignItems: "flex-start", gap: 9, paddingHorizontal: 5 }, nudgeText: { flex: 1, color: "#547066", fontSize: 13, lineHeight: 19, fontStyle: "italic" }, pressed: { opacity: 0.7 },
});
