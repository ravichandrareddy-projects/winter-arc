export const FPS = 30;
export const TOTAL_DURATION_SECONDS = 39;
export const TOTAL_FRAMES = 1170; // 39s * 30fps

export const VOICE_START_FRAME = 0; // Starts right with Act 1

export const TIMELINE = {
  SCENE_01_OPENING: {
    start: 0,
    end: 75,
    startSec: 0,
    endSec: 2.5,
    name: "Winter Arrives",
    voLine: "", // Pure atmospheric wind, snow, and title reveal
  },
  SCENE_02_CHALLENGE: {
    start: 75,
    end: 285,
    startSec: 2.5,
    endSec: 9.5,
    name: "The Challenge",
    voLine: "Winter is a quiet season. A time to step back, choose what truly matters, and build.",
  },
  SCENE_03_CHOOSE_ARC: {
    start: 285,
    end: 445,
    startSec: 9.5,
    endSec: 14.83,
    name: "Choose Your Arc",
    voLine: "Whether it's your sleep, your fitness, your nutrition, or your focus... the challenge is personal.",
  },
  SCENE_04_PRODUCT_INTRO: {
    start: 445,
    end: 615,
    startSec: 14.83,
    endSec: 20.5,
    name: "Winter Arc Reveal",
    voLine: "Every day, you log the small actions.",
  },
  SCENE_05_TRACKING_DATA: {
    start: 615,
    end: 780,
    startSec: 20.5,
    endSec: 26.0,
    name: "Tracking Telemetry",
    voLine: "And slowly, the numbers stop being just data.",
  },
  SCENE_06_PATTERN_HERO: {
    start: 780,
    end: 945,
    startSec: 26.0,
    endSec: 31.5,
    name: "The Pattern",
    voLine: "They become a pattern. A quiet proof that consistency compounds.",
  },
  SCENE_07_SYSTEM_PIPELINE: {
    start: 945,
    end: 1065,
    startSec: 31.5,
    endSec: 35.5,
    name: "System Morph",
    voLine: "Log. See. Understand. Improve.",
  },
  SCENE_08_CINEMATIC_CTA: {
    start: 1065,
    end: 1170,
    startSec: 35.5,
    endSec: 39.0,
    name: "The Payoff & Invitation",
    voLine: "Start your Winter Arc.",
  },
} as const;

export const BRAND_COLORS = {
  bgDeep: "#03060c",
  bgDark: "#060a12",
  bgCard: "rgba(10, 16, 28, 0.75)",
  cardBorder: "rgba(255, 255, 255, 0.08)",
  cardBorderIcy: "rgba(147, 197, 253, 0.22)",
  cardBorderGlow: "rgba(56, 189, 248, 0.45)",
  textPrimary: "#f8fafc",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
  accentIcy: "#38bdf8",
  accentCyan: "#7dd3fc",
  accentSilver: "#e2e8f0",
  accentGlow: "rgba(56, 189, 248, 0.22)",
  subtleLine: "rgba(186, 230, 253, 0.35)",
  emeraldPill: "#34d399",
  successEmerald: "#34d399",
  warningAmber: "#fbbf24",
  dangerCoral: "#fb7185",
  purpleSleep: "#818cf8",
};

export const SAFE_ZONE = {
  width: 1080,
  height: 1920,
  paddingTop: 180,
  paddingBottom: 220,
  paddingHorizontal: 72,
};
