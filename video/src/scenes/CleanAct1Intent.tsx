import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct1IntentProps {
  frame: number;
}

export const CleanAct1Intent: React.FC<CleanAct1IntentProps> = ({ frame }) => {
  // Pacing:
  // f0 - f75 (0.0s - 2.5s): Opening breath & brand beacon
  // f75 - f150 (2.5s - 5.0s): "Winter is a quiet season."
  // f150 - f210 (5.0s - 7.0s): "Step back. Choose what truly matters. And build."

  const titleSpring = spring({
    frame: Math.max(0, frame - 15),
    fps: FPS,
    config: { damping: 18, stiffness: 140 },
  });

  const triadSpring1 = spring({
    frame: Math.max(0, frame - 130),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  const triadSpring2 = spring({
    frame: Math.max(0, frame - 155),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  const triadSpring3 = spring({
    frame: Math.max(0, frame - 180),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  // Crossfade between Phase 1 ("Winter is a quiet season") and Phase 2 ("Step back...")
  const phase1Opacity = interpolate(frame, [125, 145], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const phase2Opacity = interpolate(frame, [135, 155], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Gentle background ambient breathing
  const glowScale = 1 + Math.sin(frame * 0.05) * 0.08;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#050608",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
      }}
    >
      {/* Soft Ambient Radial Vignette */}
      <div
        style={{
          position: "absolute",
          width: 800,
          height: 800,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, rgba(3, 7, 18, 0) 70%)",
          transform: `scale(${glowScale})`,
          pointerEvents: "none",
        }}
      />

      {/* PHASE 1: "Winter is a quiet season." */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${SAFE_ZONE.paddingHorizontal}px`,
          textAlign: "center",
          opacity: phase1Opacity,
        }}
      >
        {/* Subtle Brand Tag */}
        <div
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.36em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 24,
            opacity: interpolate(titleSpring, [0, 1], [0, 0.9]),
            transform: `translateY(${interpolate(titleSpring, [0, 1], [15, 0])}px)`,
          }}
        >
          WINTER ARC
        </div>

        {/* Large Clean Headline */}
        <h1
          style={{
            fontSize: 74,
            fontWeight: 850,
            lineHeight: 1.12,
            letterSpacing: "-0.035em",
            color: "#f8fafc",
            margin: 0,
            maxWidth: 880,
            opacity: interpolate(titleSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(titleSpring, [0, 1], [0.94, 1])}) translateY(${interpolate(
              titleSpring,
              [0, 1],
              [24, 0]
            )}px)`,
          }}
        >
          Winter is a quiet season.
        </h1>
      </div>

      {/* PHASE 2: "Step back. Choose what truly matters. And build." */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: `0 ${SAFE_ZONE.paddingHorizontal}px`,
          textAlign: "center",
          gap: 20,
          opacity: phase2Opacity,
        }}
      >
        <div
          style={{
            fontSize: 58,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            color: "#94a3b8",
            lineHeight: 1.15,
            opacity: interpolate(triadSpring1, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(triadSpring1, [0, 1], [20, 0])}px)`,
          }}
        >
          A time to step back.
        </div>

        <div
          style={{
            fontSize: 62,
            fontWeight: 850,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            lineHeight: 1.15,
            opacity: interpolate(triadSpring2, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(triadSpring2, [0, 1], [20, 0])}px)`,
          }}
        >
          Choose what matters.
        </div>

        <div
          style={{
            fontSize: 84,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: BRAND_COLORS.accentIcy,
            lineHeight: 1.1,
            textShadow: `0 0 35px ${BRAND_COLORS.accentGlow}`,
            opacity: interpolate(triadSpring3, [0, 1], [0, 1]),
            transform: `scale(${interpolate(triadSpring3, [0, 1], [0.92, 1])}) translateY(${interpolate(
              triadSpring3,
              [0, 1],
              [20, 0]
            )}px)`,
          }}
        >
          And build.
        </div>
      </div>
    </div>
  );
};
