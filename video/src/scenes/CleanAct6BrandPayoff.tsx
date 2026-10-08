import React from "react";
import { interpolate, spring, staticFile } from "remotion";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct6BrandPayoffProps {
  frame: number;
}

export const CleanAct6BrandPayoff: React.FC<CleanAct6BrandPayoffProps> = ({
  frame,
}) => {
  // Pacing (195 frames = 6.5s / 32.5s to 39.0s):
  // f0 - f35: Emblem + "WINTER ARC" scales in
  // f35 - f70: Subtitle triad + FREE emerald badge
  // f60 - f195: Monospace URL card pill holds perfectly stable

  const emblemSpring = spring({
    frame,
    fps: FPS,
    config: { damping: 16, stiffness: 150, mass: 0.9 },
  });

  const triadSpring = spring({
    frame: Math.max(0, frame - 25),
    fps: FPS,
    config: { damping: 18, stiffness: 160 },
  });

  const ctaSpring = spring({
    frame: Math.max(0, frame - 45),
    fps: FPS,
    config: { damping: 18, stiffness: 160 },
  });

  const urlSpring = spring({
    frame: Math.max(0, frame - 65),
    fps: FPS,
    config: { damping: 18, stiffness: 160 },
  });

  // Soft cyan breathing glow behind emblem
  const glowPulse = 1 + Math.sin(frame * 0.08) * 0.06;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#070e1b", // Rich deep Midnight Alpine Canvas
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${SAFE_ZONE.paddingHorizontal}px`,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
      }}
    >
      {/* Subtle Geometric Lattice Watermark Pattern (exact match to friend's video style) */}
      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.045,
          pointerEvents: "none",
        }}
      >
        <defs>
          <pattern
            id="geometricGrid"
            width="80"
            height="80"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 40 0 L 80 40 L 40 80 L 0 40 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.2"
            />
            <path
              d="M 0 0 L 80 80 M 80 0 L 0 80"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.6"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#geometricGrid)" />
      </svg>

      {/* Soft Ambient Radial Glow */}
      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          height: 700,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, rgba(7, 14, 27, 0) 70%)",
          transformOrigin: "center center",
          pointerEvents: "none",
        }}
      />

      {/* Centered Brand Content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 22,
          zIndex: 20,
        }}
      >
        {/* Official Winter Arc Emblem */}
        <div
          style={{
            transform: `scale(${interpolate(emblemSpring, [0, 1], [0.75, 1])})`,
            opacity: emblemSpring,
            position: "relative",
          }}
        >
          {/* Halo Glow */}
          <div
            style={{
              position: "absolute",
              inset: -15,
              borderRadius: 36,
              background:
                "radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)",
              transform: `scale(${glowPulse})`,
              zIndex: 1,
            }}
          />
          <img
            src={staticFile("video-assets/emblem.png")}
            alt="Winter Arc"
            style={{
              width: 140,
              height: 140,
              borderRadius: 30,
              boxShadow:
                "0 20px 45px rgba(0, 0, 0, 0.7), 0 0 0 1.5px rgba(56, 189, 248, 0.4)",
              position: "relative",
              zIndex: 2,
            }}
          />
        </div>

        {/* Brand Headline: WINTER ARC */}
        <div
          style={{
            transform: `translateY(${interpolate(emblemSpring, [0, 1], [20, 0])}px)`,
            opacity: emblemSpring,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.28em",
              color: BRAND_COLORS.accentIcy,
              textTransform: "uppercase",
              marginBottom: 6,
            }}
          >
            START YOUR
          </span>
          <h1
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              margin: 0,
              lineHeight: 1,
              textShadow: "0 0 40px rgba(56, 189, 248, 0.25)",
            }}
          >
            WINTER ARC
          </h1>
        </div>

        {/* 3 Core Pillars: YOUR ARC. YOUR DATA. YOUR PROGRESS. */}
        <div
          style={{
            opacity: interpolate(triadSpring, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(triadSpring, [0, 1], [14, 0])}px)`,
            display: "flex",
            gap: 12,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#94a3b8",
            textTransform: "uppercase",
          }}
        >
          <span>YOUR ARC.</span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>•</span>
          <span>YOUR DATA.</span>
          <span style={{ color: "rgba(255,255,255,0.25)" }}>•</span>
          <span style={{ color: BRAND_COLORS.accentIcy }}>YOUR PROGRESS.</span>
        </div>

        {/* 100% FREE Pill Badge */}
        <div
          style={{
            opacity: interpolate(ctaSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(ctaSpring, [0, 1], [0.85, 1])})`,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 24px",
            borderRadius: 999,
            backgroundColor: "rgba(52, 211, 153, 0.12)",
            border: `1.5px solid ${BRAND_COLORS.emeraldPill}`,
            boxShadow: "0 0 20px rgba(52, 211, 153, 0.2)",
            marginTop: 4,
          }}
        >
          <span
            style={{
              fontSize: 15,
              fontWeight: 900,
              letterSpacing: "0.14em",
              color: BRAND_COLORS.emeraldPill,
            }}
          >
            100% FREE
          </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>•</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: "0.06em",
              color: "#f8fafc",
            }}
          >
            DISCIPLINE BUILDS FREEDOM
          </span>
        </div>

        {/* Clean URL Card Pill */}
        <div
          style={{
            opacity: interpolate(urlSpring, [0, 1], [0, 1]),
            transform: `scale(${interpolate(urlSpring, [0, 1], [0.88, 1])}) translateY(${interpolate(
              urlSpring,
              [0, 1],
              [16, 0]
            )}px)`,
            marginTop: 12,
            backgroundColor: "rgba(10, 18, 32, 0.95)",
            border: "1.5px solid rgba(56, 189, 248, 0.35)",
            boxShadow:
              "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.2)",
            borderRadius: 22,
            padding: "18px 46px",
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
              boxShadow: `0 0 12px ${BRAND_COLORS.accentIcy}`,
            }}
          />
          <span
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: "0.02em",
              color: "#ffffff",
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
