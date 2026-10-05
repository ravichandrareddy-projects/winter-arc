import { addDays, differenceInCalendarDays, format, parse } from "date-fns";
import type { Tracker } from "./types";

/** YYYY-MM-DD in the user's local timezone. */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey(): string {
  return toDateKey(new Date());
}

/** Parse YYYY-MM-DD as local midnight (no UTC shift). */
export function parseKey(key: string): Date {
  return parse(key, "yyyy-MM-dd", new Date());
}

export function addDaysKey(key: string, n: number): string {
  return toDateKey(addDays(parseKey(key), n));
}

export function arcDayNumber(arcStartKey: string, dateKey: string): number {
  return differenceInCalendarDays(parseKey(dateKey), parseKey(arcStartKey)) + 1;
}

/**
 * Calculate the exact arc days window for sleep/wake/habit views:
 * - Starts at arcStart (when the user started their arc).
 * - Never includes dates before arcStart (no yesterday or pre-arc ghost days).
 * - If today is Day 1, shows from Day 1 onwards.
 * - If today is Day 2 (even if Day 1 was not attended/missed), shows from Day 1 (when they started) up to current day and ahead.
 * - Bound within the real arc duration (e.g. 90 days).
 */
export function getArcWindowDays(
  arcStart: string,
  selectedDate: string,
  range: number,
  totalDays = 90
): string[] {
  const start = arcStart || todayKey();
  const sel = selectedDate || start;
  const diffFromStart = Math.max(0, differenceInCalendarDays(parseKey(sel), parseKey(start)));
  
  let startOffset = 0;
  if (diffFromStart >= range) {
    startOffset = diffFromStart - (range - 1);
  }
  
  const windowStart = addDaysKey(start, startOffset);
  const remainingArcDays = Math.max(1, totalDays - startOffset);
  const count = Math.min(range, remainingArcDays);
  
  return Array.from({ length: Math.max(1, count) }, (_, i) => addDaysKey(windowStart, i));
}

export function dayOfWeek(key: string): number {
  return parseKey(key).getDay();
}

export function weekdayShort(key: string): string {
  return format(parseKey(key), "EEE");
}

export function monthDayShort(key: string): string {
  return format(parseKey(key), "MMM d");
}

export function fullDateLong(key: string): string {
  return format(parseKey(key), "EEE, MMM d, yyyy");
}

export function monthDayYear(key: string): string {
  return format(parseKey(key), "MMM dd, yyyy");
}

export function greetingForHour(h: number): string {
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export function isTrackerApplicable(t: Tracker, dateKey: string): boolean {
  if (t.status !== "active") return false;
  if (dateKey < t.startDate || dateKey > t.endDate) return false;
  const dow = dayOfWeek(dateKey);
  switch (t.frequency.kind) {
    case "daily":
      return true;
    case "weekdays":
      return dow >= 1 && dow <= 5;
    case "weekends":
      return dow === 0 || dow === 6;
    case "custom":
      return t.frequency.days?.includes(dow) ?? true;
    default:
      return true;
  }
}

export function uid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
}

export function nowISO(): string {
  return new Date().toISOString();
}

export function formatNumber(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

/**
 * Is "HH:MM" inside a user window ("HH:00" → "HH:00", wraps past midnight)?
 * The last hourly bucket covers its full hour, so end "23:00" accepts 23:59.
 */
export function inSleepWindow(hhmm: string, startHHMM: string, endHHMM: string): boolean {
  const toMin = (s: string) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + (Number.isFinite(m) ? m : 0);
  };
  const start = toMin(startHHMM);
  const end = toMin(endHHMM);
  let span = (end - start + 1440) % 1440;
  if (span === 0) span = 60;
  const rows = Math.min(12, Math.round(span / 60) + 1);
  const rel = (toMin(hhmm) - start + 1440) % 1440;
  return rel < rows * 60;
}

/** Local Date for a YYYY-MM-DD key + "HH:MM" slot. */
export function slotDateTime(dateKey: string, hhmm: string): Date {
  const d = parseKey(dateKey);
  const [h, m] = hhmm.split(":").map(Number);
  d.setHours(Number.isFinite(h) ? h : 0, Number.isFinite(m) ? m : 0, 0, 0);
  return d;
}

/**
 * A time box opens once its own time arrives:
 * past dates → all open, future dates → all locked,
 * today → slots unlock one by one as the clock passes them.
 * The day stays alive until 11:59 PM.
 */
export function isSlotReached(
  dateKey: string,
  hhmm: string,
  now: Date = new Date()
): boolean {
  const today = toDateKey(now);
  if (dateKey < today) return true;
  if (dateKey > today) return false;
  return slotDateTime(dateKey, hhmm).getTime() <= now.getTime();
}

/**
 * The live slot right now (latest passed slot). Only today has one —
 * this is the box that glows as "active".
 */
export function currentSlot(
  dateKey: string,
  slots: string[],
  now: Date = new Date()
): string | null {
  if (dateKey !== toDateKey(now)) return null;
  let cur: string | null = null;
  for (const s of slots) {
    if (slotDateTime(dateKey, s).getTime() <= now.getTime()) cur = s;
  }
  return cur;
}

/** "22:30" -> "10:30 PM" */
export function formatTime12(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return hhmm;
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/** 8300 -> "8.3k", 2400 -> "2.4k" for tight timetable cells */
export function formatCompact(n: number): string {
  if (Math.abs(n) >= 1000) {
    const v = n / 1000;
    return `${Number(v.toFixed(1))}k`;
  }
  return formatNumber(n);
}
