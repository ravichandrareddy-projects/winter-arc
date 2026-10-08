import React from "react";
import { AbsoluteFill, Sequence, useCurrentFrame } from "remotion";
import { CleanAct1Intent } from "./scenes/CleanAct1Intent";
import { CleanAct2FocusSelection } from "./scenes/CleanAct2FocusSelection";
import { CleanAct3DailyLogging } from "./scenes/CleanAct3DailyLogging";
import { CleanAct4GrowthPattern } from "./scenes/CleanAct4GrowthPattern";
import { CleanAct5SignaturePillars } from "./scenes/CleanAct5SignaturePillars";
import { CleanAct6BrandPayoff } from "./scenes/CleanAct6BrandPayoff";
import { AudioTimeline } from "./components/AudioTimeline";
import { BRAND_COLORS } from "./config/timeline";
import { Language } from "./config/languages";

export interface WinterArcAdProps {
  language?: Language;
  enableMusic?: boolean;
  enableVoice?: boolean;
}

// Master Timeline Constants (1,170 frames @ 30 FPS = 39.0s)
export const ACT_TIMELINE = {
  ACT_1_INTENT: { start: 0, duration: 195 },              // 0:00 - 0:06.5
  ACT_2_FOCUS_SELECTION: { start: 195, duration: 240 },   // 0:06.5 - 0:14.5
  ACT_3_DAILY_LOGGING: { start: 435, duration: 180 },     // 0:14.5 - 0:20.5
  ACT_4_GROWTH_PATTERN: { start: 615, duration: 210 },    // 0:20.5 - 0:27.5
  ACT_5_SIGNATURE_PILLARS: { start: 825, duration: 150 }, // 0:27.5 - 0:32.5
  ACT_6_BRAND_PAYOFF: { start: 975, duration: 195 },      // 0:32.5 - 0:39.0
} as const;

export const WinterArcAd: React.FC<WinterArcAdProps> = ({
  language = "en",
  enableMusic = true,
  enableVoice = true,
}) => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: "#050608",
        color: "#f8fafc",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
        overflow: "hidden",
      }}
    >
      {/* ── AUDIO MASTER ENGINE ────────────────────────────────────────── */}
      <AudioTimeline
        frame={frame}
        language={language}
        enableMusic={enableMusic}
        enableVoice={enableVoice}
      />

      {/* ── ACT 1: THE INTENT (0:00–0:06.5 | f0–f195) ──────────────────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_1_INTENT.start}
        durationInFrames={ACT_TIMELINE.ACT_1_INTENT.duration}
        name="Act 1 - Intent & Step Back"
      >
        <CleanAct1Intent frame={frame - ACT_TIMELINE.ACT_1_INTENT.start} />
      </Sequence>

      {/* ── ACT 2: SELECT YOUR FOCUS (0:06.5–0:14.5 | f195–f435) ──────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_2_FOCUS_SELECTION.start}
        durationInFrames={ACT_TIMELINE.ACT_2_FOCUS_SELECTION.duration}
        name="Act 2 - Focus Selection"
      >
        <CleanAct2FocusSelection
          frame={frame - ACT_TIMELINE.ACT_2_FOCUS_SELECTION.start}
        />
      </Sequence>

      {/* ── ACT 3: DAILY LOGGING (0:14.5–0:20.5 | f435–f615) ─────────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_3_DAILY_LOGGING.start}
        durationInFrames={ACT_TIMELINE.ACT_3_DAILY_LOGGING.duration}
        name="Act 3 - Daily Logging Actions"
      >
        <CleanAct3DailyLogging
          frame={frame - ACT_TIMELINE.ACT_3_DAILY_LOGGING.start}
        />
      </Sequence>

      {/* ── ACT 4: GROWTH PATTERN (0:20.5–0:27.5 | f615–f825) ─────────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_4_GROWTH_PATTERN.start}
        durationInFrames={ACT_TIMELINE.ACT_4_GROWTH_PATTERN.duration}
        name="Act 4 - Growth Pattern on Studio White"
      >
        <CleanAct4GrowthPattern
          frame={frame - ACT_TIMELINE.ACT_4_GROWTH_PATTERN.start}
        />
      </Sequence>

      {/* ── ACT 5: SIGNATURE PILLARS (0:27.5–0:32.5 | f825–f975) ──────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_5_SIGNATURE_PILLARS.start}
        durationInFrames={ACT_TIMELINE.ACT_5_SIGNATURE_PILLARS.duration}
        name="Act 5 - Log See Understand Improve"
      >
        <CleanAct5SignaturePillars
          frame={frame - ACT_TIMELINE.ACT_5_SIGNATURE_PILLARS.start}
        />
      </Sequence>

      {/* ── ACT 6: BRAND PAYOFF & CTA (0:32.5–0:39.0 | f975–f1170) ────── */}
      <Sequence
        from={ACT_TIMELINE.ACT_6_BRAND_PAYOFF.start}
        durationInFrames={ACT_TIMELINE.ACT_6_BRAND_PAYOFF.duration}
        name="Act 6 - Brand Payoff & CTA"
      >
        <CleanAct6BrandPayoff
          frame={frame - ACT_TIMELINE.ACT_6_BRAND_PAYOFF.start}
        />
      </Sequence>
    </AbsoluteFill>
  );
};
