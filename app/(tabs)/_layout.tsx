import { Tabs } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/haptic-tab";
import { NourishProvider } from "@/lib/nourish-context";
import { Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = 56 + bottomPadding;

  return (
    <NourishProvider>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          paddingTop: 8,
          paddingBottom: bottomPadding,
          height: tabBarHeight,
          backgroundColor: colors.background,
          borderTopColor: colors.border,
          borderTopWidth: 0.5,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Today",
          tabBarIcon: ({ color }) => <MaterialCommunityIcons size={25} name="home-variant-outline" color={color} />,
        }}
      />
      <Tabs.Screen name="saved" options={{ title: "Saved", tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="bookmark-outline" color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: "Profile", tabBarIcon: ({ color }) => <MaterialCommunityIcons size={24} name="account-circle-outline" color={color} /> }} />
      <Tabs.Screen name="check-in" options={{ href: null }} />
      <Tabs.Screen name="idea" options={{ href: null }} />
      <Tabs.Screen name="premium" options={{ href: null }} />
      <Tabs.Screen name="weekly-plan" options={{ href: null }} />
      <Tabs.Screen name="shopping-list" options={{ href: null }} />
    </Tabs>
    </NourishProvider>
  );
}
