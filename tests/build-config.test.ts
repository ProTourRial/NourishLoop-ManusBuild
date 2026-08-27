import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

describe("Android release configuration", () => {
  it("defines an internal APK profile and a production app-bundle profile", () => {
    const config = JSON.parse(readFileSync(resolve(root, "eas.json"), "utf8"));
    expect(config.build.preview.distribution).toBe("internal");
    expect(config.build.preview.android.buildType).toBe("apk");
    expect(config.build.production.android.buildType).toBe("app-bundle");
  });

  it("does not accept the RevenueCat Test Store key as an Android production key", () => {
    const configuredKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY ?? "";
    expect(configuredKey.startsWith("test_")).toBe(false);

    const configSource = readFileSync(resolve(root, "app.config.ts"), "utf8");
    expect(configSource).toContain("EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY");
    expect(configSource).toContain("androidKeyConfigured");
  });
});
