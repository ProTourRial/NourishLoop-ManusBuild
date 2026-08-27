# RevenueCat Launch Setup

NourishLoop contains the official RevenueCat React Native SDK integration. The remaining actions are account-level configuration performed in the RevenueCat dashboard and Google Play Console. These actions are deliberately not automated because they require ownership of the relevant merchant and store accounts.

## Configuration checklist

| Step | Owner action | Result in NourishLoop |
|---|---|---|
| 1 | Create a RevenueCat project named `NourishLoop` | Generates platform-specific public SDK keys |
| 2 | Add the Android application using the Android package displayed in `app.config.ts` | Links RevenueCat to the right Android client |
| 3 | Create Google Play subscription products and connect the Google Play store | Allows native billing and product metadata to be fetched |
| 4 | Keep entitlement `nourishloop_pro` attached to every premium product | Grants access to premium features after purchase |
| 5 | Create a current offering with monthly and annual packages | Supplies the live paywall with products and prices |
| 6 | Add Android public SDK key as `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` through secure project settings | Enables `Purchases.configure` in Android builds |
| 7 | Produce a development or internal Android build, then make a sandbox purchase | Validates purchase and restore end to end |

## Safe SDK key handoff

The project may retain an empty or text-only `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` placeholder in its secure configuration. The application now ignores any value that is not an Android public SDK key (expected to begin with `goog_`), so no fake/Test Store key can activate billing in a build. After the Android/Google Play application is added in RevenueCat, replace it with the real **Android public SDK key** through the project Secrets panel. The app keeps Plus inactive until a valid key and current offering are available.

## Application contract

The code expects the verified entitlement identifier `nourishloop_pro`. `getPremiumStatus()` reads that entitlement from `CustomerInfo`. `getCurrentOffering()` reads the RevenueCat current offering. The purchase button purchases the first available package in the current offering, so the dashboard must have a valid current offering before the launch build.

## Test scenario

Install an Android development build rather than relying on a preview client. Open **Profile → Explore Plus**, confirm that the live product metadata appears, make a Google Play test purchase, return to the app, and confirm that the Plus status becomes active. Use **Restore purchase** to verify entitlement recovery.
