import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { IconBadge, PrimaryButton, SectionTitle } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";

export default function TodayScreen() {
  const router = useRouter();
  const { savedIdeas, hasPro } = useNourish();
  const openCheckIn = () => { haptic.light(); router.push("/check-in" as never); };

  return (
    <ScreenContainer className="px-5" containerClassName="bg-background">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.topline}>
          <View><Text style={styles.kicker}>NOURISHLOOP</Text><Text style={styles.greeting}>A gentler way to decide what’s next.</Text></View>
          <View style={styles.avatar}><Text style={styles.avatarText}>N</Text></View>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTop}><IconBadge icon="sprout-outline" color="#FFFFFF" background="#387566" /><View style={styles.liveBadge}><View style={styles.liveDot} /><Text style={styles.liveText}>TODAY’S CHECK-IN</Text></View></View>
          <Text style={styles.heroTitle}>What would feel good right now?</Text>
          <Text style={styles.heroCopy}>A few small choices become one practical meal idea. No counting. No rules.</Text>
          <PrimaryButton label="Find my next meal" onPress={openCheckIn} icon="arrow-right" />
        </View>

        <SectionTitle eyebrow="Make food feel easier" title="Start where you are" />
        <View style={styles.promptGrid}>
          <PromptCard icon="clock-outline" title="Short on time?" copy="We’ll keep it realistic." />
          <PromptCard icon="food-apple-outline" title="Use what’s around" copy="Ingredients are always flexible." />
          <PromptCard icon="weather-sunny" title="Need a lift?" copy="Choose your current energy." />
          <PromptCard icon="heart-outline" title="Feed the feeling" copy="Warm, fresh, crunchy, or cozy." />
        </View>

        <View style={styles.savedCard}>
          <View style={styles.savedHeader}><IconBadge icon="bookmark-outline" /><Text style={styles.savedCount}>{savedIdeas.length === 0 ? "Your calm corner" : `${savedIdeas.length} saved idea${savedIdeas.length === 1 ? "" : "s"}`}</Text></View>
          <Text style={styles.savedCopy}>{savedIdeas.length === 0 ? "Save ideas that work for you. They’ll be here on the days you need less thinking." : "Your go-to ideas are ready whenever food feels like one more decision."}</Text>
          <Pressable onPress={() => router.push("/saved" as never)} style={({ pressed }) => [styles.textButton, pressed && styles.pressed]}><Text style={styles.textButtonText}>Open saved ideas</Text><MaterialCommunityIcons name="arrow-right" size={18} color="#1F5A4C" /></Pressable>
        </View>

        <Pressable onPress={() => router.push("/premium" as never)} style={({ pressed }) => [styles.plusBanner, pressed && styles.pressed]}>
          <MaterialCommunityIcons name={hasPro ? "check-decagram" : "creation"} size={22} color="#F3B284" />
          <View style={styles.plusText}><Text style={styles.plusTitle}>{hasPro ? "NourishLoop Plus is active" : "Meet NourishLoop Plus"}</Text><Text style={styles.plusCopy}>{hasPro ? "Your expanded weekly support is ready." : "Unlock more ways to make eating feel easier."}</Text></View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#FFFFFF" />
        </Pressable>

        <Text style={styles.disclaimer}>NourishLoop offers general meal inspiration, not medical or dietary advice.</Text>
      </ScrollView>
    </ScreenContainer>
  );
}

function PromptCard({ icon, title, copy }: { icon: React.ComponentProps<typeof MaterialCommunityIcons>["name"]; title: string; copy: string }) {
  return <View style={styles.promptCard}><MaterialCommunityIcons name={icon} size={22} color="#1F5A4C" /><Text style={styles.promptTitle}>{title}</Text><Text style={styles.promptCopy}>{copy}</Text></View>;
}

const styles = StyleSheet.create({
  content: { paddingTop: 8, paddingBottom: 32, gap: 22 },
  topline: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 16 },
  kicker: { fontSize: 11, lineHeight: 15, fontWeight: "900", letterSpacing: 1.2, color: "#1F5A4C" },
  greeting: { maxWidth: 270, marginTop: 5, fontSize: 24, lineHeight: 30, fontWeight: "800", color: "#21312B" },
  avatar: { width: 39, height: 39, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#F3B284" },
  avatarText: { color: "#21312B", fontSize: 17, fontWeight: "900" },
  heroCard: { backgroundColor: "#1F5A4C", borderRadius: 26, padding: 22, gap: 15, shadowColor: "#173B32", shadowOpacity: 0.13, shadowOffset: { width: 0, height: 9 }, shadowRadius: 20, elevation: 4 },
  heroTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  liveBadge: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: "#2C685A", borderRadius: 99 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#F3B284" },
  liveText: { color: "#FFFFFF", fontSize: 10, lineHeight: 13, fontWeight: "800", letterSpacing: 0.8 },
  heroTitle: { color: "#FFFFFF", fontSize: 27, lineHeight: 33, fontWeight: "800", maxWidth: 300 },
  heroCopy: { color: "#DCE9DF", fontSize: 15, lineHeight: 21, maxWidth: 320 },
  promptGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  promptCard: { flexGrow: 1, flexBasis: "46%", minHeight: 136, padding: 15, borderRadius: 20, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#EEEFEA", gap: 8 },
  promptTitle: { color: "#21312B", fontSize: 14, lineHeight: 19, fontWeight: "800" },
  promptCopy: { color: "#6F8176", fontSize: 12, lineHeight: 17 },
  savedCard: { backgroundColor: "#F0F4F0", borderRadius: 22, padding: 18, gap: 10 },
  savedHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  savedCount: { flex: 1, color: "#21312B", fontSize: 16, lineHeight: 21, fontWeight: "800" },
  savedCopy: { color: "#547066", fontSize: 14, lineHeight: 20 },
  textButton: { minHeight: 37, alignSelf: "flex-start", flexDirection: "row", gap: 6, alignItems: "center" },
  textButtonText: { color: "#1F5A4C", fontSize: 14, lineHeight: 19, fontWeight: "800" },
  plusBanner: { minHeight: 88, borderRadius: 20, backgroundColor: "#21312B", padding: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  plusText: { flex: 1, gap: 2 },
  plusTitle: { color: "#FFFFFF", fontSize: 15, lineHeight: 20, fontWeight: "800" },
  plusCopy: { color: "#C3D1C9", fontSize: 12, lineHeight: 17 },
  disclaimer: { color: "#87958D", fontSize: 11, lineHeight: 16, textAlign: "center", paddingHorizontal: 12 },
  pressed: { opacity: 0.72, transform: [{ scale: 0.985 }] },
});
