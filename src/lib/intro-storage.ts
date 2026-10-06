"use client";

export const SEEN_INTRO_KEY = "wa-seen-intro";

/** Check whether user has entered the app / marked intro as seen */
export function getHasSeenIntro(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(SEEN_INTRO_KEY) === "1";
  } catch {
    return false;
  }
}

/** Set or clear the continuing user flag and dispatch sync events */
export function setHasSeenIntro(seen: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (seen) {
      window.localStorage.setItem(SEEN_INTRO_KEY, "1");
    } else {
      window.localStorage.removeItem(SEEN_INTRO_KEY);
    }
    // Notify both same-tab listeners and cross-tab listeners
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new CustomEvent("wa-seen-intro-changed", { detail: seen }));
  } catch {
    /* ignore storage quota or private browsing errors */
  }
}

/** Subscribe to local intro state changes */
export function subscribeIntroState(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", callback);
  window.addEventListener("wa-seen-intro-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("wa-seen-intro-changed", callback);
  };
}
