import React from "react";
import { interpolate, spring } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { LogoReveal } from "../components/LogoReveal";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CinematicCTAProps {
  frame: number;
}

export const CinematicCTAScene: React.FC<CinematicCTAProps> = ({ frame }) => {
  // Pacing (135 frames = 4.5s):
  // f0 - f35: Subtle mountain background, "YOUR ARC. YOUR DATA. YOUR PROGRESS."
  // f35 - f70: Winter Arc centered emblem + "START YOUR WINTER ARC"
  // f70 - f135: "100% FREE" badge + "winterarc.indevs.in" (held steady, peaceful, legible)

  const triadSpring = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 140 },
  });

  const ctaSpring = spring({
    frame: Math.max(0, frame - 30),
    fps: FPS,
    config: { damping: 16, stiffness: 150, mass: 0.8 },
  });

  const urlSpring = spring({
    frame: Math.max(0, frame - 55),
    fps: FPS,
    config: { damping: 18, stiffness: 160 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Dark Mountain Ambient Backdrop */}
      <MountainBackground
        frame={frame + 1050}
        opacity={0.65}
        zoom={1.02}
        panY={-10}
      />

      {/* Atmospheric Cold Snowflakes */}
      <SnowParticles frame={frame + 1050} count={32} opacity={0.65} />

      {/* Main Centered Content */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 24,
          zIndex: 20,
        }}
      >
        {/* Official Logo */}
        <LogoReveal frame={frame} size={150} showWordmark={false} pulse />

        {/* The 3 Core Pillars: YOUR ARC. YOUR DATA. YOUR PROGRESS. */}
        <div
          style={{
            opacity: interpolate(triadSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(triadSpring, [0, 1], [15, 0])}px)`,
            display: "flex",
            gap: 12,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.24em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
          }}
        >
          <span>YOUR ARC.</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
          <span>YOUR DATA.</span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
          <span>YOUR PROGRESS.</span>
        </div>

        {/* Large Clean Headline: START YOUR WINTER ARC */}
        <div
          style={{
            opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(ctaSpring, [0, 1], [0.92, 1])})`,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1.05,
          }}
        >
          <span
            style={{
              fontSize: 60,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: BRAND_COLORS.textPrimary,
            }}
          >
            START YOUR
          </span>
          <span
            style={{
              fontSize: 74,
              fontWeight: 900,
              letterSpacing: "0.08em",
              color: BRAND_COLORS.accentIcy,
              textShadow: `0 0 32px ${BRAND_COLORS.accentGlow}, 0 0 10px #7dd3fc`,
            }}
          >
            WINTER ARC
          </span>
        </div>

        {/* FREE Tag Pill */}
        <div
          style={{
            opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 24px",
            borderRadius: 999,
            background: "rgba(52, 211, 153, 0.15)",
            border: `1px solid ${BRAND_COLORS.emeraldPill}`,
            boxShadow: "0 0 16px rgba(52, 211, 153, 0.25)",
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.18em",
              color: BRAND_COLORS.emeraldPill,
            }}
          >
            100% FREE
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: BRAND_COLORS.textPrimary,
            }}
          >
            DISCIPLINE BUILDS FREEDOM
          </span>
        </div>

        {/* Clean URL Card Pill */}
        <div
          style={{
            opacity: interpolate(urlSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(urlSpring, [0, 1], [0.85, 1])}) translateY(${interpolate(
              urlSpring,
              [0, 1],
              [16, 0]
            )}px)`,
            marginTop: 6,
            background: "rgba(10, 16, 28, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1.5px solid ${BRAND_COLORS.cardBorderIcy}`,
            boxShadow: `0 16px 40px rgba(0, 0, 0, 0.6), 0 0 24px rgba(56, 189, 248, 0.2)`,
            borderRadius: 22,
            padding: "18px 44px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: BRAND_COLORS.accentIcy,
              boxShadow: `0 0 10px ${BRAND_COLORS.accentIcy}`,
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: BRAND_COLORS.textPrimary,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            }}
          >
            winterarc.indevs.in
          </span>
        </div>
      </div>
    </div>
  );
};
