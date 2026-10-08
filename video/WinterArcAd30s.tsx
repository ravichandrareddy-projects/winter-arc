import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ─────────────────────────────────────────────────────────────────────────────
// SCENE TIMING CONSTANTS  (frames @ 30 FPS = 900 total)
// ─────────────────────────────────────────────────────────────────────────────
const FPS = 30;
export const HOOK_START      = 0;    // 0:00 – 0:03
export const HOOK_END        = 90;
export const PROBLEM_START   = 90;   // 0:03 – 0:06
export const PROBLEM_END     = 180;
export const INTRO_START     = 180;  // 0:06 – 0:10
export const INTRO_END       = 300;
export const TRACKING_START  = 300;  // 0:10 – 0:14
export const TRACKING_END    = 420;
export const DATA_START      = 420;  // 0:14 – 0:18
export const DATA_END        = 540;
export const SYSTEM_START    = 540;  // 0:18 – 0:22
export const SYSTEM_END      = 660;
export const PROGRESS_START  = 660;  // 0:22 – 0:25
export const PROGRESS_END    = 750;
export const CTA_START       = 750;  // 0:25 – 0:27
export const CTA_END         = 810;
export const FINAL_START     = 810;  // 0:27 – 0:30
export const FINAL_END       = 900;

// ─────────────────────────────────────────────────────────────────────────────
// BRAND TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const C = {
  bg:           "#070b11",
  bgDeep:       "#040810",
  card:         "#0f1822",
  cardBright:   "#131e2e",
  border:       "rgba(255,255,255,0.08)",
  borderAccent: "rgba(46,155,255,0.35)",
  text:         "#edf3f9",
  muted:        "#7a8fa3",
  accent:       "#2e9bff",
  accentLight:  "#7ec5ff",
  accentGlow:   "rgba(46,155,255,0.18)",
  white:        "#ffffff",
  good:         "#34d399",
  warn:         "#fbbf24",
};

const FONT = `"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;

// ─────────────────────────────────────────────────────────────────────────────
// UTILITY HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function clampedLerp(frame: number, from: number[], to: number[], vals: number[]) {
  return interpolate(frame, from, vals, {
    extrapolateLeft:  "clamp",
    extrapolateRight: "clamp",
    easing: (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t,
  });
}
function clamp01(frame: number, inF: number, outF: number): number {
  return interpolate(frame, [inF, inF+1, outF-1, outF], [0,1,1,0], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// SHARED VISUAL COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/** Dark mountain silhouette rendered purely in SVG */
function MountainBg({ frame, opacity = 1 }: { frame: number; opacity?: number }) {
  const drift = frame * 0.12;
  return (
    <div style={{ position: "absolute", inset: 0, opacity, overflow: "hidden" }}>
      {/* Sky gradient */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 120% 60% at 50% 0%, rgba(15,40,90,0.55) 0%, ${C.bgDeep} 65%)`,
      }} />
      {/* Mountain silhouettes */}
      <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} preserveAspectRatio="xMidYMid slice">
        {/* Far mountains */}
        <polygon points="0,800 200,400 400,650 600,350 900,600 1200,300 1500,550 1700,380 1920,600 1920,1080 0,1080" fill="rgba(8,18,40,0.9)" />
        {/* Mid mountains */}
        <polygon points="0,950 150,700 350,850 600,650 900,800 1200,580 1500,750 1700,620 1920,780 1920,1080 0,1080" fill="rgba(6,12,28,0.97)" />
        {/* Snow caps */}
        <polygon points="580,355 600,350 620,355 605,340 600,335 595,340 z" fill={`rgba(180,220,255,0.35)`} />
        <polygon points="1180,308 1200,300 1220,308 1205,290 1200,285 1195,290 z" fill={`rgba(180,220,255,0.3)`} />
        <polygon points="1680,386 1700,380 1720,386 1705,366 1700,361 1695,366 z" fill={`rgba(180,220,255,0.25)`} />
      </svg>
      {/* Subtle aurora glow */}
      <div style={{
        position: "absolute", top: "15%", left: "25%", right: "25%", height: "25%",
        background: `radial-gradient(ellipse at 50% 50%, rgba(46,155,255,0.07) 0%, transparent 70%)`,
        transform: `translateY(${Math.sin(frame * 0.025) * 8}px)`,
      }} />
      {/* Snow particles */}
      {[...Array(18)].map((_, i) => {
        const x = ((i * 137.5 + drift * (0.3 + i * 0.06)) % 1920);
        const y = ((i * 71.3 + frame * (0.4 + (i % 3) * 0.15)) % 900) + 50;
        const sz = 1.5 + (i % 4) * 0.6;
        return (
          <div key={i} style={{
            position: "absolute", left: x, top: y,
            width: sz, height: sz, borderRadius: "50%",
            background: "rgba(255,255,255,0.55)",
          }} />
        );
      })}
      {/* Bottom ground dark */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0, height: "20%",
        background: `linear-gradient(to top, ${C.bgDeep}, transparent)`,
      }} />
    </div>
  );
}

/** Vignette overlay */
function Vignette() {
  return (
    <div style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      boxShadow: "inset 0 0 200px rgba(0,0,0,0.82)",
    }} />
  );
}

/** Winter Arc logo mark in SVG */
function LogoMark({ size = 40, color = C.accent }: { size?: number; color?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"
      style={{ width: size, height: size, flexShrink: 0 }}>
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  );
}

/** Big kinetic word with optional underscore flash */
function KineticWord({
  children, frame, enterAt, style = {},
}: { children: React.ReactNode; frame: number; enterAt: number; style?: React.CSSProperties }) {
  const s = spring({ frame: frame - enterAt, fps: FPS, config: { damping: 18, stiffness: 280, mass: 0.7 } });
  const y  = interpolate(s, [0, 1], [60, 0]);
  const sc = interpolate(s, [0, 1], [0.8, 1]);
  return (
    <div style={{
      transform: `translateY(${y}px) scale(${sc})`,
      opacity: Math.min(1, s * 1.2),
      ...style,
    }}>
      {children}
    </div>
  );
}

/** Horizontal data bar */
function DataBar({ label, value, max, unit, color, frame, enterAt }:
  { label: string; value: number; max: number; unit: string; color: string; frame: number; enterAt: number }) {
  const s = spring({ frame: frame - enterAt, fps: FPS, config: { damping: 20, stiffness: 200, mass: 0.8 } });
  const pct = (value / max) * 100;
  const animatedPct = Math.min(pct, pct * s);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: C.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>
          {(value * Math.min(1, s * 1.1)).toFixed(value < 10 ? 1 : 0)} / {max} {unit}
        </span>
      </div>
      <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 3,
          width: `${animatedPct}%`,
          background: `linear-gradient(90deg, ${color}cc, ${color})`,
          boxShadow: `0 0 10px ${color}88`,
          transition: "width 0.1s",
        }} />
      </div>
    </div>
  );
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

interface AnimatedLineGraphProps {
  frame: number;
  enterAt: number;
  duration?: number;
  color?: string;
  width?: number;
  height?: number;
  data: number[];
  startVal: number;
  endVal: number;
  unit?: string;
  metricLabel: string;
  badgeText?: string;
  xLabels?: string[];
}

function AnimatedLineGraph({
  frame,
  enterAt,
  duration = 55,
  color = C.accent,
  width = 400,
  height = 90,
  data,
  startVal,
  endVal,
  unit = "%",
  metricLabel,
  badgeText,
  xLabels = ["D1", "D2", "D3", "D4", "D5", "D6", "D7"],
}: AnimatedLineGraphProps) {
  const lf = frame - enterAt;
  const rawProgress = interpolate(lf, [0, duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = easeInOutCubic(rawProgress);

  const N = data.length;
  const baselineY = height - 12;
  const topPad = 12;

  const pts = data.map((targetVal, i) => {
    const x = (i / (N - 1)) * (width - 40) + 20;
    const targetY = topPad + (1 - (targetVal / 100)) * (height - topPad - 18);
    const pointStagger = Math.min(1, Math.max(0, (progress * 1.35) - (i * (0.35 / N))));
    const y = interpolate(pointStagger, [0, 1], [baselineY, targetY]);
    return { x, y };
  });

  let pathD = pts.length > 0 ? `M ${pts[0].x} ${pts[0].y}` : "";
  for (let i = 0; i < pts.length - 1; i++) {
    const xc = (pts[i].x + pts[i + 1].x) / 2;
    const yc = (pts[i].y + pts[i + 1].y) / 2;
    pathD += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
  }
  if (pts.length > 1) {
    pathD += ` L ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;
  }

  const areaD = `${pathD} L ${pts[pts.length - 1].x} ${baselineY} L ${pts[0].x} ${baselineY} Z`;

  const headIdx = progress * (N - 1);
  const i0 = Math.floor(headIdx);
  const i1 = Math.min(N - 1, i0 + 1);
  const frac = headIdx - i0;
  const headX = (pts[i0] && pts[i1]) ? interpolate(frac, [0, 1], [pts[i0].x, pts[i1].x]) : pts[0].x;
  const headY = (pts[i0] && pts[i1]) ? interpolate(frac, [0, 1], [pts[i0].y, pts[i1].y]) : pts[0].y;

  const liveVal = Math.round(interpolate(progress, [0, 1], [startVal, endVal]));
  const pulsePhase = (lf * 0.14) % 1;
  const gradId = `graphGrad30_${metricLabel.replace(/\s+/g, "")}`;

  return (
    <div style={{ width, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {metricLabel}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: C.white, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {liveVal}
              <span style={{ fontSize: 16, color: C.muted }}>{unit}</span>
            </span>
          </div>
        </div>

        {badgeText && progress > 0.35 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 8px", borderRadius: 999,
            background: "rgba(52,211,153,0.14)",
            border: "1px solid rgba(52,211,153,0.5)",
            color: C.good, fontSize: 10, fontWeight: 800,
            transform: `scale(${interpolate(progress, [0.35, 0.55], [0.7, 1], { extrapolateRight: "clamp" })})`,
          }}>
            <span>↑ {badgeText}</span>
          </div>
        )}
      </div>

      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        <line x1={20} y1={baselineY} x2={width - 20} y2={baselineY} stroke="rgba(255,255,255,0.10)" />

        {pts.length > 1 && <path d={areaD} fill={`url(#${gradId})`} />}

        <path
          d={pathD}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />

        {lf > 2 && (
          <>
            <line x1={headX} y1={headY + 5} x2={headX} y2={baselineY} stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity={0.4} />
            <circle cx={headX} cy={headY} r={4 + pulsePhase * 12} stroke={color} strokeWidth="1.5" fill="none" opacity={1 - pulsePhase} />
            <circle cx={headX} cy={headY} r="4.5" fill="#ffffff" stroke={color} strokeWidth="2.5" />
          </>
        )}

        {xLabels.map((lbl, i) => {
          const lx = (i / (xLabels.length - 1)) * (width - 40) + 20;
          return (
            <text key={lbl} x={lx} y={height + 12} fontSize="9" fontWeight="700" fill={i === xLabels.length - 1 ? color : C.muted} textAnchor="middle" style={{ fontFamily: FONT }}>
              {lbl}
            </text>
          );
        })}
      </svg>
    </div>
  );
}

function AnimatedBarChart({
  frame,
  enterAt,
  width = 340,
  height = 90,
  values = [28, 42, 55, 68, 75, 88, 100],
  days = ["M", "T", "W", "T", "F", "S", "S"],
  color = C.good,
  metricLabel = "FITNESS STREAK",
  currentStreak = 28,
}: {
  frame: number;
  enterAt: number;
  width?: number;
  height?: number;
  values?: number[];
  days?: string[];
  color?: string;
  metricLabel?: string;
  currentStreak?: number;
}) {
  const lf = frame - enterAt;
  const streakProgress = interpolate(lf, [0, 40], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const liveStreak = Math.round(streakProgress * currentStreak);
  const barWidth = 22;
  const baselineY = height - 12;
  const maxBarH = height - 28;

  return (
    <div style={{ width, display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: C.muted, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            {metricLabel}
          </div>
          <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 2 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: C.white, fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
              {liveStreak}
              <span style={{ fontSize: 16, color: C.good, marginLeft: 4 }}>DAYS 🔥</span>
            </span>
          </div>
        </div>

        {streakProgress > 0.4 && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            padding: "2px 8px", borderRadius: 999,
            background: "rgba(52,211,153,0.14)",
            border: "1px solid rgba(52,211,153,0.5)",
            color: C.good, fontSize: 10, fontWeight: 800,
          }}>
            <span>100% ON TRACK</span>
          </div>
        )}
      </div>

      <svg width={width} height={height} style={{ overflow: "visible" }}>
        <line x1={10} y1={baselineY} x2={width - 10} y2={baselineY} stroke="rgba(255,255,255,0.10)" />
        {values.map((v, i) => {
          const s = spring({
            frame: lf - (i * 4),
            fps: FPS,
            config: { damping: 16, stiffness: 220, mass: 0.8 },
          });
          const barH = Math.max(3, (v / 100) * maxBarH * s);
          const x = 16 + i * ((width - 32 - barWidth) / (values.length - 1));
          const y = baselineY - barH;

          return (
            <g key={i}>
              <rect x={x} y={y} width={barWidth} height={barH} rx={5} fill={color} opacity={0.85} />
              <rect x={x} y={y} width={barWidth} height={2.5} rx={1} fill="#ffffff" opacity={0.7} />
              <text x={x + barWidth / 2} y={height + 12} fontSize="9" fontWeight="700" fill={i === values.length - 1 ? color : C.muted} textAnchor="middle" style={{ fontFamily: FONT }}>
                {days[i]}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 01: HOOK  (frames 0–90 / 0:00–0:03)
// ─────────────────────────────────────────────────────────────────────────────
function SceneHook({ frame }: { frame: number }) {
  const lf = frame - HOOK_START;
  const opacity = clamp01(lf, 0, 90);

  // Mountain fades in
  const bgOpacity = interpolate(lf, [0, 30, 80, 90], [0, 0.7, 1, 0.9], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Glowing data point pulse
  const pulse = 0.6 + 0.4 * Math.sin(lf * 0.22);

  // "YOU SAID" appears word-by-word
  const line1w1 = Math.min(1, spring({ frame: lf - 8,  fps: FPS, config: { damping: 20, stiffness: 300 } }));
  const line1w2 = Math.min(1, spring({ frame: lf - 18, fps: FPS, config: { damping: 20, stiffness: 300 } }));
  const line2   = Math.min(1, spring({ frame: lf - 32, fps: FPS, config: { damping: 18, stiffness: 260 } }));
  const line3   = Math.min(1, spring({ frame: lf - 52, fps: FPS, config: { damping: 16, stiffness: 240 } }));

  // Camera push
  const camScale = interpolate(lf, [0, 90], [0.97, 1.04], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ opacity, transform: `scale(${camScale})` }}>
      <MountainBg frame={lf} opacity={bgOpacity} />
      <Vignette />

      {/* Glowing data point */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 10, height: 10, borderRadius: "50%",
        background: C.accent,
        boxShadow: `0 0 ${30 * pulse}px ${10 * pulse}px rgba(46,155,255,0.6)`,
        opacity: lf > 5 ? 1 : 0,
      }} />

      {/* Text block */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "0 120px",
        textAlign: "center",
        fontFamily: FONT,
      }}>
        {/* Line 1: YOU SAID */}
        <div style={{ display: "flex", gap: 20, marginBottom: 6 }}>
          <span style={{
            fontSize: 96, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
            color: C.text,
            transform: `translateY(${interpolate(line1w1, [0, 1], [50, 0])}px)`,
            opacity: line1w1,
          }}>YOU</span>
          <span style={{
            fontSize: 96, fontWeight: 900, letterSpacing: "-0.03em", lineHeight: 1,
            color: C.text,
            transform: `translateY(${interpolate(line1w2, [0, 1], [50, 0])}px)`,
            opacity: line1w2,
          }}>SAID</span>
        </div>

        {/* Line 2: THIS YEAR WOULD BE DIFFERENT. */}
        <div style={{
          fontSize: 52, fontWeight: 800, letterSpacing: "-0.02em",
          color: C.accentLight,
          transform: `translateY(${interpolate(line2, [0, 1], [40, 0])}px)`,
          opacity: line2,
          marginBottom: 24,
        }}>
          THIS YEAR WOULD BE DIFFERENT.
        </div>

        {/* Line 3: SO... DID YOU TRACK IT? */}
        {lf > 50 && (
          <div style={{
            padding: "14px 32px",
            borderRadius: 999,
            border: `2px solid ${C.accent}`,
            background: "rgba(46,155,255,0.12)",
            backdropFilter: "blur(12px)",
            transform: `scale(${interpolate(line3, [0, 1], [0.88, 1])}) translateY(${interpolate(line3, [0, 1], [20, 0])}px)`,
            opacity: line3,
          }}>
            <span style={{
              fontSize: 38, fontWeight: 900, letterSpacing: "0.04em",
              color: C.white,
            }}>SO... DID YOU TRACK IT?</span>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 02: THE PROBLEM  (frames 90–180 / 0:03–0:06)
// ─────────────────────────────────────────────────────────────────────────────
function SceneProblem({ frame }: { frame: number }) {
  const lf = frame - PROBLEM_START;
  const opacity = clamp01(lf, 0, 90);

  const tags = ["SLEEP", "FITNESS", "FOOD", "STUDY", "GOALS", "CONSISTENCY", "WATER", "FOCUS"];
  const chaos = interpolate(lf, [0, 40, 65], [0, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Each tag appears staggered, chaotically positioned, then collapses to center
  const collapseProgress = interpolate(lf, [50, 80], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // "TOO MANY GOALS" text appears at the end
  const txtOpacity = interpolate(lf, [68, 82], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const txt2Opacity = interpolate(lf, [76, 90], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const chaosPositions = [
    { x: -560, y: -220 }, { x: 280, y: -180 }, { x: -400, y: 60 },
    { x: 460, y: 90 }, { x: -200, y: 200 }, { x: 320, y: 220 },
    { x: -460, y: -50 }, { x: 160, y: -260 },
  ];

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bg }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, rgba(46,155,255,0.06) 0%, transparent 60%)`,
      }} />

      {/* Floating chaos tags */}
      {tags.map((tag, i) => {
        const enterF  = i * 4;
        const tagS    = spring({ frame: lf - enterF, fps: FPS, config: { damping: 18, stiffness: 300 } });
        const pos     = chaosPositions[i];
        const cx      = interpolate(collapseProgress, [0, 1], [pos.x, 0]);
        const cy      = interpolate(collapseProgress, [0, 1], [pos.y, 0]);
        const tagOpac = Math.min(1, tagS * 1.3) * (1 - collapseProgress * 0.85);
        const sc      = interpolate(collapseProgress, [0, 1], [tagS, 0.6]);

        return (
          <div key={tag} style={{
            position: "absolute", top: "50%", left: "50%",
            transform: `translate(calc(-50% + ${cx}px), calc(-50% + ${cy}px)) scale(${sc})`,
            opacity: tagOpac,
          }}>
            <div style={{
              padding: "10px 22px", borderRadius: 12,
              border: `1.5px solid rgba(46,155,255,${0.3 + (i % 3) * 0.15})`,
              background: `rgba(46,155,255,${0.05 + (i % 3) * 0.04})`,
              backdropFilter: "blur(8px)",
              fontSize: 22, fontWeight: 800, color: C.accentLight,
              letterSpacing: "0.1em",
              whiteSpace: "nowrap",
            }}>
              {tag}
            </div>
          </div>
        );
      })}

      {/* "TOO MANY GOALS. NO CLEAR PICTURE." */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        <div style={{ opacity: txtOpacity, transform: `scale(${interpolate(txtOpacity, [0, 1], [0.9, 1])})` }}>
          <div style={{ fontSize: 72, fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1 }}>
            TOO MANY GOALS.
          </div>
          <div style={{ fontSize: 52, fontWeight: 800, color: C.muted, letterSpacing: "-0.02em", marginTop: 8, opacity: txt2Opacity }}>
            NO CLEAR PICTURE.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 03: INTRODUCE WINTER ARC  (frames 180–300 / 0:06–0:10)
// ─────────────────────────────────────────────────────────────────────────────
function SceneIntro({ frame }: { frame: number }) {
  const lf = frame - INTRO_START;
  const opacity = clamp01(lf, 0, 120);

  const logoS  = spring({ frame: lf - 5,  fps: FPS, config: { damping: 16, stiffness: 200, mass: 1 } });
  const meetS  = spring({ frame: lf - 22, fps: FPS, config: { damping: 18, stiffness: 240 } });
  const nameS  = spring({ frame: lf - 38, fps: FPS, config: { damping: 14, stiffness: 220 } });
  const subS   = spring({ frame: lf - 56, fps: FPS, config: { damping: 18, stiffness: 200 } });

  // UI cards reveal
  const card1S = spring({ frame: lf - 72, fps: FPS, config: { damping: 22, stiffness: 180 } });
  const card2S = spring({ frame: lf - 80, fps: FPS, config: { damping: 22, stiffness: 180 } });
  const card3S = spring({ frame: lf - 88, fps: FPS, config: { damping: 22, stiffness: 180 } });

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bg }} />
      <MountainBg frame={lf} opacity={0.35} />
      <Vignette />
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "row",
        alignItems: "center",
        padding: "0 120px",
        gap: 80,
      }}>
        {/* Left: text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Logo pill */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 12,
            padding: "8px 20px", borderRadius: 999,
            border: `1px solid ${C.borderAccent}`,
            background: C.accentGlow,
            marginBottom: 24,
            transform: `scale(${logoS}) translateY(${interpolate(logoS, [0, 1], [20, 0])}px)`,
            opacity: logoS,
          }}>
            <LogoMark size={28} />
            <span style={{ fontSize: 14, fontWeight: 800, letterSpacing: "0.22em", color: C.accent, textTransform: "uppercase" }}>
              WINTER ARC
            </span>
          </div>

          <div style={{
            fontSize: 28, fontWeight: 700, color: C.muted,
            transform: `translateY(${interpolate(meetS, [0, 1], [30, 0])}px)`,
            opacity: meetS, marginBottom: 4,
          }}>MEET</div>

          <div style={{
            fontSize: 82, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 0.95,
            background: `linear-gradient(135deg, #ffffff 0%, ${C.accentLight} 100%)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            transform: `translateY(${interpolate(nameS, [0, 1], [50, 0])}px) scale(${interpolate(nameS, [0, 1], [0.9, 1])})`,
            opacity: nameS,
          }}>
            WINTER ARC.
          </div>

          <div style={{
            fontSize: 24, fontWeight: 600, color: C.muted, marginTop: 16, lineHeight: 1.4,
            transform: `translateY(${interpolate(subS, [0, 1], [20, 0])}px)`,
            opacity: subS,
          }}>
            YOUR PERSONAL<br />
            <strong style={{ color: C.text }}>PROGRESS TRACKER.</strong>
          </div>
        </div>

        {/* Right: mini UI preview cards */}
        <div style={{ width: 380, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12 }}>
          {[
            { label: "SLEEP",   val: "7h 42m", icon: "🌙", color: "#818cf8", s: card1S },
            { label: "FITNESS", val: "Day 28 ✓", icon: "💪", color: C.warn, s: card2S },
            { label: "WATER",   val: "2.8 / 3 L", icon: "💧", color: "#38bdf8", s: card3S },
          ].map(({ label, val, icon, color, s }) => (
            <div key={label} style={{
              padding: "14px 20px",
              borderRadius: 16,
              border: `1px solid ${C.border}`,
              background: C.card,
              backdropFilter: "blur(16px)",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              transform: `translateX(${interpolate(s, [0, 1], [60, 0])}px)`,
              opacity: s,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 22 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.muted, letterSpacing: "0.1em" }}>{label}</span>
              </div>
              <span style={{ fontSize: 16, fontWeight: 800, color }}>{val}</span>
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 04: WHAT CAN YOU TRACK?  (frames 300–420 / 0:10–0:14)
// ─────────────────────────────────────────────────────────────────────────────
function SceneTracking({ frame }: { frame: number }) {
  const lf = frame - TRACKING_START;
  const opacity = clamp01(lf, 0, 120);

  const items = [
    { word: "SLEEP.",    color: "#818cf8", icon: "🌙", enterAt: 4,  bg: "rgba(129,140,248,0.08)" },
    { word: "WAKE UP.",  color: C.warn,   icon: "☀️",  enterAt: 22, bg: "rgba(251,191,36,0.08)"  },
    { word: "FITNESS.",  color: C.warn,   icon: "💪",  enterAt: 40, bg: "rgba(251,146,60,0.08)"  },
    { word: "FOOD.",     color: "#34d399",icon: "🥗",  enterAt: 58, bg: "rgba(52,211,153,0.08)"  },
    { word: "HABITS.",   color: C.accent, icon: "✅",  enterAt: 76, bg: "rgba(46,155,255,0.08)"  },
    { word: "PROGRESS.", color: "#f472b6",icon: "📈",  enterAt: 94, bg: "rgba(244,114,182,0.08)" },
  ];

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bgDeep }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, rgba(30,58,120,0.2) 0%, transparent 70%)`,
      }} />

      {/* Grid layout of tracking items */}
      <div style={{
        position: "absolute", inset: 0,
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gridTemplateRows: "1fr 1fr",
        gap: 20,
        padding: "60px 80px",
      }}>
        {items.map(({ word, color, icon, enterAt, bg }) => {
          const s = spring({ frame: lf - enterAt, fps: FPS, config: { damping: 18, stiffness: 280, mass: 0.7 } });
          return (
            <div key={word} style={{
              borderRadius: 20,
              border: `1.5px solid ${color}44`,
              background: bg,
              backdropFilter: "blur(12px)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 10,
              transform: `translateY(${interpolate(s, [0, 1], [40, 0])}px) scale(${interpolate(s, [0, 1], [0.85, 1])})`,
              opacity: Math.min(1, s * 1.3),
            }}>
              <span style={{ fontSize: 40 }}>{icon}</span>
              <span style={{
                fontSize: 36, fontWeight: 900, color,
                letterSpacing: "-0.02em", textAlign: "center",
              }}>{word}</span>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 05: THE DATA  (frames 420–540 / 0:14–0:18)
// ─────────────────────────────────────────────────────────────────────────────
function SceneData({ frame }: { frame: number }) {
  const lf = frame - DATA_START;
  const opacity = clamp01(lf, 0, 120);

  const headerS  = spring({ frame: lf - 5,  fps: FPS, config: { damping: 18, stiffness: 240 } });
  const barsS    = spring({ frame: lf - 20, fps: FPS, config: { damping: 22, stiffness: 180 } });
  const graphS   = spring({ frame: lf - 55, fps: FPS, config: { damping: 20, stiffness: 160 } });
  const stopS    = spring({ frame: lf - 78, fps: FPS, config: { damping: 16, stiffness: 220 } });
  const seeingS  = spring({ frame: lf - 90, fps: FPS, config: { damping: 14, stiffness: 260 } });

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bg }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 80%, rgba(46,155,255,0.06) 0%, transparent 60%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "row",
        alignItems: "center", padding: "0 120px", gap: 80,
      }}>
        {/* Left: data bars */}
        <div style={{
          flex: 1,
          transform: `translateX(${interpolate(barsS, [0, 1], [-40, 0])}px)`,
          opacity: barsS,
        }}>
          <div style={{
            fontSize: 15, fontWeight: 800, letterSpacing: "0.18em", color: C.accent,
            textTransform: "uppercase", marginBottom: 20,
            transform: `translateY(${interpolate(headerS, [0, 1], [-20, 0])}px)`,
            opacity: headerS,
          }}>TODAY'S LOG</div>

          <DataBar label="WATER"   value={2.5}  max={3}   unit="L"   color="#38bdf8" frame={lf} enterAt={22} />
          <DataBar label="PROTEIN" value={96}   max={120} unit="g"   color="#f472b6" frame={lf} enterAt={30} />
          <DataBar label="STEPS"   value={8420} max={10000} unit="steps" color="#34d399" frame={lf} enterAt={38} />
          <DataBar label="STUDY"   value={2}    max={3}   unit="hrs" color="#818cf8" frame={lf} enterAt={46} />
        </div>

        {/* Right: graph + text */}
        <div style={{ width: 440, flexShrink: 0, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{
            borderRadius: 20,
            border: `1.5px solid ${C.borderAccent}`,
            background: C.card,
            padding: "20px 24px",
            transform: `translateX(${interpolate(graphS, [0, 1], [60, 0])}px)`,
            opacity: graphS,
          }}>
            <AnimatedLineGraph
              frame={lf}
              enterAt={55}
              duration={60}
              color={C.accent}
              width={390}
              height={90}
              data={[42, 48, 54, 62, 73, 85, 94]}
              startVal={42}
              endVal={94}
              unit="%"
              metricLabel="WEEKLY MOMENTUM"
              badgeText="+52% INCREASE"
              xLabels={["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]}
            />
          </div>

          <div style={{ textAlign: "center" }}>
            <div style={{
              fontSize: 56, fontWeight: 900, color: C.text, letterSpacing: "-0.02em",
              transform: `translateY(${interpolate(stopS, [0, 1], [30, 0])}px)`,
              opacity: stopS,
            }}>
              STOP GUESSING.
            </div>
            <div style={{
              fontSize: 68, fontWeight: 900, letterSpacing: "-0.03em",
              background: `linear-gradient(135deg, ${C.accent}, ${C.accentLight})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              transform: `scale(${interpolate(seeingS, [0, 1], [0.85, 1])})`,
              opacity: seeingS, lineHeight: 1,
            }}>
              START SEEING.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 06: THE SYSTEM  (frames 540–660 / 0:18–0:22)
// ─────────────────────────────────────────────────────────────────────────────
function SceneSystem({ frame }: { frame: number }) {
  const lf = frame - SYSTEM_START;
  const opacity = clamp01(lf, 0, 120);

  const words = ["LOG", "SEE", "UNDERSTAND", "IMPROVE"];
  const wordColors = [C.accentLight, "#93c5fd", "#60a5fa", C.good];
  const enterFrames = [5, 28, 54, 82];

  // Line connecting all words
  const lineS = spring({ frame: lf - 95, fps: FPS, config: { damping: 25, stiffness: 120 } });

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bgDeep }} />
      <MountainBg frame={lf} opacity={0.25} />
      <Vignette />

      {/* Big system line at top */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, transparent, ${C.accent}88, ${C.good}88, transparent)`,
        opacity: lf > 5 ? 0.7 : 0,
      }} />

      {/* Words stacked */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 8,
      }}>
        {words.map((word, i) => {
          const s = spring({ frame: lf - enterFrames[i], fps: FPS, config: { damping: 15, stiffness: 280, mass: 0.8 } });
          const isLast = i === words.length - 1;
          return (
            <div key={word} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{
                fontSize: isLast ? 100 : 88, fontWeight: 900,
                letterSpacing: "-0.04em", lineHeight: 1,
                color: wordColors[i],
                transform: `translateX(${interpolate(s, [0, 1], [i % 2 === 0 ? -80 : 80, 0])}px) scale(${interpolate(s, [0, 1], [0.8, 1])})`,
                opacity: Math.min(1, s * 1.2),
                textShadow: `0 0 60px ${wordColors[i]}55`,
              }}>
                {word}
              </div>
              {/* Arrow between words */}
              {!isLast && (
                <div style={{
                  fontSize: 22, color: `${wordColors[i]}88`, margin: "0px 0",
                  opacity: s,
                  transform: `scale(${s})`,
                }}>↓</div>
              )}
            </div>
          );
        })}

        {/* Horizontal flow version at bottom */}
        {lf > 95 && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginTop: 20,
            transform: `scale(${lineS})`, opacity: lineS,
            fontSize: 16, fontWeight: 800, letterSpacing: "0.15em",
          }}>
            {words.map((w, i) => (
              <React.Fragment key={w}>
                <span style={{
                  color: wordColors[i],
                  padding: "6px 16px", borderRadius: 8,
                  border: `1px solid ${wordColors[i]}55`,
                  background: `${wordColors[i]}12`,
                }}>
                  {w}
                </span>
                {i < words.length - 1 && (
                  <span style={{ color: C.accent, fontSize: 14 }}>→</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 07: THE PAYOFF / PROGRESS  (frames 660–750 / 0:22–0:25)
// ─────────────────────────────────────────────────────────────────────────────
function SceneProgress({ frame }: { frame: number }) {
  const lf = frame - PROGRESS_START;
  const opacity = clamp01(lf, 0, 90);

  const graph1S = spring({ frame: lf - 10, fps: FPS, config: { damping: 22, stiffness: 160 } });
  const graph2S = spring({ frame: lf - 22, fps: FPS, config: { damping: 22, stiffness: 160 } });
  const graph3S = spring({ frame: lf - 34, fps: FPS, config: { damping: 22, stiffness: 160 } });
  const txt1S   = spring({ frame: lf - 52, fps: FPS, config: { damping: 16, stiffness: 240 } });
  const txt2S   = spring({ frame: lf - 68, fps: FPS, config: { damping: 16, stiffness: 240 } });

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{ position: "absolute", inset: 0, background: C.bg }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 30%, rgba(46,155,255,0.07) 0%, transparent 60%)`,
      }} />

      {/* Graph cards row */}
      <div style={{
        position: "absolute", top: "12%", left: "6%", right: "6%",
        display: "flex", gap: 20,
      }}>
        {/* Card 1: Sleep */}
        <div style={{
          flex: 1, borderRadius: 18, border: `1.5px solid #818cf855`,
          background: C.card, padding: "18px 20px",
          transform: `translateY(${interpolate(graph1S, [0, 1], [-30, 0])}px)`,
          opacity: graph1S,
        }}>
          <AnimatedLineGraph
            frame={lf}
            enterAt={12}
            duration={55}
            color="#818cf8"
            width={340}
            height={85}
            data={[56, 62, 68, 75, 82, 88, 92]}
            startVal={56}
            endVal={92}
            unit=" pts"
            metricLabel="SLEEP RECOVERY"
            badgeText="+36 PTS"
            xLabels={["D1", "D5", "D10", "D15", "D20", "D25", "D30"]}
          />
        </div>

        {/* Card 2: Fitness Streak */}
        <div style={{
          flex: 1, borderRadius: 18, border: `1.5px solid ${C.good}55`,
          background: C.card, padding: "18px 20px",
          transform: `translateY(${interpolate(graph2S, [0, 1], [-30, 0])}px)`,
          opacity: graph2S,
        }}>
          <AnimatedBarChart
            frame={lf}
            enterAt={20}
            width={340}
            height={85}
            values={[35, 52, 65, 76, 85, 94, 100]}
            days={["M", "T", "W", "T", "F", "S", "S"]}
            color={C.good}
            metricLabel="FITNESS STREAK"
            currentStreak={28}
          />
        </div>

        {/* Card 3: Consistency Arc */}
        <div style={{
          flex: 1, borderRadius: 18, border: `1.5px solid ${C.accent}55`,
          background: C.card, padding: "18px 20px",
          transform: `translateY(${interpolate(graph3S, [0, 1], [-30, 0])}px)`,
          opacity: graph3S,
        }}>
          <AnimatedLineGraph
            frame={lf}
            enterAt={28}
            duration={55}
            color={C.accent}
            width={340}
            height={85}
            data={[32, 40, 50, 64, 78, 89, 96]}
            startVal={32}
            endVal={96}
            unit="%"
            metricLabel="ARC MOMENTUM"
            badgeText="+64% PEAK"
            xLabels={["W1", "W2", "W4", "W6", "W8", "W10", "W12"]}
          />
        </div>
      </div>

      {/* Emotional copy */}
      <div style={{
        position: "absolute", bottom: "18%", left: 0, right: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", textAlign: "center",
        fontFamily: FONT,
      }}>
        <div style={{
          fontSize: 64, fontWeight: 900, color: C.text, letterSpacing: "-0.03em",
          transform: `translateY(${interpolate(txt1S, [0, 1], [40, 0])}px)`,
          opacity: txt1S,
        }}>
          YOUR PROGRESS SHOULD BE VISIBLE.
        </div>
        <div style={{
          fontSize: 48, fontWeight: 800,
          background: `linear-gradient(135deg, ${C.accentLight}, ${C.good})`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          letterSpacing: "-0.02em", marginTop: 8,
          transform: `scale(${interpolate(txt2S, [0, 1], [0.88, 1])})`,
          opacity: txt2S,
        }}>
          NOT JUST FELT.
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 08: FREE CTA  (frames 750–810 / 0:25–0:27)
// ─────────────────────────────────────────────────────────────────────────────
function SceneCTA({ frame }: { frame: number }) {
  const lf = frame - CTA_START;
  const opacity = clamp01(lf, 0, 60);

  const bgS    = spring({ frame: lf - 2,  fps: FPS, config: { damping: 20, stiffness: 200 } });
  const txtS   = spring({ frame: lf - 8,  fps: FPS, config: { damping: 16, stiffness: 260 } });
  const freeS  = spring({ frame: lf - 22, fps: FPS, config: { damping: 12, stiffness: 320 } });
  const urlS   = spring({ frame: lf - 36, fps: FPS, config: { damping: 20, stiffness: 180 } });

  // URL "typed in" effect
  const fullUrl = "winterarc.indevs.in";
  const urlLen  = Math.floor(interpolate(lf, [36, 56], [0, fullUrl.length], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const visibleUrl = fullUrl.slice(0, urlLen);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <div style={{
        position: "absolute", inset: 0,
        background: `linear-gradient(180deg, ${C.bgDeep} 0%, ${C.bg} 100%)`,
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 50% 50%, rgba(46,155,255,0.10) 0%, transparent 65%)`,
        opacity: bgS,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", gap: 20,
      }}>
        <div style={{
          fontSize: 76, fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1,
          color: C.text,
          transform: `translateY(${interpolate(txtS, [0, 1], [60, 0])}px) scale(${interpolate(txtS, [0, 1], [0.85, 1])})`,
          opacity: txtS,
        }}>
          START YOUR<br />WINTER ARC.
        </div>

        <div style={{
          fontSize: 90, fontWeight: 900, letterSpacing: "-0.02em",
          color: C.good,
          transform: `scale(${interpolate(freeS, [0, 1], [0.6, 1.05])})`,
          opacity: freeS,
          textShadow: `0 0 60px ${C.good}88`,
          lineHeight: 1,
        }}>
          FREE.
        </div>

        {/* URL terminal reveal */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 28px", borderRadius: 12,
          border: `1.5px solid ${C.border}`,
          background: "rgba(255,255,255,0.04)",
          opacity: urlS,
          transform: `translateY(${interpolate(urlS, [0, 1], [20, 0])}px)`,
        }}>
          <span style={{ fontSize: 13, color: C.muted, fontFamily: "monospace", fontWeight: 600 }}>https://</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.accent, fontFamily: "monospace" }}>
            {visibleUrl}
            <span style={{ opacity: lf % 16 < 8 ? 1 : 0, color: C.accentLight }}>_</span>
          </span>
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SCENE 09: FINAL GEN-Z HOOK  (frames 810–900 / 0:27–0:30)
// ─────────────────────────────────────────────────────────────────────────────
function SceneFinal({ frame }: { frame: number }) {
  const lf = frame - FINAL_START;
  const opacity = interpolate(lf, [0, 12, 84, 90], [0, 1, 1, 0.95], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });

  const logoS    = spring({ frame: lf - 5,  fps: FPS, config: { damping: 16, stiffness: 220 } });
  const noMore   = spring({ frame: lf - 18, fps: FPS, config: { damping: 14, stiffness: 280 } });
  const startNow = spring({ frame: lf - 38, fps: FPS, config: { damping: 12, stiffness: 320 } });
  const tagline  = spring({ frame: lf - 58, fps: FPS, config: { damping: 20, stiffness: 200 } });
  const urlS     = spring({ frame: lf - 76, fps: FPS, config: { damping: 22, stiffness: 180 } });

  // Pulse glow for logo
  const pulse = 0.5 + 0.5 * Math.sin(lf * 0.15);

  return (
    <AbsoluteFill style={{ opacity, fontFamily: FONT }}>
      <MountainBg frame={lf + 100} opacity={1} />
      <Vignette />

      {/* Strong center vignette for focus */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(4,8,16,0.7) 100%)`,
      }} />

      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 12, textAlign: "center",
      }}>
        {/* Logo centered with pulse */}
        <div style={{
          transform: `scale(${logoS})`, opacity: logoS,
          filter: `drop-shadow(0 0 ${24 * pulse}px rgba(46,155,255,${0.7 * pulse}))`,
          marginBottom: 8,
        }}>
          <LogoMark size={72} color={C.accent} />
        </div>

        {/* NO MORE 'STARTING MONDAY.' */}
        <div style={{
          fontSize: 58, fontWeight: 900, color: C.text, letterSpacing: "-0.03em", lineHeight: 1.1,
          transform: `translateY(${interpolate(noMore, [0, 1], [50, 0])}px) scale(${interpolate(noMore, [0, 1], [0.85, 1])})`,
          opacity: noMore,
        }}>
          NO MORE<br />&ldquo;STARTING MONDAY.&rdquo;
        </div>

        {/* START NOW. */}
        <div style={{
          fontSize: 90, fontWeight: 900, letterSpacing: "-0.04em",
          background: `linear-gradient(135deg, ${C.accent} 0%, ${C.good} 100%)`,
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          transform: `scale(${interpolate(startNow, [0, 1], [0.7, 1])})`,
          opacity: startNow, lineHeight: 1,
          textShadow: "none",
          filter: `drop-shadow(0 0 40px rgba(46,155,255,${0.4 * startNow}))`,
        }}>
          START NOW.
        </div>

        {/* YOUR ARC. YOUR DATA. YOUR PROGRESS. */}
        {lf > 55 && (
          <div style={{
            display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center",
            transform: `translateY(${interpolate(tagline, [0, 1], [20, 0])}px)`,
            opacity: tagline,
          }}>
            {["YOUR ARC.", "YOUR DATA.", "YOUR PROGRESS."].map((t, i) => (
              <span key={t} style={{
                fontSize: 20, fontWeight: 800, color: i === 2 ? C.accent : C.muted,
                letterSpacing: "0.05em",
              }}>{t}</span>
            ))}
          </div>
        )}

        {/* URL */}
        <div style={{
          fontSize: 18, fontWeight: 700, color: C.accent, letterSpacing: "0.08em",
          fontFamily: "monospace",
          transform: `translateY(${interpolate(urlS, [0, 1], [15, 0])}px)`,
          opacity: urlS, marginTop: 4,
        }}>
          winterarc.indevs.in
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN 30-SECOND COMPOSITION
// ─────────────────────────────────────────────────────────────────────────────
export function WinterArcAd30s() {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{
      backgroundColor: C.bg,
      color: C.text,
      fontFamily: FONT,
      overflow: "hidden",
    }}>
      {/* ── BACKGROUND MUSIC (30s) ── */}
      <Audio
        src={staticFile("video-assets/winter-arc-30s-audio.wav")}
        volume={0.85}
        startFrom={0}
      />

      {/* ── SCENES ── */}
      {frame < PROBLEM_END     && <SceneHook     frame={frame} />}
      {frame >= PROBLEM_START  && frame < INTRO_END    && <SceneProblem  frame={frame} />}
      {frame >= INTRO_START    && frame < TRACKING_END && <SceneIntro    frame={frame} />}
      {frame >= TRACKING_START && frame < DATA_END     && <SceneTracking frame={frame} />}
      {frame >= DATA_START     && frame < SYSTEM_END   && <SceneData     frame={frame} />}
      {frame >= SYSTEM_START   && frame < PROGRESS_END && <SceneSystem   frame={frame} />}
      {frame >= PROGRESS_START && frame < CTA_END      && <SceneProgress frame={frame} />}
      {frame >= CTA_START      && frame < FINAL_END    && <SceneCTA      frame={frame} />}
      {frame >= FINAL_START                             && <SceneFinal    frame={frame} />}

      {/* Persistent cinematic vignette edge */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        boxShadow: "inset 0 0 180px rgba(0,0,0,0.65)",
      }} />

      {/* Safe area guide (invisible in render — helps during edit) */}
      {/* Center 1350×810 safe zone for vertical crop compatibility */}
    </AbsoluteFill>
  );
}
