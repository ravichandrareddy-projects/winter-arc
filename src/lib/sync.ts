import { createClient } from "./supabase/client";
import type { Tracker, TrackerEntry, Arc, Profile } from "./types";
import type {
  MealEntry,
  NutritionTargets,
  Preferences,
  Reminders,
  PhotoMeta,
} from "./store";
import type { TrackerDef } from "./core-trackers";
import { isSafePhotoId } from "./photos";

/**
 * Supabase IO. Pure functions over explicit args — never imports the store,
 * so the store can safely call these from its actions. RLS enforces ownership;
 * the uid always comes from the verified auth session.
 */

export interface UserBundle {
  arc: Arc | null;
  profile: Profile;
  trackers: Tracker[];
  entries: TrackerEntry[];
  meals: MealEntry[];
  photoMeta: PhotoMeta[];
  targets: NutritionTargets;
  preferences: Preferences;
  reminders: Reminders;
}

type Row = Record<string, unknown>;

function trackerToRow(t: Tracker, uid: string, arcId: string | null): Row {
  return {
    id: t.id,
    user_id: uid,
    arc_id: arcId,
    name: t.name,
    type: t.type,
    target: t.target ?? null,
    unit: t.unit ?? null,
    step: t.step,
    frequency_kind: t.frequency.kind,
    frequency_days: t.frequency.days ?? [],
    start_date: t.startDate,
    end_date: t.endDate,
    allow_multiple: t.allowMultiple,
    icon: t.icon,
    color: t.color,
    category: t.category,
    status: t.status,
    sort_order: t.sortOrder,
    window_start: t.windowStart ?? null,
    window_end: t.windowEnd ?? null,
  };
}

function rowToTracker(r: Row): Tracker {
  return {
    id: String(r.id),
    name: String(r.name),
    type: r.type as Tracker["type"],
    target: r.target == null ? undefined : Number(r.target),
    unit: (r.unit as string) ?? undefined,
    step: Number(r.step ?? 1),
    frequency: {
      kind: r.frequency_kind as Tracker["frequency"]["kind"],
      days: (r.frequency_days as number[]) ?? [],
    },
    startDate: String(r.start_date),
    endDate: String(r.end_date),
    allowMultiple: r.allow_multiple !== false,
    icon: r.icon as Tracker["icon"],
    color: String(r.color ?? "#38bdf8"),
    category: (r.category as Tracker["category"]) ?? "custom",
    status: (r.status as Tracker["status"]) ?? "active",
    sortOrder: Number(r.sort_order ?? 0),
    windowStart: (r.window_start as string) ?? undefined,
    windowEnd: (r.window_end as string) ?? undefined,
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
  };
}

function entryToRow(e: TrackerEntry, uid: string): Row {
  return {
    id: e.id,
    user_id: uid,
    tracker_id: e.trackerId,
    date: e.date,
    value: e.value as unknown,
    completed: e.completed,
    slot: e.slot ?? null,
    target_snapshot: e.targetSnapshot ?? null,
    unit_snapshot: e.unitSnapshot ?? null,
    note: e.note ?? null,
  };
}

function rowToEntry(r: Row): TrackerEntry {
  return {
    id: String(r.id),
    trackerId: String(r.tracker_id),
    date: String(r.date),
    value: r.value as number | string | boolean,
    completed: r.completed === true,
    slot: (r.slot as string) ?? undefined,
    targetSnapshot: r.target_snapshot == null ? undefined : Number(r.target_snapshot),
    unitSnapshot: (r.unit_snapshot as string) ?? undefined,
    note: (r.note as string) ?? undefined,
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
  };
}

function mealToRow(m: MealEntry, uid: string): Row {
  return {
    id: m.id,
    user_id: uid,
    date_key: m.dateKey,
    slot: m.slot,
    name: m.name,
    items: m.items,
    calories: m.calories,
    protein: m.protein,
    carbs: m.carbs,
    fats: m.fats,
    fiber: m.fiber,
  };
}

function rowToMeal(r: Row): MealEntry {
  return {
    id: String(r.id),
    dateKey: String(r.date_key),
    slot: r.slot as MealEntry["slot"],
    name: String(r.name),
    items: String(r.items ?? ""),
    calories: Number(r.calories ?? 0),
    protein: Number(r.protein ?? 0),
    carbs: Number(r.carbs ?? 0),
    fats: Number(r.fats ?? 0),
    fiber: Number(r.fiber ?? 0),
    createdAt: String(r.created_at ?? new Date().toISOString()),
    updatedAt: String(r.updated_at ?? new Date().toISOString()),
  };
}

async function upsert(table: string, row: Row): Promise<void> {
  const { error } = await createClient().from(table).upsert(row);
  if (error) console.warn(`[sync] ${table} upsert failed:`, error.message);
}

async function remove(table: string, uid: string, id: string): Promise<void> {
  const { error } = await createClient().from(table).delete().eq("user_id", uid).eq("id", id);
  if (error) console.warn(`[sync] ${table} delete failed:`, error.message);
}

async function removeDayEntries(uid: string, trackerId: string, date: string): Promise<void> {
  const { error } = await createClient()
    .from("tracker_entries")
    .delete()
    .eq("user_id", uid)
    .eq("tracker_id", trackerId)
    .eq("date", date);
  if (error) console.warn("[sync] entries clear-day failed:", error.message);
}

// ---- pushers (fire-and-forget from store actions) ----

export function pushTracker(uid: string, t: Tracker, arcId: string | null): Promise<void> {
  return upsert("trackers", trackerToRow(t, uid, arcId));
}

export function pushEntry(uid: string, e: TrackerEntry): Promise<void> {
  return upsert("tracker_entries", entryToRow(e, uid));
}

export function pushClearDay(uid: string, trackerId: string, date: string): Promise<void> {
  return removeDayEntries(uid, trackerId, date);
}

export function pushDelete(table: "trackers" | "tracker_entries" | "meals" | "photo_meta", uid: string, id: string): Promise<void> {
  return remove(table, uid, id);
}

export function pushMeal(uid: string, m: MealEntry): Promise<void> {
  return upsert("meals", mealToRow(m, uid));
}

export function pushPhotoMeta(
  uid: string,
  p: { id: string; dateKey: string; angle: string }
): Promise<void> {
  if (!isSafePhotoId(p.id)) return Promise.resolve();
  return upsert("photo_meta", { id: p.id, user_id: uid, date_key: p.dateKey, angle: p.angle });
}

export function pushTargets(uid: string, t: NutritionTargets): Promise<void> {
  return upsert("nutrition_targets", { user_id: uid, ...t });
}

export function pushPreferences(uid: string, p: Preferences): Promise<void> {
  return upsert("preferences", { user_id: uid, accent: p.accent, units: p.units, start_tab: p.startTab });
}

export function pushReminders(uid: string, r: Reminders): Promise<void> {
  return upsert("reminders", {
    user_id: uid,
    wake_up_time: r.wakeUp.time,
    wake_up_enabled: r.wakeUp.enabled,
    sleep_time: r.sleep.time,
    sleep_enabled: r.sleep.enabled,
    meal_time: r.meal.time,
    meal_enabled: r.meal.enabled,
    workout_time: r.workout.time,
    workout_enabled: r.workout.enabled,
    summary_time: r.summary.time,
    summary_enabled: r.summary.enabled,
  });
}

export function pushProfile(uid: string, p: Profile): Promise<void> {
  return upsert("profiles", { user_id: uid, name: p.name, email: p.email });
}

export function pushArc(uid: string, a: Arc): Promise<void> {
  return upsert("arcs", { id: a.id, user_id: uid, start_date: a.startDate, end_date: a.endDate });
}

// ---- wipe + full push (backup restore) ----

export async function wipeCloudData(uid: string): Promise<void> {
  const sb = createClient();
  // list this user's photo files first (needed for storage removal)
  const { data: files } = await sb.storage.from("body-photos").list(uid);
  const paths = (files ?? []).map((f) => `${uid}/${f.name}`);
  await Promise.all([
    sb.from("tracker_entries").delete().eq("user_id", uid),
    sb.from("trackers").delete().eq("user_id", uid),
    sb.from("meals").delete().eq("user_id", uid),
    sb.from("photo_meta").delete().eq("user_id", uid),
  ]);
  if (paths.length > 0) {
    await sb.storage.from("body-photos").remove(paths);
  }
}

export async function pushAll(
  uid: string,
  data: {
    arc: Arc | null;
    profile: Profile;
    trackers: Tracker[];
    entries: TrackerEntry[];
    meals: MealEntry[];
    photoMeta: PhotoMeta[];
    targets: NutritionTargets;
    preferences: Preferences;
    reminders: Reminders;
  }
): Promise<void> {
  if (data.arc) await pushArc(uid, data.arc);
  await pushProfile(uid, data.profile);
  for (const t of data.trackers) await pushTracker(uid, t, data.arc?.id ?? null);
  for (const e of data.entries) await pushEntry(uid, e);
  for (const m of data.meals) await pushMeal(uid, m);
  for (const p of data.photoMeta) {
    await pushPhotoMeta(uid, { id: p.id, dateKey: p.dateKey, angle: p.angle });
  }
  await pushTargets(uid, data.targets);
  await pushPreferences(uid, data.preferences);
  await pushReminders(uid, data.reminders);
}

// ---- photos (private bucket, path <uid>/<id>) ----

export async function uploadPhoto(uid: string, id: string, blob: Blob): Promise<void> {
  if (!isSafePhotoId(id)) return;
  const { error } = await createClient()
    .storage.from("body-photos")
    .upload(`${uid}/${id}`, blob, { upsert: true, contentType: blob.type || "image/jpeg" });
  if (error) console.warn("[sync] photo upload failed:", error.message);
}

export async function downloadPhoto(uid: string, id: string): Promise<Blob | null> {
  if (!isSafePhotoId(id)) return null;
  const { data, error } = await createClient()
    .storage.from("body-photos")
    .download(`${uid}/${id}`);
  if (error || !data) return null;
  return data;
}

export async function removePhoto(uid: string, id: string): Promise<void> {
  if (!isSafePhotoId(id)) return;
  const { error } = await createClient().storage.from("body-photos").remove([`${uid}/${id}`]);
  if (error) console.warn("[sync] photo remove failed:", error.message);
}

// ---- load ----

export async function fetchUserData(
  uid: string,
  email: string,
  displayName: string,
  defs: TrackerDef[],
  arcStart: string,
  arcEnd: string
): Promise<UserBundle> {
  const sb = createClient();
  const [arcs, profiles, trackers, entries, meals, photos, targets, prefs, reminders] =
    await Promise.all([
      sb.from("arcs").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(1),
      sb.from("profiles").select("*").eq("user_id", uid).limit(1),
      sb.from("trackers").select("*").eq("user_id", uid).order("sort_order"),
      sb.from("tracker_entries").select("*").eq("user_id", uid).order("date"),
      sb.from("meals").select("*").eq("user_id", uid).order("date_key"),
      sb.from("photo_meta").select("*").eq("user_id", uid).order("date_key"),
      sb.from("nutrition_targets").select("*").eq("user_id", uid).limit(1),
      sb.from("preferences").select("*").eq("user_id", uid).limit(1),
      sb.from("reminders").select("*").eq("user_id", uid).limit(1),
    ]);

  // arc: latest or fresh
  let arc: Arc;
  const arcRow = arcs.data?.[0] as Row | undefined;
  if (arcRow) {
    arc = {
      id: String(arcRow.id),
      startDate: String(arcRow.start_date),
      endDate: String(arcRow.end_date),
      createdAt: String(arcRow.created_at ?? new Date().toISOString()),
    };
  } else {
    arc = {
      id: crypto.randomUUID(),
      startDate: arcStart,
      endDate: arcEnd,
      createdAt: new Date().toISOString(),
    };
    await upsert("arcs", { id: arc.id, user_id: uid, start_date: arc.startDate, end_date: arc.endDate });
  }

  // trackers: user's rows, or fresh core shells for a new account
  let localTrackers: Tracker[] = (trackers.data ?? []).map((r) => rowToTracker(r as Row));
  if (localTrackers.length === 0) {
    const now = new Date().toISOString();
    localTrackers = defs.map((d, i) => ({
      ...d,
      startDate: arc.startDate,
      endDate: arc.endDate,
      id: crypto.randomUUID(),
      sortOrder: i,
      createdAt: now,
      updatedAt: now,
    }));
    for (const t of localTrackers) {
      await upsert("trackers", trackerToRow(t, uid, arc.id));
    }
  }

  const profRow = profiles.data?.[0] as Row | undefined;
  const profile: Profile = {
    name: String(profRow?.name ?? displayName ?? ""),
    email: String(profRow?.email ?? email ?? ""),
  };
  if (!profRow) {
    await upsert("profiles", { user_id: uid, name: profile.name, email: profile.email });
  }

  const tRow = targets.data?.[0] as Row | undefined;
  const targetsVal: NutritionTargets = {
    calories: Number(tRow?.calories ?? 2000),
    protein: Number(tRow?.protein ?? 150),
    carbs: Number(tRow?.carbs ?? 220),
    fats: Number(tRow?.fats ?? 70),
    fiber: Number(tRow?.fiber ?? 30),
  };

  const pRow = prefs.data?.[0] as Row | undefined;
  const prefsVal: Preferences = {
    accent: (pRow?.accent as Preferences["accent"]) ?? "blue",
    units: (pRow?.units as Preferences["units"]) ?? "metric",
    startTab: (pRow?.start_tab as Preferences["startTab"]) ?? "/",
  };

  const rRow = reminders.data?.[0] as Row | undefined;
  const remVal: Reminders = rRow
    ? {
        wakeUp: { time: String(rRow.wake_up_time ?? "05:00"), enabled: rRow.wake_up_enabled !== false },
        sleep: { time: String(rRow.sleep_time ?? "22:30"), enabled: rRow.sleep_enabled !== false },
        meal: { time: String(rRow.meal_time ?? "08:00"), enabled: rRow.meal_enabled !== false },
        workout: { time: String(rRow.workout_time ?? "18:00"), enabled: rRow.workout_enabled !== false },
        summary: { time: String(rRow.summary_time ?? "21:00"), enabled: rRow.summary_enabled !== false },
      }
    : {
        wakeUp: { time: "05:00", enabled: false },
        sleep: { time: "22:30", enabled: false },
        meal: { time: "08:00", enabled: false },
        workout: { time: "18:00", enabled: false },
        summary: { time: "21:00", enabled: false },
      };

  return {
    arc,
    profile,
    trackers: localTrackers,
    entries: (entries.data ?? []).map((r) => rowToEntry(r as Row)),
    meals: (meals.data ?? []).map((r) => rowToMeal(r as Row)),
    photoMeta: (photos.data ?? []).map((r) => {
      const row = r as Row;
      return {
        id: String(row.id),
        dateKey: String(row.date_key),
        angle: row.angle as PhotoMeta["angle"],
        createdAt: String(row.created_at ?? new Date().toISOString()),
      };
    }),
    targets: targetsVal,
    preferences: prefsVal,
    reminders: remVal,
  };
}
