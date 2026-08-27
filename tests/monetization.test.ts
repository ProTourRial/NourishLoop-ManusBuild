import { describe, expect, it } from "vitest";
import { REVENUECAT_ENTITLEMENT_ID } from "../shared/monetization";

describe("RevenueCat configuration", () => {
  it("uses the entitlement verified in the NourishLoop RevenueCat project", () => {
    expect(REVENUECAT_ENTITLEMENT_ID).toBe("nourishloop_pro");
  });
});
