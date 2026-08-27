# NourishLoop

**NourishLoop** is a compassionate Android nutrition companion that helps people choose practical, satisfying food without calorie counting, macro tracking, or restrictive meal plans. Users complete a short check-in, receive a flexible food idea tailored to their time and mood, save helpful ideas locally, and can access a thoughtful subscription upgrade through RevenueCat.

## What is included

| Area | Implementation |
|---|---|
| Mobile application | Expo Router, React Native, TypeScript, and a portrait-first Android experience |
| Recommendation API | Public, typed tRPC endpoint with deterministic scoring and Zod validation |
| Original dataset | Eight hand-authored, flexible meal and snack templates with substitutions |
| Core experience | Today, Quick Check-in, Recommendation, Saved Ideas, Profile, and Plus paywall |
| Local persistence | Saved ideas and user preferences stored with AsyncStorage |
| Monetization | Official `react-native-purchases` and `react-native-purchases-ui` packages installed, with purchase and restore flows prepared |
| Quality | Vitest tests for the recommendation service and TypeScript type checking |

## Run locally

Install dependencies with `pnpm install`. Use `pnpm dev` to start the API and Expo bundler together. Run `pnpm check` for TypeScript validation and `pnpm test` for the test suite.

## RevenueCat production setup

The app is intentionally safe before a RevenueCat key is configured: the Plus screen remains visible, but it cannot initiate a real purchase. Before Google Play submission, create a RevenueCat project and complete this mapping:

| RevenueCat / Google Play item | Required value |
|---|---|
| Android app | NourishLoop package name from `app.config.ts` |
| Entitlement | `nourishloop_pro` |
| Google Play subscription products | A monthly and annual NourishLoop Plus product |
| RevenueCat offering | Set one offering as **current** and attach the products |
| App runtime configuration | Add `EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY` as a secure project setting; never commit it |

With a valid Android public SDK key, the application configures the official RevenueCat SDK, checks active `nourishloop_pro` entitlements, reads the current offering, starts purchase, and restores purchases. A development build or store build is required for real in-app purchases; preview environments do not complete native billing.

## Android release

Create a verified project checkpoint, then use the **Publish** control in the project interface to produce the Android build/APK. Do not attempt to build the APK manually in the sandbox. The user must provide or control the Google Play developer account used for production publishing and product configuration.

## App safety

NourishLoop offers general food-idea inspiration. It does not provide a diagnosis, calorie counts, meal prescriptions, or medical advice. The starter dataset is original and hand-authored for this repository.
