import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

import { parseReminderTime } from "@/shared/reminder-time";

const REMINDER_ID_KEY = "nourishloop.gentleReminderId.v1";
const CHANNEL_ID = "gentle-reminders";

if (Platform.OS !== "web") {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export async function configureGentleReminderChannel() {
  if (Platform.OS !== "android") return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: "Gentle NourishLoop reminders",
    importance: Notifications.AndroidImportance.DEFAULT,
    vibrationPattern: [0, 120],
    lightColor: "#1F5A4C",
  });
}

export async function cancelGentleReminder() {
  const existingId = await AsyncStorage.getItem(REMINDER_ID_KEY);
  if (existingId) await Notifications.cancelScheduledNotificationAsync(existingId);
  await AsyncStorage.removeItem(REMINDER_ID_KEY);
}

export async function scheduleGentleReminder(time: string): Promise<"scheduled" | "permission-denied" | "unsupported"> {
  if (Platform.OS === "web") return "unsupported";
  await configureGentleReminderChannel();
  const permission = await Notifications.getPermissionsAsync();
  const resolvedPermission = permission.status === "granted" ? permission : await Notifications.requestPermissionsAsync();
  if (resolvedPermission.status !== "granted") return "permission-denied";

  await cancelGentleReminder();
  const { hour, minute } = parseReminderTime(time);
  const identifier = await Notifications.scheduleNotificationAsync({
    content: {
      title: "A small pause for you",
      body: "Would it help to make the next food decision a little lighter?",
      data: { url: "/" },
    },
    trigger: { hour, minute, repeats: true, channelId: CHANNEL_ID },
  });
  await AsyncStorage.setItem(REMINDER_ID_KEY, identifier);
  return "scheduled";
}
