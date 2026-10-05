/** Metric-canonical conversions. Stored values stay metric; display converts. */

export type UnitSystem = "metric" | "imperial";

const KG_TO_LB = 2.20462;
const KM_TO_MI = 0.621371;

export function weightUnit(u: UnitSystem): "kg" | "lb" {
  return u === "imperial" ? "lb" : "kg";
}

export function distUnit(u: UnitSystem): "km" | "mi" {
  return u === "imperial" ? "mi" : "km";
}

/** kg → display value in current system (1 decimal). */
export function displayWeight(kg: number, u: UnitSystem): number {
  const v = u === "imperial" ? kg * KG_TO_LB : kg;
  return Math.round(v * 10) / 10;
}

/** display value → canonical kg. */
export function parseWeightInput(v: number, u: UnitSystem): number {
  const kg = u === "imperial" ? v / KG_TO_LB : v;
  return Math.round(kg * 10) / 10;
}

/** km → display value in current system (1 decimal). */
export function displayDist(km: number, u: UnitSystem): number {
  const v = u === "imperial" ? km * KM_TO_MI : km;
  return Math.round(v * 10) / 10;
}

/** display value → canonical km. */
export function parseDistInput(v: number, u: UnitSystem): number {
  const km = u === "imperial" ? v / KM_TO_MI : v;
  return Math.round(km * 10) / 10;
}

interface UnitCarrier {
  unit?: string;
}

/** Display number for a tracker value (Weight kg↔lb, Running km↔mi; rest untouched). */
export function displayValue(t: UnitCarrier, v: number, u: UnitSystem): number {
  if (u === "metric") return v;
  if (t.unit === "kg") return displayWeight(v, u);
  if (t.unit === "km") return displayDist(v, u);
  return v;
}

/** Display unit label for a tracker (kg→lb, km→mi in imperial). */
export function displayUnit(t: UnitCarrier, u: UnitSystem): string | undefined {
  if (u === "metric" || !t.unit) return t.unit;
  if (t.unit === "kg") return "lb";
  if (t.unit === "km") return "mi";
  return t.unit;
}

/** Display input back to canonical storage. */
export function parseInput(t: UnitCarrier, v: number, u: UnitSystem): number {
  if (u === "metric") return v;
  if (t.unit === "kg") return parseWeightInput(v, u);
  if (t.unit === "km") return parseDistInput(v, u);
  return v;
}
