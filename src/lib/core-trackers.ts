import type { Tracker } from "./types";

export type TrackerDef = Omit<
  Tracker,
  "id" | "createdAt" | "updatedAt" | "sortOrder" | "startDate" | "endDate"
>;

export const CORE_TRACKER_DEFS: TrackerDef[] = [
  { name: "Water", type: "quantity", target: 3, unit: "L", step: 0.5, frequency: { kind: "daily" }, allowMultiple: true, icon: "droplet", color: "#38bdf8", category: "hydration", status: "active" },
  { name: "Protein", type: "quantity", target: 120, unit: "g", step: 5, frequency: { kind: "daily" }, allowMultiple: true, icon: "beef", color: "#fb7185", category: "food", status: "active" },
  { name: "Steps", type: "numeric", target: 10000, unit: "", step: 500, frequency: { kind: "daily" }, allowMultiple: true, icon: "footprints", color: "#4ade80", category: "fitness", status: "active" },
  { name: "Workout", type: "boolean", step: 1, frequency: { kind: "custom", days: [1, 2, 4, 5, 6] }, allowMultiple: false, icon: "dumbbell", color: "#fb923c", category: "fitness", status: "active" },
  { name: "Study", type: "duration", target: 3, unit: "hours", step: 0.5, frequency: { kind: "daily" }, allowMultiple: true, icon: "book", color: "#a78bfa", category: "study", status: "active" },
  { name: "Sleep", type: "time", step: 1, frequency: { kind: "daily" }, allowMultiple: false, icon: "moon", color: "#818cf8", category: "sleep", status: "active", windowStart: "19:00", windowEnd: "23:00" },
  { name: "Wake Up", type: "time", step: 1, frequency: { kind: "daily" }, allowMultiple: false, icon: "sun", color: "#fbbf24", category: "sleep", status: "active", windowStart: "04:00", windowEnd: "10:00" },
  { name: "Food", type: "meals", target: 4, unit: "meals", step: 1, frequency: { kind: "daily" }, allowMultiple: true, icon: "utensils", color: "#fb923c", category: "food", status: "active" },
  { name: "Reading", type: "duration", target: 30, unit: "mins", step: 5, frequency: { kind: "daily" }, allowMultiple: true, icon: "book", color: "#a78bfa", category: "mind", status: "active" },
  { name: "Meditation", type: "duration", target: 15, unit: "mins", step: 5, frequency: { kind: "daily" }, allowMultiple: true, icon: "leaf", color: "#4ade80", category: "mind", status: "active" },
  { name: "Weight", type: "numeric", unit: "kg", step: 0.5, frequency: { kind: "daily" }, allowMultiple: false, icon: "scale", color: "#34d399", category: "fitness", status: "active" },
  { name: "Push Ups", type: "numeric", unit: "", step: 5, frequency: { kind: "daily" }, allowMultiple: true, icon: "flame", color: "#fb7185", category: "fitness", status: "active" },
  { name: "Running", type: "quantity", target: 5, unit: "km", step: 0.5, frequency: { kind: "daily" }, allowMultiple: true, icon: "activity", color: "#a78bfa", category: "fitness", status: "active" },
];
