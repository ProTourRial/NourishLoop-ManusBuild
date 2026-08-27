/** Returns true only for RevenueCat Android public SDK keys. */
export function isAndroidRevenueCatPublicKey(value: string | undefined): value is string {
  return Boolean(value && value.startsWith("goog_"));
}
