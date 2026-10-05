"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { niceDomain, smoothPath } from "@/lib/chart";
import { formatCompact } from "@/lib/dates";

interface Pt {
  x: number;
  y: number;
}

function fmtTick(v: number): string {
  const r = Math.round(v * 10) / 10;
  return Number.isInteger(r) ? formatCompact(r) : String(r);
}

/**
 * Honest line chart in real pixels (no stretched ellipses):
 * data-driven nice axis, gaps break the line, dots are true circles.
 */
export function LineChart({
  values,
  color,
  height = 112,
  yLabels = true,
  gid,
  formatY,
}: {
  values: (number | null)[];
  color: string;
  height?: number;
  yLabels?: boolean;
  gid: string;
  /** custom tick labels (durations, clock times) — defaults to compact numbers */
  formatY?: (v: number) => string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setW(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const width = Math.max(w, 60);
  const pad = 6;

  const { runs, dots, lo, hi } = useMemo(() => {
    const nums = values.filter((v): v is number => v != null);
    const { lo, hi } = niceDomain(nums);
    const n = values.length;
    const xAt = (i: number) => (n === 1 ? width / 2 : pad + (i / (n - 1)) * (width - pad * 2));
    const yOf = (v: number) => height - pad - ((v - lo) / (hi - lo)) * (height - pad * 2);
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
    const dots: Pt[] = [];
    values.forEach((v, i) => {
      if (v != null) dots.push({ x: xAt(i), y: yOf(v) });
    });
    return { runs, dots, lo, hi };
  }, [values, width, height]);

  const mid = (hi + lo) / 2;
  const fmt = formatY ?? fmtTick;

  return (
    <div className="flex gap-2">
      {yLabels && (
        <div
          className="flex w-9 shrink-0 flex-col justify-between py-1 text-right text-[10px] leading-none text-muted"
        >
          <span>{fmt(hi)}</span>
          <span>{fmt(mid)}</span>
          <span>{fmt(lo)}</span>
        </div>
      )}
      <div ref={ref} className="min-w-0 flex-1">
        <svg width={width} height={height} aria-hidden="true" className="block w-full">
          <defs>
            <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.35" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[pad, height / 2, height - pad].map((y) => (
            <line
              key={y}
              x1="0"
              x2={width}
              y1={y}
              y2={y}
              stroke="currentColor"
              strokeOpacity="0.08"
              strokeWidth="1"
              className="text-foreground"
            />
          ))}
          {runs.map((run, ri) => (
            <g key={ri}>
              <polygon
                points={`${run[0].x},${height} ${run.map((p) => `${p.x},${p.y}`).join(" ")} ${run[run.length - 1].x},${height}`}
                fill={`url(#${gid})`}
              />
              <path
                d={smoothPath(run)}
                fill="none"
                stroke={color}
                strokeOpacity="0.35"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <path
                d={smoothPath(run)}
                fill="none"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>
          ))}
          {dots.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="var(--color-card)" strokeWidth="1.5" />
          ))}
        </svg>
      </div>
    </div>
  );
}
