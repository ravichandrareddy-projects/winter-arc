import { initializeApp, getApps, getApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAnalytics, isSupported, logEvent, type Analytics } from "firebase/analytics";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBxmTFWIJCiNxGjbJy_nbBgcTX8AYmgv60",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "winterarc-b4e73.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "winterarc-b4e73",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "winterarc-b4e73.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "770510724543",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:770510724543:web:b08f9d0ff599419cab950a",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-P6NBGK099T",
};

// Initialize Firebase App as a safe singleton (prevents multi-instance errors during Next.js fast refresh)
export const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

let analyticsPromise: Promise<Analytics | null> | null = null;

/**
 * Client-safe accessor for Firebase Analytics.
 * In Next.js App Router, analytics cannot run server-side and requires indexedDB / browser window.
 */
export async function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return null;

  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => {
        if (supported) {
          return getAnalytics(app);
        }
        return null;
      })
      .catch((error) => {
        if (process.env.NODE_ENV === "development") {
          console.warn("[Firebase Analytics] initialization skipped or not supported:", error);
        }
        return null;
      });
  }

  return analyticsPromise;
}

/**
 * Log a custom event to Firebase Analytics / GA safely in any client component.
 */
export async function logAnalyticsEvent(
  eventName: string,
  eventParams?: Record<string, unknown>
): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics();
    if (analytics) {
      logEvent(analytics, eventName, eventParams);
      return;
    }
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.debug(`[Firebase Analytics] Event failed: ${eventName}`, error);
    }
  }

  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, eventParams);
  }
}
