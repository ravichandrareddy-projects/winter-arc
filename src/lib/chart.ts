/** Shared smooth-curve helpers (Sleep line, sparklines, fitness trends). */

export interface Pt {
  x: number;
  y: number;
}

const NICE_STEPS = [1, 1.5, 2, 2.5, 3, 4, 5, 6, 8, 9, 10];

function niceCeil(v: number): number {
  if (v === 0) return 0;
  const s = Math.sign(v);
  const a = Math.abs(v);
  const exp = Math.floor(Math.log10(a));
  const f = a / 10 ** exp;
  const nf =
    s > 0
      ? (NICE_STEPS.find((x) => x >= f) ?? 10)
      : [...NICE_STEPS].reverse().find((x) => x <= f) ?? 1;
  return s * nf * 10 ** exp;
}
function niceFloor(v: number): number {
  return -niceCeil(-v);
}

/**
 * Honest y-domain: tight integer hugging for small spans (Weight 83–85 → 83–86),
 * nice round numbers for big spans (Steps → 5k/10k/15k). Never 0–100 for flat data.
 */
export function niceDomain(nums: number[]): { lo: number; hi: number } {
  if (nums.length === 0) return { lo: 0, hi: 1 };
  const dmin = Math.min(...nums);
  const dmax = Math.max(...nums);
  const span = dmax - dmin || Math.abs(dmax) * 0.1 || 1;
  let lo: number;
  let hi: number;
  if (span <= 12) {
    lo = Math.floor(dmin - span * 0.25);
    hi = Math.ceil(dmax + span * 0.25);
  } else {
    lo = niceFloor(dmin - span * 0.25);
    hi = niceCeil(dmax + span * 0.25);
  }
  if (hi === lo) hi = lo + 1;
  return { lo, hi };
}

/** Catmull-Rom -> cubic Bezier: smooth curve through every point. */
export function smoothPath(pts: Pt[]): string {
  if (pts.length < 2) return "";
  let d = `M ${pts[0].x},${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${r1(c1x)},${r1(c1y)} ${r1(c2x)},${r1(c2y)} ${r1(p2.x)},${r1(p2.y)}`;
  }
  return d;
}

function r1(n: number): number {
  return Math.round(n * 10) / 10;
}

/**
 * Map values to chart coords. Missing (null) breaks runs — gaps stay gaps.
 * Returns runs of consecutive non-null points plus the y-scaler.
 */
export function toRuns(
  values: (number | null)[],
  width: number,
  height: number,
  pad = 2
): { runs: Pt[][]; yOf: (v: number) => number; max: number; min: number } {
  const nums = values.filter((v): v is number => v != null);
  const max = nums.length > 0 ? Math.max(...nums) : 1;
  const min = nums.length > 0 ? Math.min(...nums, 0) : 0;
  const span = max - min || 1;
  const n = values.length;
  const xAt = (i: number) => (n === 1 ? width / 2 : pad + (i / (n - 1)) * (width - pad * 2));
  const yOf = (v: number) => height - pad - ((v - min) / span) * (height - pad * 2);
  const runs: Pt[][] = [];
  let cur: Pt[] = [];
  values.forEach((v, i) => {
    if (v == null) {
      if (cur.length > 1) runs.push(cur);
      cur = [];
      return;
    }
    cur.push({ x: xAt(i), y: yOf(v) });
  });
  if (cur.length > 1) runs.push(cur);
  return { runs, yOf, max, min };
}
