export const reminderTimeOptions = [
  { label: "Morning", value: "08:30" },
  { label: "Midday", value: "12:00" },
  { label: "Evening", value: "18:30" },
] as const;

export function isReminderTime(value: string): boolean {
  const match = /^(?:[01]\d|2[0-3]):[0-5]\d$/.exec(value);
  return Boolean(match);
}

export function parseReminderTime(value: string): { hour: number; minute: number } {
  if (!isReminderTime(value)) return { hour: 12, minute: 0 };
  const [hour, minute] = value.split(":").map(Number);
  return { hour, minute };
}
