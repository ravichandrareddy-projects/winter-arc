"use client";

import { useSyncExternalStore } from "react";
import { toDateKey } from "./dates";
import { useWinterArc, type ReminderKey } from "./store";

/**
 * Reminder scheduler (local-first, honest limits):
 * checks every 20s while the app is open; fires a browser Notification
 * if permission was granted, and always pings the bell badge.
 * Delivery needs the app open — no backend, no push.
 */

export interface FireEvent {
  key: ReminderKey;
  at: number;
}

let lastFire: FireEvent | null = null;
const listeners = new Set<() => void>();
let started = false;
const firedKeys = new Set<string>();

const COPY: Record<ReminderKey, { title: string; body: string }> = {
  wakeUp: { title: "Winter Arc — Wake Up", body: "Time to rise. Log your wake-up time." },
  sleep: { title: "Winter Arc — Wind Down", body: "Bedtime approaching. Log your sleep tonight." },
  meal: { title: "Winter Arc — Meal Time", body: "Don't forget to log your meal." },
  workout: { title: "Winter Arc — Workout", body: "Training window is here. Tick it off." },
  summary: { title: "Winter Arc — Daily Summary", body: "Review today's track before bed." },
};

export function subscribeReminderFire(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

export function getLastFire(): FireEvent | null {
  return lastFire;
}

export function dismissFire(): void {
  lastFire = null;
  listeners.forEach((cb) => cb());
}

export function useReminderFire(): FireEvent | null {
  return useSyncExternalStore(subscribeReminderFire, getLastFire, getLastFire);
}

export async function requestNotifyPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) return "denied";
  if (Notification.permission !== "default") return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return "denied";
  }
}

export interface ToastMessage {
  id: string;
  title: string;
  body: string;
  icon?: "bell" | "flame" | "target" | "check" | "sparkles";
  color?: string;
}

const toastListeners = new Set<(t: ToastMessage | null) => void>();
let activeToast: ToastMessage | null = null;
let toastTimer: number | null = null;

export function subscribeToast(cb: (t: ToastMessage | null) => void): () => void {
  toastListeners.add(cb);
  return () => {
    toastListeners.delete(cb);
  };
}

export function dispatchToast(toast: Omit<ToastMessage, "id"> & { id?: string }): void {
  const item: ToastMessage = {
    ...toast,
    id: toast.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
  activeToast = item;
  toastListeners.forEach((cb) => cb(activeToast));

  if (typeof window !== "undefined") {
    if (toastTimer) window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      dismissToast();
    }, 4000);
  }
}

export function dismissToast(): void {
  activeToast = null;
  toastListeners.forEach((cb) => cb(null));
}

function emit(key: ReminderKey, silent = false): void {
  lastFire = { key, at: Date.now() };
  listeners.forEach((cb) => cb());
  
  // Also push in-app interactive notification banner
  dispatchToast({
    title: COPY[key].title,
    body: COPY[key].body,
    icon: key === "workout" ? "flame" : key === "wakeUp" ? "sparkles" : "bell",
  });

  if (!silent && typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
    try {
      new Notification(COPY[key].title, { body: COPY[key].body });
    } catch {
      /* blocked — badge still pings */
    }
  }
}

/** Badge-only ping (no system notification) — used for catch-ups and tests. */
export function pingBadge(key: ReminderKey): void {
  emit(key, true);
}

export function startReminderLoop(): void {
  if (started || typeof window === "undefined") return;
  started = true;
  const tick = () => {
    const { reminders } = useWinterArc.getState();
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const stamp = `${toDateKey(now)} ${hh}:${mm}`;
    (Object.keys(reminders) as ReminderKey[]).forEach((key) => {
      const r = reminders[key];
      if (!r.enabled || r.time !== `${hh}:${mm}`) return;
      const k = `${key}@${stamp}`;
      if (firedKeys.has(k)) return;
      firedKeys.add(k);
      if (firedKeys.size > 64) {
        const first = firedKeys.values().next().value;
        if (first) firedKeys.delete(first);
      }
      emit(key);
    });
  };
  tick();
  window.setInterval(tick, 20000);

  // catch-up once per session: reminders whose time already passed today
  // light the bell badge (no system popups for missed ones)
  try {
    if (!window.sessionStorage.getItem("wa-caught")) {
      window.sessionStorage.setItem("wa-caught", "1");
      const now = new Date();
      const hhmm = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
      const { reminders } = useWinterArc.getState();
      (Object.keys(reminders) as ReminderKey[]).forEach((key) => {
        if (reminders[key].enabled && reminders[key].time < hhmm) {
          pingBadge(key);
        }
      });
    }
  } catch {
    /* storage blocked — scheduler still runs */
  }
}
