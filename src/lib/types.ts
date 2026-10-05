export type TrackerType =
  | "boolean"
  | "numeric"
  | "quantity"
  | "duration"
  | "time"
  | "custom"
  | "meals";

export type FrequencyKind = "daily" | "weekdays" | "weekends" | "custom";

export interface Frequency {
  kind: FrequencyKind;
  days?: number[]; // 0=Sun … 6=Sat, when kind==='custom'
}

export type TrackerStatus = "active" | "paused" | "archived";

export type TrackerCategory =
  | "hydration"
  | "food"
  | "fitness"
  | "sleep"
  | "study"
  | "mind"
  | "custom";

export type TrackerIcon =
  | "droplet"
  | "beef"
  | "footprints"
  | "dumbbell"
  | "book"
  | "moon"
  | "sun"
  | "utensils"
  | "leaf"
  | "alarm"
  | "bike"
  | "scale"
  | "flame"
  | "activity"
  | "heart";

export interface Tracker {
  id: string;
  name: string;
  type: TrackerType;
  target?: number;
  unit?: string;
  /** stepper increment, e.g. Water 0.5, Steps 500 */
  step: number;
  frequency: Frequency;
  startDate: string; // YYYY-MM-DD local
  endDate: string;
  allowMultiple: boolean;
  icon: TrackerIcon;
  color: string; // hex used for icon + bar
  category: TrackerCategory;
  /** sleep/wake grid window, "HH:00" — grid rows rebuild from these */
  windowStart?: string;
  windowEnd?: string;
  status: TrackerStatus;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export type TimeSlot =
  | "06:00"
  | "08:00"
  | "10:00"
  | "12:00"
  | "14:00"
  | "16:00"
  | "18:00"
  | "20:00"
  | "22:00";

export const TIME_SLOTS: { slot: TimeSlot; label: string }[] = [
  { slot: "06:00", label: "6AM" },
  { slot: "08:00", label: "8AM" },
  { slot: "10:00", label: "10AM" },
  { slot: "12:00", label: "12PM" },
  { slot: "14:00", label: "2PM" },
  { slot: "16:00", label: "4PM" },
  { slot: "18:00", label: "6PM" },
  { slot: "20:00", label: "8PM" },
  { slot: "22:00", label: "10PM" },
];

export const DEFAULT_SLEEP_WINDOW = { start: "19:00", end: "23:00" };
export const DEFAULT_WAKE_WINDOW = { start: "04:00", end: "10:00" };

/** every hour, for window pickers */
export const WINDOW_HOURS = [
  "00:00", "01:00", "02:00", "03:00", "04:00", "05:00", "06:00", "07:00",
  "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00",
  "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00", "23:00",
];

/**
 * Hourly time-grid rows for a user-chosen window.
 * "reversed" (sleep): latest on top — ("19:00","23:00") → 11 PM … 7 PM.
 * "chrono" (wake): earliest on top — ("04:00","10:00") → 4 AM … 10 AM.
 * End hour is INCLUDED. Wraps past midnight. Capped at 12 rows.
 */
export function buildSleepRows(
  startHHMM: string,
  endHHMM: string,
  order: "reversed" | "chrono" = "reversed"
): { slot: string; label: string }[] {
  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + (Number.isFinite(m) ? m : 0);
  };
  const start = toMin(startHHMM);
  const end = toMin(endHHMM);
  let span = (end - start + 1440) % 1440;
  if (span === 0) span = 60; // same hour = start + 1 row, not 24
  const hours = Math.min(12, Math.round(span / 60) + 1);
  const rows: { slot: string; label: string }[] = [];
  if (order === "chrono") {
    for (let i = 0; i < hours; i++) {
      const abs = (start + i * 60) % 1440;
      const slot = `${String(Math.floor(abs / 60)).padStart(2, "0")}:00`;
      rows.push({ slot, label: hourLabel(slot) });
    }
    return rows;
  }
  for (let i = hours - 1; i >= 0; i--) {
    const abs = (start + i * 60) % 1440;
    const slot = `${String(Math.floor(abs / 60)).padStart(2, "0")}:00`;
    rows.push({ slot, label: hourLabel(slot) });
  }
  return rows;
}

function hourLabel(hhmm: string): string {
  const h = Number(hhmm.split(":")[0]);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12} ${suffix}`;
}

export interface TrackerEntry {
  id: string;
  trackerId: string;
  date: string; // YYYY-MM-DD local
  value: number | string | boolean;
  completed: boolean;
  /** timetable/sleep-grid cell this entry belongs to ("HH:00") */
  slot?: string;
  targetSnapshot?: number;
  unitSnapshot?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Arc {
  id: string;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface Profile {
  name: string;
  email: string;
}

export type HomeView = "cards" | "timetable";
