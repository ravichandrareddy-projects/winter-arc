import type { StartTab } from "./types";

/** Routes accepted from persisted preferences and auth continuation state. */
export const START_TABS: readonly StartTab[] = [
  "/",
  "/sleep",
  "/wake-up",
  "/fitness",
  "/food",
  "/progress",
];

export function isStartTab(value: unknown): value is StartTab {
  return typeof value === "string" && START_TABS.includes(value as StartTab);
}

/** Accept only same-origin absolute paths for values that may reach router.push/replace. */
export function safeInternalPath(value: unknown, fallback = "/"): string {
  if (typeof value !== "string" || value.length === 0 || value.length > 2048) return fallback;
  if (!value.startsWith("/") || value.startsWith("//") || /[\\\u0000-\u001f\u007f]/.test(value)) return fallback;
  try {
    const url = new URL(value, "https://winterarc.invalid");
    if (url.origin !== "https://winterarc.invalid") return fallback;
    return value;
  } catch {
    return fallback;
  }
}
