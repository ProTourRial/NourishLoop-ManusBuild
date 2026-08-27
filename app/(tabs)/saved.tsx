import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { IconBadge, PrimaryButton } from "@/components/nourish-ui";
import { ScreenContainer } from "@/components/screen-container";
import { haptic } from "@/lib/haptics";
import { useNourish } from "@/lib/nourish-context";
import type { NourishIdea } from "@/shared/nourish";

export default function SavedScreen() {
  const router = useRouter();
  const { savedIdeas, removeIdea, setLatestRecommendation } = useNourish();
  const openIdea = (idea: NourishIdea) => {
    setLatestRecommendation({ idea, matchReason: "You saved this because it felt like a useful option for real life.", gentleNudge: idea.encouragement });
    router.push("/idea" as never);
  };

  return (
    <ScreenContainer className="px-5">
      <FlatList
        data={savedIdeas}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.kicker}>YOUR CALM CORNER</Text>
            <Text style={styles.title}>Saved ideas</Text>
            <Text style={styles.copy}>Keep the meals that make future decisions lighter.</Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <IconBadge icon="book-heart-outline" />
            <Text style={styles.emptyTitle}>Nothing saved yet</Text>
            <Text style={styles.emptyCopy}>When an idea feels helpful, save it here for the days you want less thinking.</Text>
            <PrimaryButton label="Find my first idea" onPress={() => router.push("/check-in" as never)} icon="creation" />
          </View>
        }
        renderItem={({ item }) => (
          <Pressable onPress={() => openIdea(item)} style={({ pressed }) => [styles.ideaCard, pressed && styles.pressed]}>
            <View style={styles.cardMain}>
              <View style={styles.cardIcon}><MaterialCommunityIcons name="food-variant" size={20} color="#1F5A4C" /></View>
              <View style={styles.cardText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text numberOfLines={2} style={styles.cardCopy}>{item.subtitle}</Text>
                <Text style={styles.cardMeta}>{item.timeMinutes} min · {item.tags[0]}</Text>
              </View>
            </View>
            <Pressable onPress={() => { haptic.selection(); removeIdea(item.id); }} hitSlop={8} style={({ pressed }) => [styles.remove, pressed && styles.pressed]}>
              <MaterialCommunityIcons name="close" size={20} color="#6F8176" />
            </Pressable>
          </Pressable>
        )}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  content: { paddingTop: 14, paddingBottom: 28, gap: 12, flexGrow: 1 },
  header: { marginBottom: 10, gap: 5 },
  kicker: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, fontWeight: "900", letterSpacing: 1.1 },
  title: { color: "#21312B", fontSize: 30, lineHeight: 37, fontWeight: "800" },
  copy: { color: "#6F8176", fontSize: 15, lineHeight: 21 },
  empty: { flex: 1, minHeight: 390, justifyContent: "center", alignItems: "center", gap: 12, paddingHorizontal: 20 },
  emptyTitle: { color: "#21312B", fontSize: 20, lineHeight: 26, fontWeight: "800" },
  emptyCopy: { color: "#6F8176", fontSize: 14, lineHeight: 20, textAlign: "center", marginBottom: 8 },
  ideaCard: { backgroundColor: "#FFFFFF", borderRadius: 19, padding: 15, borderWidth: 1, borderColor: "#ECEDE8", flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 8 },
  cardMain: { flex: 1, flexDirection: "row", gap: 12 },
  cardIcon: { width: 39, height: 39, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "#DCE9DF" },
  cardText: { flex: 1, gap: 3 },
  cardTitle: { color: "#21312B", fontSize: 16, lineHeight: 21, fontWeight: "800" },
  cardCopy: { color: "#6F8176", fontSize: 13, lineHeight: 18 },
  cardMeta: { color: "#1F5A4C", fontSize: 11, lineHeight: 15, fontWeight: "800", marginTop: 2 },
  remove: { width: 32, height: 32, justifyContent: "center", alignItems: "center" },
  pressed: { opacity: 0.68, transform: [{ scale: 0.985 }] },
});
