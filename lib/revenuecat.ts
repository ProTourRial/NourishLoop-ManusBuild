import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const androidApiKey = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
const entitlementId = "nourishloop_plus";
let configured = false;

export async function configureRevenueCat() {
  if (configured || Platform.OS === "web" || !androidApiKey) return Boolean(androidApiKey);
  Purchases.configure({ apiKey: androidApiKey });
  configured = true;
  return true;
}

export async function getPremiumStatus() {
  if (!(await configureRevenueCat())) return false;
  const customerInfo = await Purchases.getCustomerInfo();
  return typeof customerInfo.entitlements.active[entitlementId] !== "undefined";
}

export async function getCurrentOffering() {
  if (!(await configureRevenueCat())) return null;
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function purchaseRevenueCatPackage(packageToPurchase: Parameters<typeof Purchases.purchasePackage>[0]) {
  if (!(await configureRevenueCat())) {
    throw new Error("RevenueCat is not configured yet.");
  }
  const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
  return typeof customerInfo.entitlements.active[entitlementId] !== "undefined";
}

export async function restoreRevenueCatPurchases() {
  if (!(await configureRevenueCat())) return false;
  const customerInfo = await Purchases.restorePurchases();
  return typeof customerInfo.entitlements.active[entitlementId] !== "undefined";
}

export const revenueCatSetupReady = Boolean(androidApiKey);
