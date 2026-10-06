"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Arc,
  HomeView,
  Profile,
  Tracker,
  TrackerEntry,
  TrackerStatus,
} from "./types";
import {
  addDaysKey,
  dayOfWeek,
  isTrackerApplicable,
  nowISO,
  todayKey,
  uid,
} from "./dates";
import { CORE_TRACKER_DEFS } from "./core-trackers";
import { buildDemoBundle } from "./demo";
import {
  fetchUserData,
  pushArc,
  pushDelete,
  pushClearDay,
  pushEntry,
  pushMeal,
  pushPhotoMeta,
  pushPreferences,
  pushProfile,
  pushReminders,
  pushTargets,
  pushTracker,
} from "./sync";

export interface NewTrackerInput {
  name: string;
  type: Tracker["type"];
  target?: number;
  unit?: string;
  step?: number;
  frequency: Tracker["frequency"];
  startDate: string;
  endDate: string;
  allowMultiple?: boolean;
  icon?: Tracker["icon"];
  color?: string;
  category?: Tracker["category"];
}

export interface PhotoMeta {
  id: string;
  dateKey: string;
  angle: "front" | "side" | "back";
  createdAt: string;
}

export type MealSlot = "breakfast" | "lunch" | "dinner" | "snacks" | "custom";

export interface MealEntry {
  id: string;
  dateKey: string;
  slot: MealSlot;
  name: string;
  items: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  createdAt: string;
  updatedAt: string;
}

export interface NutritionTargets {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export const DEFAULT_NUTRITION_TARGETS: NutritionTargets = {
  calories: 2000,
  protein: 150,
  carbs: 220,
  fats: 70,
  fiber: 30,
};

export const MEAL_SLOTS: { slot: MealSlot; label: string }[] = [
  { slot: "breakfast", label: "Breakfast" },
  { slot: "lunch", label: "Lunch" },
  { slot: "snacks", label: "Snacks" },
  { slot: "dinner", label: "Dinner" },
  { slot: "custom", label: "Other" },
];

export interface NewMealInput {
  dateKey: string;
  slot: MealSlot;
  name: string;
  items: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
}

export type Accent = "blue" | "green" | "purple" | "orange";
export type Units = "metric" | "imperial";
export type StartTab = "/" | "/sleep" | "/wake-up" | "/fitness" | "/food" | "/progress";

export interface Preferences {
  accent: Accent;
  units: Units;
  startTab: StartTab;
}

export const DEFAULT_PREFERENCES: Preferences = {
  accent: "blue",
  units: "metric",
  startTab: "/",
};

export interface Reminder {
  time: string; // "HH:MM"
  enabled: boolean;
}

export interface Reminders {
  wakeUp: Reminder;
  sleep: Reminder;
  meal: Reminder;
  workout: Reminder;
  summary: Reminder;
}

export const DEFAULT_REMINDERS: Reminders = {
  wakeUp: { time: "05:00", enabled: false },
  sleep: { time: "22:30", enabled: false },
  meal: { time: "08:00", enabled: false },
  workout: { time: "18:00", enabled: false },
  summary: { time: "21:00", enabled: false },
};

export type ReminderKey = keyof Reminders;

export const REMINDER_META: { key: ReminderKey; label: string }[] = [
  { key: "wakeUp", label: "Wake Up Reminder" },
  { key: "sleep", label: "Sleep Reminder" },
  { key: "meal", label: "Meal Reminder" },
  { key: "workout", label: "Workout Reminder" },
  { key: "summary", label: "Progress Summary (Daily)" },
];

interface WinterArcState {
  arc: Arc | null;
  profile: Profile;
  trackers: Tracker[];
  entries: TrackerEntry[];
  photoMeta: PhotoMeta[];
  meals: MealEntry[];
  nutritionTargets: NutritionTargets;
  preferences: Preferences;
  reminders: Reminders;
  selectedDate: string;
  view: HomeView;

  ensureSeed: () => void;
  setSelectedDate: (d: string) => void;
  setView: (v: HomeView) => void;
  setProfile: (p: Partial<Profile>) => void;
  /** null = visitor demo; set on login. Persisted to isolate accounts. */
  ownerUid: string | null;
  dataMode: "demo" | "user";
  /** session-only flag (never persisted) */
  demoLoaded: boolean;
  setOwnerUid: (uid: string | null) => void;
  loadDemo: () => void;
  loadUserData: (uid: string, email: string, displayName: string) => Promise<void>;
  setArcDates: (startDate: string, endDate: string) => void;
  setPreferences: (p: Partial<Preferences>) => void;
  setReminder: (key: ReminderKey, patch: Partial<Reminder>) => void;

  addTracker: (input: NewTrackerInput) => Tracker;
  updateTracker: (id: string, patch: Partial<Tracker>) => void;
  setTrackerStatus: (id: string, status: TrackerStatus) => void;
  reorderTrackers: (orderedIds: string[]) => void;

  logSingle: (
    trackerId: string,
    date: string,
    value: number | string | boolean,
    completed?: boolean,
    slot?: string
  ) => void;
  addSubEntry: (
    trackerId: string,
    date: string,
    amount: number,
    slot?: string
  ) => void;
  /** stepper: + adds step, − removes last sub-entry (or decrements single) */
  nudge: (trackerId: string, date: string, dir: 1 | -1, slot?: string) => void;
  /** timetable cell toggle */
  toggleSlot: (trackerId: string, date: string, slot: string) => void;
  toggleBoolean: (trackerId: string, date: string, slot?: string) => void;
  deleteEntry: (entryId: string) => void;
  clearDayEntry: (trackerId: string, date: string) => void;
  addPhotoMeta: (dateKey: string, angle: PhotoMeta["angle"]) => PhotoMeta;
  updatePhotoMeta: (id: string, patch: Partial<PhotoMeta>) => void;
  deletePhotoMeta: (id: string) => void;
  addMeal: (input: NewMealInput) => MealEntry;
  updateMeal: (id: string, patch: Partial<MealEntry>) => void;
  deleteMeal: (id: string) => void;
  setNutritionTargets: (t: Partial<NutritionTargets>) => void;
  /** Replace all user data (restore from backup). */
  restoreAll: (data: BackupData) => void;
  /** Wipe in-memory state (storage cleared separately). */
  wipeAll: () => void;
}

export interface BackupData {
  arc: Arc | null;
  profile: Profile;
  trackers: Tracker[];
  entries: TrackerEntry[];
  photoMeta: PhotoMeta[];
  meals: MealEntry[];
  nutritionTargets: NutritionTargets;
  preferences: Preferences;
  reminders: Reminders;
}

function nextSortOrder(trackers: Tracker[]): number {
  return trackers.reduce((m, t) => Math.max(m, t.sortOrder), -1) + 1;
}

const TRACKER_COLORS: Record<string, string> = {
  droplet: "#38bdf8",
  beef: "#fb7185",
  footprints: "#4ade80",
  dumbbell: "#fb923c",
  book: "#a78bfa",
  moon: "#818cf8",
  sun: "#fbbf24",
  utensils: "#fb923c",
  leaf: "#4ade80",
  alarm: "#f472b6",
  bike: "#22d3ee",
  scale: "#34d399",
  flame: "#fb7185",
  activity: "#a78bfa",
  heart: "#f87171",
};

export function colorForIcon(icon: Tracker["icon"]): string {
  return TRACKER_COLORS[icon] ?? "#38bdf8";
}

export const useWinterArc = create<WinterArcState>()(
  persist(
    (set, get) => {
      /** fire-and-forget Supabase sync; no-op for visitors (demo never persists). */
      const sync = (run: (uid: string) => Promise<void>): void => {
        const uid = get().ownerUid;
        if (uid) void run(uid);
      };
      const arcId = (): string | null => get().arc?.id ?? null;
      return {
      arc: null,
      profile: { name: "Your Name", email: "" },
      trackers: [],
      entries: [],
      photoMeta: [],
      meals: [],
      nutritionTargets: { ...DEFAULT_NUTRITION_TARGETS },
      preferences: { ...DEFAULT_PREFERENCES },
      reminders: { ...DEFAULT_REMINDERS },
      selectedDate: todayKey(),
      view: "cards",
      ownerUid: null,
      dataMode: "demo",
      demoLoaded: false,

      ensureSeed: () => {
        // Visitors get the fresh demo bundle starting today on Day 1.
        // Authed users are filled by loadUserData() instead.
        const s = get();
        if (
          s.dataMode === "demo" &&
          (!s.demoLoaded || s.trackers.length === 0 || (s.arc && s.arc.startDate !== todayKey()))
        ) {
          get().loadDemo();
        } else if (!s.demoLoaded) {
          set({ demoLoaded: true });
        }
      },

      setOwnerUid: (uid) => set({ ownerUid: uid }),

      loadDemo: () => {
        const bundle = buildDemoBundle();
        set({
          arc: {
            id: "demo-arc",
            startDate: bundle.trackers[0]?.startDate ?? todayKey(),
            endDate: bundle.trackers[0]?.endDate ?? todayKey(),
            createdAt: nowISO(),
          },
          profile: { name: "Guest", email: "" },
          trackers: bundle.trackers,
          entries: bundle.entries,
          photoMeta: [],
          meals: bundle.meals,
          nutritionTargets: bundle.targets,
          preferences: { ...DEFAULT_PREFERENCES },
          reminders: { ...DEFAULT_REMINDERS },
          selectedDate: todayKey(),
          ownerUid: null,
          dataMode: "demo",
          demoLoaded: true,
        });
      },

      loadUserData: async (uid, email, displayName) => {
        const start = todayKey();
        const bundle = await fetchUserData(
          uid,
          email,
          displayName,
          CORE_TRACKER_DEFS,
          start,
          addDaysKey(start, 89)
        );
        set({
          arc: bundle.arc,
          profile: bundle.profile,
          trackers: bundle.trackers,
          entries: bundle.entries,
          photoMeta: bundle.photoMeta,
          meals: bundle.meals,
          nutritionTargets: bundle.targets,
          preferences: bundle.preferences,
          reminders: bundle.reminders,
          selectedDate: todayKey(),
          ownerUid: uid,
          dataMode: "user",
          demoLoaded: true,
        });
      },

      setSelectedDate: (d) => set({ selectedDate: d }),
      setView: (v) => set({ view: v }),
      setProfile: (p) => {
        set((s) => ({ profile: { ...s.profile, ...p } }));
        sync((uid) => pushProfile(uid, get().profile));
      },

      addTracker: (input) => {
        const t: Tracker = {
          id: uid(),
          name: input.name.trim(),
          type: input.type,
          target: input.target,
          unit: input.unit?.trim() || undefined,
          step: input.step && input.step > 0 ? input.step : 1,
          frequency: input.frequency,
          startDate: input.startDate,
          endDate: input.endDate,
          allowMultiple: input.allowMultiple ?? true,
          icon: input.icon ?? "heart",
          color: input.color ?? colorForIcon(input.icon ?? "heart"),
          category: input.category ?? "custom",
          status: "active",
          sortOrder: nextSortOrder(get().trackers),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        set((s) => ({ trackers: [...s.trackers, t] }));
        sync((uid) => pushTracker(uid, t, arcId()));
        return t;
      },

      updateTracker: (id, patch) => {
        set((s) => ({
          trackers: s.trackers.map((t) =>
            t.id === id
              ? {
                  ...t,
                  ...patch,
                  color:
                    patch.icon && !patch.color
                      ? colorForIcon(patch.icon)
                      : (patch.color ?? t.color),
                  updatedAt: nowISO(),
                }
              : t
          ),
        }));
        const t = get().trackers.find((x) => x.id === id);
        if (t) sync((uid) => pushTracker(uid, t, arcId()));
      },

      setTrackerStatus: (id, status) => {
        set((s) => ({
          trackers: s.trackers.map((t) =>
            t.id === id ? { ...t, status, updatedAt: nowISO() } : t
          ),
        }));
        const t = get().trackers.find((x) => x.id === id);
        if (t) sync((uid) => pushTracker(uid, t, arcId()));
      },

      reorderTrackers: (orderedIds) => {
        set((s) => ({
          trackers: orderedIds
            .map((id, i) => {
              const t = s.trackers.find((x) => x.id === id);
              return t ? { ...t, sortOrder: i, updatedAt: nowISO() } : undefined;
            })
            .filter((x): x is Tracker => !!x)
            .concat(
              s.trackers
                .filter((t) => !orderedIds.includes(t.id))
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map((t, i) => ({ ...t, sortOrder: orderedIds.length + i }))
            ),
        }));
        const all = get().trackers;
        sync(async (uid) => {
          for (const t of all) await pushTracker(uid, t, get().arc?.id ?? null);
        });
      },

      logSingle: (trackerId, date, value, completed, slot) => {
        const tracker = get().trackers.find((t) => t.id === trackerId);
        if (!tracker) return;
        const isDone =
          completed ??
          (typeof value === "boolean"
            ? value
            : typeof value === "number"
              ? tracker.target != null
                ? value >= tracker.target
                : value > 0
              : String(value).length > 0);
        const removed = get().entries
          .filter((e) => e.trackerId === trackerId && e.date === date)
          .map((e) => e.id);
        const entry: TrackerEntry = {
          id: uid(),
          trackerId,
          date,
          value,
          completed: isDone,
          slot,
          targetSnapshot: tracker.target,
          unitSnapshot: tracker.unit,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        set((s) => ({
          entries: [
            ...s.entries.filter((e) => !(e.trackerId === trackerId && e.date === date)),
            entry,
          ],
        }));
        sync(async (uid) => {
          await pushEntry(uid, entry);
          for (const id of removed) {
            if (id !== entry.id) await pushDelete("tracker_entries", uid, id);
          }
        });
      },

      addSubEntry: (trackerId, date, amount, slot) => {
        const tracker = get().trackers.find((t) => t.id === trackerId);
        if (!tracker || !Number.isFinite(amount) || amount === 0) return;
        const entry: TrackerEntry = {
          id: uid(),
          trackerId,
          date,
          value: amount,
          completed: false,
          slot,
          targetSnapshot: tracker.target,
          unitSnapshot: tracker.unit,
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        set((s) => ({ entries: [...s.entries, entry] }));
        sync((uid) => pushEntry(uid, entry));
      },

      nudge: (trackerId, date, dir, slot) => {
        const s = get();
        const tracker = s.trackers.find((t) => t.id === trackerId);
        if (!tracker || tracker.type === "boolean" || tracker.type === "time") return;
        const dayEntries = s.entries.filter(
          (e) => e.trackerId === trackerId && e.date === date
        );
        if (dir === 1) {
          s.addSubEntry(trackerId, date, tracker.step, slot);
          return;
        }
        // dir === -1
        if (tracker.allowMultiple && dayEntries.length > 0) {
          const last = [...dayEntries].sort((a, b) =>
            a.createdAt < b.createdAt ? 1 : -1
          )[0];
          if (typeof last.value === "number" && last.value > tracker.step) {
            const next = +((last.value as number) - tracker.step).toFixed(2);
            set((st) => ({
              entries: st.entries.map((e) =>
                e.id === last.id
                  ? { ...e, value: next, updatedAt: nowISO() }
                  : e
              ),
            }));
            const updated = get().entries.find((e) => e.id === last.id);
            if (updated) sync((uid) => pushEntry(uid, updated));
          } else {
            s.deleteEntry(last.id);
          }
        } else if (dayEntries.length > 0 && typeof dayEntries[0].value === "number") {
          const v = +((dayEntries[0].value as number) - tracker.step).toFixed(2);
          if (v <= 0) s.clearDayEntry(trackerId, date);
          else s.logSingle(trackerId, date, v);
        }
      },

      toggleSlot: (trackerId, date, slot) => {
        const s = get();
        const tracker = s.trackers.find((t) => t.id === trackerId);
        if (!tracker) return;
        const existing = s.entries.find(
          (e) => e.trackerId === trackerId && e.date === date && e.slot === slot
        );
        if (existing) {
          s.deleteEntry(existing.id);
          return;
        }
        if (tracker.type === "boolean") {
          s.logSingle(trackerId, date, true, true, slot);
        } else if (tracker.type === "time" || tracker.type === "meals") {
          return; // time uses picker, meals uses stepper/log
        } else {
          s.addSubEntry(trackerId, date, tracker.step, slot);
        }
      },

      toggleBoolean: (trackerId, date, slot) => {
        const s = get();
        const dayEntries = s.entries.filter(
          (e) => e.trackerId === trackerId && e.date === date
        );
        const done = dayEntries.some((e) => e.value === true);
        if (!done) s.logSingle(trackerId, date, true, true, slot);
        else s.clearDayEntry(trackerId, date);
      },

      deleteEntry: (entryId) => {
        set((s) => ({ entries: s.entries.filter((e) => e.id !== entryId) }));
        sync((uid) => pushDelete("tracker_entries", uid, entryId));
      },

      clearDayEntry: (trackerId, date) => {
        set((s) => ({
          entries: s.entries.filter(
            (e) => !(e.trackerId === trackerId && e.date === date)
          ),
        }));
        sync((uid) => pushClearDay(uid, trackerId, date));
      },

      addPhotoMeta: (dateKey, angle) => {
        const meta: PhotoMeta = { id: uid(), dateKey, angle, createdAt: nowISO() };
        set((s) => ({ photoMeta: [...s.photoMeta, meta] }));
        sync((uid) => pushPhotoMeta(uid, meta));
        return meta;
      },

      updatePhotoMeta: (id, patch) => {
        set((s) => ({
          photoMeta: s.photoMeta.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
        const p = get().photoMeta.find((x) => x.id === id);
        if (p) sync((uid) => pushPhotoMeta(uid, p));
      },

      deletePhotoMeta: (id) => {
        set((s) => ({ photoMeta: s.photoMeta.filter((p) => p.id !== id) }));
        sync((uid) => pushDelete("photo_meta", uid, id));
      },

      addMeal: (input) => {
        const meal: MealEntry = {
          ...input,
          name: input.name.trim() || "Meal",
          items: input.items.trim(),
          id: uid(),
          createdAt: nowISO(),
          updatedAt: nowISO(),
        };
        set((s) => ({ meals: [...s.meals, meal] }));
        sync((uid) => pushMeal(uid, meal));
        return meal;
      },

      updateMeal: (id, patch) => {
        set((s) => ({
          meals: s.meals.map((m) =>
            m.id === id ? { ...m, ...patch, updatedAt: nowISO() } : m
          ),
        }));
        const m = get().meals.find((x) => x.id === id);
        if (m) sync((uid) => pushMeal(uid, m));
      },

      deleteMeal: (id) => {
        set((s) => ({ meals: s.meals.filter((m) => m.id !== id) }));
        sync((uid) => pushDelete("meals", uid, id));
      },

      setNutritionTargets: (t) => {
        set((s) => ({ nutritionTargets: { ...s.nutritionTargets, ...t } }));
        sync((uid) => pushTargets(uid, get().nutritionTargets));
      },

      restoreAll: (data) =>
        set({
          arc: data.arc,
          profile: data.profile,
          trackers: data.trackers ?? [],
          entries: data.entries ?? [],
          photoMeta: data.photoMeta ?? [],
          meals: data.meals ?? [],
          nutritionTargets: data.nutritionTargets ?? { ...DEFAULT_NUTRITION_TARGETS },
          preferences: data.preferences ?? { ...DEFAULT_PREFERENCES },
          reminders: data.reminders ?? { ...DEFAULT_REMINDERS },
          selectedDate: todayKey(),
        }),

      wipeAll: () =>
        set({
          arc: null,
          profile: { name: "", email: "" },
          trackers: [],
          entries: [],
          photoMeta: [],
          meals: [],
          nutritionTargets: { ...DEFAULT_NUTRITION_TARGETS },
          preferences: { ...DEFAULT_PREFERENCES },
          reminders: { ...DEFAULT_REMINDERS },
          selectedDate: todayKey(),
          view: "cards",
          ownerUid: null,
          dataMode: "demo",
          demoLoaded: false,
        }),

      setArcDates: (startDate, endDate) => {
        set((s) => ({
          arc: s.arc ? { ...s.arc, startDate, endDate } : s.arc,
        }));
        const a = get().arc;
        if (a) sync((uid) => pushArc(uid, a));
      },

      setPreferences: (p) => {
        set((s) => ({ preferences: { ...s.preferences, ...p } }));
        sync((uid) => pushPreferences(uid, get().preferences));
      },

      setReminder: (key, patch) => {
        set((s) => ({
          reminders: { ...s.reminders, [key]: { ...s.reminders[key], ...patch } },
        }));
        sync((uid) => pushReminders(uid, get().reminders));
      },
      };
    },
    {
      name: "winterarc-v2",
      version: 4,
      migrate: (persisted: unknown) => {
        // v4: clean slate — drop all stored data, keep nothing.
        // (Older versions carried demo seed content.)
        void persisted;
        return {};
      },
      // Never merge another account's (or demo) rows: owner must match.
      merge: (persisted, current) => {
        try {
          const p = persisted as Partial<WinterArcState>;
          if (!p || p.ownerUid !== current.ownerUid) return current;
          return { ...current, ...p };
        } catch {
          // Corrupt persisted data — start fresh.
          return current;
        }
      },
      partialize: (s) => ({
        arc: s.arc,
        profile: s.profile,
        trackers: s.trackers,
        entries: s.entries,
        photoMeta: s.photoMeta,
        meals: s.meals,
        nutritionTargets: s.nutritionTargets,
        preferences: s.preferences,
        reminders: s.reminders,
        selectedDate: s.selectedDate,
        view: s.view,
        ownerUid: s.ownerUid,
        dataMode: s.dataMode,
      }),
    }
  )
);

/* ---------------- selectors: Home, Track, Progress share these ---------------- */

export function selectTrackersForDate(
  trackers: Tracker[],
  dateKey: string
): Tracker[] {
  return trackers
    .filter((t) => isTrackerApplicable(t, dateKey))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function selectEntriesFor(
  entries: TrackerEntry[],
  trackerId: string,
  dateKey: string
): TrackerEntry[] {
  return entries.filter((e) => e.trackerId === trackerId && e.date === dateKey);
}

export function selectDailyTotal(tracker: Tracker, dayEntries: TrackerEntry[]): number {
  if (dayEntries.length === 0) return 0;
  if (tracker.type === "boolean") return dayEntries.some((e) => e.value === true) ? 1 : 0;
  if (tracker.type === "time") return 0;
  if (tracker.allowMultiple) {
    return dayEntries.reduce(
      (sum, e) => sum + (typeof e.value === "number" ? e.value : 0),
      0
    );
  }
  const v = dayEntries[0].value;
  return typeof v === "number" ? v : 0;
}

export function selectIsCompleted(tracker: Tracker, dayEntries: TrackerEntry[]): boolean {
  if (dayEntries.length === 0) return false;
  if (tracker.type === "boolean") return dayEntries.some((e) => e.value === true);
  if (tracker.type === "time") return dayEntries.some((e) => e.completed);
  if (tracker.type === "meals") {
    const total = selectDailyTotal(tracker, dayEntries);
    return tracker.target != null ? total >= tracker.target : total > 0;
  }
  const total = selectDailyTotal(tracker, dayEntries);
  if (tracker.target != null && tracker.target > 0) return total >= tracker.target;
  return dayEntries.some((e) => e.completed);
}

export function selectProgressPct(tracker: Tracker, dayEntries: TrackerEntry[]): number {
  if (tracker.type === "boolean" || tracker.type === "time") {
    return selectIsCompleted(tracker, dayEntries) ? 100 : 0;
  }
  if (tracker.target == null || tracker.target <= 0) {
    return selectDailyTotal(tracker, dayEntries) > 0 ? 100 : 0;
  }
  return Math.min(100, Math.round((selectDailyTotal(tracker, dayEntries) / tracker.target) * 100));
}

export interface DayPoint {
  date: string;
  total: number;
  completed: boolean;
  target?: number;
}

/** Chronological history. Missing dates omitted — gaps stay gaps. */
export function selectHistory(tracker: Tracker, entries: TrackerEntry[]): DayPoint[] {
  const byDate = new Map<string, TrackerEntry[]>();
  for (const e of entries) {
    if (e.trackerId !== tracker.id) continue;
    const list = byDate.get(e.date) ?? [];
    list.push(e);
    byDate.set(e.date, list);
  }
  return [...byDate.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([date, list]) => ({
      date,
      total: selectDailyTotal(tracker, list),
      completed: selectIsCompleted(tracker, list),
      target: list[0]?.targetSnapshot ?? tracker.target,
    }));
}

/** Last N days ending at `endKey` (oldest → newest), with totals (0 when missing). */
export function selectLastNDays(
  tracker: Tracker,
  entries: TrackerEntry[],
  endKey: string,
  n: number
): DayPoint[] {
  const out: DayPoint[] = [];
  for (let back = n - 1; back >= 0; back--) {
    const d = addDaysKey(endKey, -back);
    const list = selectEntriesFor(entries, tracker.id, d);
    out.push({
      date: d,
      total: selectDailyTotal(tracker, list),
      completed: selectIsCompleted(tracker, list),
      target: tracker.target,
    });
  }
  return out;
}

/** Overall day completion across applicable trackers (time/boolean count, numeric by target). */
export function selectDayCompletion(
  trackers: Tracker[],
  entries: TrackerEntry[],
  dateKey: string
): { done: number; total: number; pct: number } {
  const visible = selectTrackersForDate(trackers, dateKey);
  const done = visible.filter((t) =>
    selectIsCompleted(t, selectEntriesFor(entries, t.id, dateKey))
  ).length;
  return {
    done,
    total: visible.length,
    pct: visible.length === 0 ? 0 : Math.round((done / visible.length) * 100),
  };
}

export function weekdayLetter(key: string): string {
  return ["S", "M", "T", "W", "T", "F", "S"][dayOfWeek(key)];
}

/* ---------------- sleep: minutes, bands, stats ---------------- */

/** "22:30" -> minutes since baseline hour (handles past-midnight wrap). */
export function bedtimeMinutes(hhmm: string, baseHour = 19): number | null {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  const abs = h * 60 + m;
  const base = baseHour * 60;
  return abs >= base ? abs - base : abs + 1440 - base;
}

/** minutes-since-baseline -> absolute "HH:MM". */
export function minutesToHHMM(minsSinceBase: number, baseHour = 19): string {
  const abs = (baseHour * 60 + Math.round(minsSinceBase)) % 1440;
  return `${String(Math.floor(abs / 60)).padStart(2, "0")}:${String(abs % 60).padStart(2, "0")}`;
}

export type SleepBand = "great" | "okay" | "late" | "bad" | "offhours";

export const SLEEP_BAND_COLORS: Record<SleepBand, string> = {
  great: "#4ade80", // by 10 PM
  okay: "#facc15", // 10–11 PM
  late: "#38bdf8", // 11 PM–12 AM
  bad: "#f87171", // after midnight
  offhours: "#94a3b8", // daytime
};

/** Band for absolute minutes-since-midnight. */
export function sleepBand(absMinutes: number): SleepBand {
  if (absMinutes >= 19 * 60 && absMinutes <= 22 * 60) return "great";
  if (absMinutes > 22 * 60 && absMinutes <= 23 * 60) return "okay";
  if (absMinutes > 23 * 60 && absMinutes < 24 * 60) return "late";
  if (absMinutes >= 0 && absMinutes < 6 * 60) return "bad";
  return "offhours";
}

export const WAKE_BAND_COLORS: Record<SleepBand, string> = {
  great: "#4ade80", // up by 5:30 AM
  okay: "#facc15", // 5:30–6:30 AM
  late: "#fb923c", // 6:30–7:30 AM
  bad: "#f87171", // after 7:30 AM
  offhours: "#94a3b8",
};

/** Morning band for absolute minutes-since-midnight. */
export function wakeBand(absMinutes: number): SleepBand {
  if (absMinutes >= 3 * 60 && absMinutes <= 5 * 60 + 30) return "great";
  if (absMinutes > 5 * 60 + 30 && absMinutes <= 6 * 60 + 30) return "okay";
  if (absMinutes > 6 * 60 + 30 && absMinutes <= 7 * 60 + 30) return "late";
  if (absMinutes > 7 * 60 + 30 && absMinutes < 12 * 60) return "bad";
  return "offhours";
}

export interface SleepStats {
  count: number;
  average: string | null; // "HH:MM"
  earliest: string | null;
  latest: string | null;
  consistency: number; // % of nights within ±60 min of average
}

function circularDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 1440;
  return d > 720 ? 1440 - d : d;
}

/** Stats over bedtime "HH:MM" values. Average is a circular mean (midnight-safe). */
export function sleepStats(values: string[]): SleepStats {
  const abs: number[] = [];
  for (const v of values) {
    const [h, m] = v.split(":").map(Number);
    if (Number.isFinite(h) && Number.isFinite(m)) abs.push(h * 60 + m);
  }
  if (abs.length === 0) {
    return { count: 0, average: null, earliest: null, latest: null, consistency: 0 };
  }
  // circular mean on 24h clock
  let sx = 0;
  let sy = 0;
  for (const a of abs) {
    const ang = (a / 1440) * 2 * Math.PI;
    sx += Math.cos(ang);
    sy += Math.sin(ang);
  }
  let avgAbs = (Math.atan2(sy / abs.length, sx / abs.length) / (2 * Math.PI)) * 1440;
  if (avgAbs < 0) avgAbs += 1440;
  // earliest/latest in evening order (minutes since 19:00 baseline)
  const rel = abs.map((a) => (a >= 19 * 60 ? a - 19 * 60 : a + 1440 - 19 * 60));
  const earliest = Math.min(...rel);
  const latest = Math.max(...rel);
  const within = abs.filter((a) => circularDistance(a, avgAbs) <= 60).length;
  const toHHMM = (a: number) => {
    const t = ((Math.round(a) % 1440) + 1440) % 1440;
    return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  };
  return {
    count: abs.length,
    average: toHHMM(Math.round(avgAbs)),
    earliest: toHHMM((19 * 60 + earliest) % 1440),
    latest: toHHMM((19 * 60 + latest) % 1440),
    consistency: Math.round((within / abs.length) * 100),
  };
}

/** Bedtime value logged for a tracker on a date (time trackers store one "HH:MM"). */
export function selectBedtime(
  entries: TrackerEntry[],
  trackerId: string,
  dateKey: string
): string | null {
  const list = selectEntriesFor(entries, trackerId, dateKey);
  const v = list.find((e) => typeof e.value === "string")?.value;
  return typeof v === "string" && /^\d{1,2}:\d{2}/.test(v) ? v.slice(0, 5) : null;
}

/* ---------------- progress ---------------- */

function hhmmToMin(v: string): number | null {
  const [h, m] = v.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return null;
  return h * 60 + m;
}

function findTracker(trackers: Tracker[], name: string): Tracker | undefined {
  return trackers.find((t) => t.name.toLowerCase() === name.toLowerCase());
}

/** Sleep duration in hours = wake-up minus bedtime (mod 24). Null if either missing. */
export function sleepDurationHours(
  entries: TrackerEntry[],
  trackers: Tracker[],
  dateKey: string
): number | null {
  const sleep = findTracker(trackers, "sleep");
  const wake = findTracker(trackers, "wake up") ?? findTracker(trackers, "wake-up");
  if (!sleep || !wake) return null;
  const bed = selectBedtime(entries, sleep.id, dateKey);
  const up = selectBedtime(entries, wake.id, dateKey);
  if (!bed || !up) return null;
  const b = hhmmToMin(bed);
  const w = hhmmToMin(up);
  if (b == null || w == null) return null;
  return +(((w - b + 1440) % 1440) / 60).toFixed(2);
}

/** Wake-up minutes since midnight. Null if missing. */
export function wakeMinutes(
  entries: TrackerEntry[],
  trackers: Tracker[],
  dateKey: string
): number | null {
  const wake = findTracker(trackers, "wake up") ?? findTracker(trackers, "wake-up");
  if (!wake) return null;
  const up = selectBedtime(entries, wake.id, dateKey);
  return up ? hhmmToMin(up) : null;
}

function avg(nums: number[]): number | null {
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

/** Fixed N-day window ending at endKey (oldest → newest keys). */
export function windowKeys(endKey: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDaysKey(endKey, i - (n - 1)));
}

export interface Delta {
  text: string;
  good: boolean | null; // null = flat / no data
}

/**
 * This-window vs previous-window delta.
 * goodDirection: "up" (higher better: consistency, steps) or "down" (lower better: wake time, weight).
 */
export function delta(
  cur: number | null,
  prev: number | null,
  format: (v: number) => string,
  goodDirection: "up" | "down"
): Delta {
  if (cur == null || prev == null) return { text: "—", good: null };
  const d = cur - prev;
  if (Math.abs(d) < 1e-9) return { text: "±0", good: null };
  const sign = d > 0 ? "+" : "−";
  const good = goodDirection === "up" ? d > 0 : d < 0;
  return { text: `${sign}${format(Math.abs(d))}`, good };
}

/** % completed tracker-days over [fromKey..toKey] (applicable only). */
export function consistencyPct(
  trackers: Tracker[],
  entries: TrackerEntry[],
  fromKey: string,
  toKey: string
): number | null {
  let done = 0;
  let total = 0;
  for (let d = fromKey; d <= toKey; d = addDaysKey(d, 1)) {
    for (const t of selectTrackersForDate(trackers, d)) {
      total += 1;
      if (selectIsCompleted(t, selectEntriesFor(entries, t.id, d))) done += 1;
    }
  }
  if (total === 0) return null;
  return (done / total) * 100;
}

/** Same but restricted to a category (fitness). */
export function categoryConsistencyPct(
  trackers: Tracker[],
  entries: TrackerEntry[],
  fromKey: string,
  toKey: string,
  category: Tracker["category"]
): number | null {
  return consistencyPct(
    trackers.filter((t) => t.category === category),
    entries,
    fromKey,
    toKey
  );
}

/** % of days with calories within ±20% of target and 3+ meals. */
export function foodHealthyPct(
  meals: MealEntry[],
  targets: NutritionTargets,
  fromKey: string,
  toKey: string
): number | null {
  let healthy = 0;
  let total = 0;
  for (let d = fromKey; d <= toKey; d = addDaysKey(d, 1)) {
    const t = dayNutrition(meals, d);
    if (t.count === 0) continue;
    total += 1;
    const lo = targets.calories * 0.8;
    const hi = targets.calories * 1.2;
    if (t.count >= 3 && t.calories >= lo && t.calories <= hi) healthy += 1;
  }
  if (total === 0) return null;
  return (healthy / total) * 100;
}

/** Chunks [arcStart..endKey] into size-day windows (W1, W2…). */
export function weekWindows(
  arcStart: string,
  endKey: string,
  size: 7 | 30
): { from: string; to: string; label: string; sub: string }[] {
  const out: { from: string; to: string; label: string; sub: string }[] = [];
  let i = 1;
  for (let from = arcStart; from <= endKey; from = addDaysKey(from, size), i++) {
    let to = addDaysKey(from, size - 1);
    if (to > endKey) to = endKey;
    out.push({
      from,
      to,
      label: size === 7 ? `W${i}` : `M${i}`,
      sub: `${monthDayShort(from)}-${monthDayShort(to)}`,
    });
  }
  return out;
}

function monthDayShort(key: string): string {
  const [, m, d] = key.split("-").map(Number);
  const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${names[m - 1]} ${d}`;
}

/** Per-day completion ratio 0..1 for a heatmap row, or null when nothing applies/logged. */
export function heatValue(
  kind: "sleep" | "wake" | "fitness" | "food",
  trackers: Tracker[],
  entries: TrackerEntry[],
  meals: MealEntry[],
  targets: NutritionTargets,
  dateKey: string
): number | null {
  if (kind === "sleep") {
    const t = findTracker(trackers, "sleep");
    if (!t) return null;
    return selectBedtime(entries, t.id, dateKey) ? 1 : 0;
  }
  if (kind === "wake") {
    const t = findTracker(trackers, "wake up") ?? findTracker(trackers, "wake-up");
    if (!t) return null;
    return selectBedtime(entries, t.id, dateKey) ? 1 : 0;
  }
  if (kind === "fitness") {
    const ft = trackers.filter((t) => t.category === "fitness" && t.status === "active");
    const app = ft.filter(
      (t) => dateKey >= t.startDate && dateKey <= t.endDate && isTrackerApplicable(t, dateKey)
    );
    if (app.length === 0) return null;
    const done = app.filter((t) => selectIsCompleted(t, selectEntriesFor(entries, t.id, dateKey))).length;
    return done / app.length;
  }
  const t = dayNutrition(meals, dateKey);
  if (t.count === 0) return 0;
  const lo = targets.calories * 0.8;
  const hi = targets.calories * 1.2;
  if (t.count >= 3 && t.calories >= lo && t.calories <= hi) return 1;
  return 0.45;
}

export type NutritionMetric = "calories" | "protein" | "carbs" | "fats" | "fiber";

const SLOT_ORDER: MealSlot[] = ["breakfast", "lunch", "snacks", "dinner", "custom"];

export function mealsFor(meals: MealEntry[], dateKey: string): MealEntry[] {
  return meals
    .filter((m) => m.dateKey === dateKey)
    .sort(
      (a, b) =>
        SLOT_ORDER.indexOf(a.slot) - SLOT_ORDER.indexOf(b.slot) ||
        (a.createdAt < b.createdAt ? -1 : 1)
    );
}

export interface DayNutrition {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  count: number;
}

export function dayNutrition(meals: MealEntry[], dateKey: string): DayNutrition {
  const out: DayNutrition = { calories: 0, protein: 0, carbs: 0, fats: 0, fiber: 0, count: 0 };
  for (const m of meals) {
    if (m.dateKey !== dateKey) continue;
    out.calories += m.calories;
    out.protein += m.protein;
    out.carbs += m.carbs;
    out.fats += m.fats;
    out.fiber += m.fiber;
    out.count += 1;
  }
  return out;
}

/** Daily sums for a metric over N days ending at endKey. Null = no meals (gap, not zero). */
export function nutritionSeries(
  meals: MealEntry[],
  metric: NutritionMetric,
  endKey: string,
  n: number
): (number | null)[] {
  const out: (number | null)[] = [];
  for (let back = n - 1; back >= 0; back--) {
    const d = addDaysKey(endKey, -back);
    const has = meals.some((m) => m.dateKey === d);
    if (!has) {
      out.push(null);
      continue;
    }
    const t = dayNutrition(meals, d);
    out.push(+t[metric].toFixed(1));
  }
  return out;
}
