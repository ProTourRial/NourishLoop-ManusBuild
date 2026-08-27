import { MaterialCommunityIcons } from "@expo/vector-icons";
import { type ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type IconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"];

export function IconBadge({ icon, color = "#1F5A4C", background = "#DCE9DF" }: { icon: IconName; color?: string; background?: string }) {
  return <View style={[styles.iconBadge, { backgroundColor: background }]}><MaterialCommunityIcons name={icon} size={19} color={color} /></View>;
}

export function PrimaryButton({ label, onPress, icon = "arrow-right", disabled = false }: { label: string; onPress: () => void; icon?: IconName; disabled?: boolean }) {
  return (
    <Pressable accessibilityRole="button" disabled={disabled} onPress={onPress} style={({ pressed }) => [styles.primaryButton, (pressed || disabled) && styles.primaryButtonPressed]}>
      <Text style={styles.primaryButtonText}>{label}</Text>
      <MaterialCommunityIcons name={icon} size={20} color="#FFFFFF" />
    </Pressable>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <View style={styles.sectionTitle}><View style={styles.sectionText}>{eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}<Text style={styles.heading}>{title}</Text></View>{action}</View>;
}

export function ChoiceChip({ label, selected, onPress, icon }: { label: string; selected: boolean; onPress: () => void; icon?: IconName }) {
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ selected }} onPress={onPress} style={({ pressed }) => [styles.chip, selected && styles.chipSelected, pressed && styles.pressed]}>
      {icon ? <MaterialCommunityIcons name={icon} size={17} color={selected ? "#FFFFFF" : "#1F5A4C"} /> : null}
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text>
    </Pressable>
  );
}

export function SmallLink({ label, onPress }: { label: string; onPress: () => void }) {
  return <Pressable onPress={onPress} style={({ pressed }) => [styles.smallLink, pressed && styles.pressed]}><Text style={styles.smallLinkText}>{label}</Text></Pressable>;
}

const styles = StyleSheet.create({
  iconBadge: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center" },
  primaryButton: { backgroundColor: "#1F5A4C", minHeight: 54, borderRadius: 18, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  primaryButtonPressed: { opacity: 0.82, transform: [{ scale: 0.98 }] },
  primaryButtonText: { color: "#FFFFFF", fontSize: 16, lineHeight: 21, fontWeight: "700" },
  sectionTitle: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 12 },
  sectionText: { flex: 1, gap: 4 },
  eyebrow: { color: "#6F8176", fontSize: 11, lineHeight: 15, fontWeight: "800", letterSpacing: 1.1, textTransform: "uppercase" },
  heading: { color: "#21312B", fontSize: 23, lineHeight: 29, fontWeight: "800" },
  chip: { minHeight: 42, borderRadius: 14, paddingHorizontal: 13, flexDirection: "row", gap: 7, alignItems: "center", justifyContent: "center", backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E5E6E1" },
  chipSelected: { backgroundColor: "#1F5A4C", borderColor: "#1F5A4C" },
  chipText: { color: "#355047", fontSize: 13, lineHeight: 18, fontWeight: "700" },
  chipTextSelected: { color: "#FFFFFF" },
  smallLink: { minHeight: 34, justifyContent: "center" },
  smallLinkText: { color: "#1F5A4C", fontSize: 14, lineHeight: 19, fontWeight: "800" },
  pressed: { opacity: 0.7 },
});
