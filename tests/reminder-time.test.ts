import { describe, expect, it } from "vitest";
import { isReminderTime, parseReminderTime } from "../shared/reminder-time";

describe("gentle reminder schedule", () => {
  it("accepts a valid 24-hour reminder time", () => {
    expect(isReminderTime("18:30")).toBe(true);
    expect(parseReminderTime("18:30")).toEqual({ hour: 18, minute: 30 });
  });

  it("uses a safe midday fallback for invalid time values", () => {
    expect(isReminderTime("30:99")).toBe(false);
    expect(parseReminderTime("anytime")).toEqual({ hour: 12, minute: 0 });
  });
});
