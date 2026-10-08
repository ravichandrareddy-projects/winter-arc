import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct5SignaturePillarsProps {
  frame: number;
}

export const CleanAct5SignaturePillars: React.FC<CleanAct5SignaturePillarsProps> = ({
  frame,
}) => {
  // Pacing (150 frames = 5.0s / 27.5s to 32.5s):
  // f0 - f40: "Winter Arc makes that progress visible."
  // f45 ("Log."): Word 1 hits
  // f70 ("See."): Word 2 hits
  // f92 ("Understand."): Word 3 hits
  // f120 ("Improve."): Word 4 hits (brand cyan, giant scale)

  const headerSpring = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 140 },
  });

  const wordSpring1 = spring({
    frame: Math.max(0, frame - 45),
    fps: FPS,
    config: { damping: 14, stiffness: 220 },
  });

  const wordSpring2 = spring({
    frame: Math.max(0, frame - 70),
    fps: FPS,
    config: { damping: 14, stiffness: 220 },
  });

  const wordSpring3 = spring({
    frame: Math.max(0, frame - 92),
    fps: FPS,
    config: { damping: 14, stiffness: 220 },
  });

  const wordSpring4 = spring({
    frame: Math.max(0, frame - 120),
    fps: FPS,
    config: { damping: 12, stiffness: 200 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#f8fafc",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: `0 ${SAFE_ZONE.paddingHorizontal}px`,
        textAlign: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
      }}
    >
      {/* Soft Ambient Radial Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.05) 0%, rgba(248, 250, 252, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header */}
      <div
        style={{
          position: "absolute",
          top: 180,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          opacity: headerSpring,
          transform: `translateY(${interpolate(headerSpring, [0, 1], [20, 0])}px)`,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.24em",
            color: "#0284c7",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          THE WINTER ARC ENGINE
        </div>
        <div
          style={{
            fontSize: 32,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "#64748b",
          }}
        >
          Progress made visible.
        </div>
      </div>

      {/* Main 4 Signature Words (The Triad + Climax Rhythm) */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          marginTop: 60,
        }}
      >
        {/* WORD 1: LOG. */}
        {frame >= 40 && (
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#0f172a",
              lineHeight: 1,
              transform: `scale(${interpolate(wordSpring1, [0, 1], [0.85, 1])}) translateY(${interpolate(
                wordSpring1,
                [0, 1],
                [20, 0]
              )}px)`,
              opacity: wordSpring1,
            }}
          >
            Log.
          </div>
        )}

        {/* WORD 2: SEE. */}
        {frame >= 65 && (
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#0f172a",
              lineHeight: 1,
              transform: `scale(${interpolate(wordSpring2, [0, 1], [0.85, 1])}) translateY(${interpolate(
                wordSpring2,
                [0, 1],
                [20, 0]
              )}px)`,
              opacity: wordSpring2,
            }}
          >
            See.
          </div>
        )}

        {/* WORD 3: UNDERSTAND. */}
        {frame >= 88 && (
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              letterSpacing: "-0.04em",
              color: "#0f172a",
              lineHeight: 1,
              transform: `scale(${interpolate(wordSpring3, [0, 1], [0.85, 1])}) translateY(${interpolate(
                wordSpring3,
                [0, 1],
                [20, 0]
              )}px)`,
              opacity: wordSpring3,
            }}
          >
            Understand.
          </div>
        )}

        {/* WORD 4: IMPROVE. (Brand Cyan Climax) */}
        {frame >= 115 && (
          <div
            style={{
              fontSize: 106,
              fontWeight: 900,
              letterSpacing: "-0.05em",
              color: "#0284c7",
              lineHeight: 1,
              marginTop: 10,
              textShadow: "0 4px 25px rgba(2, 132, 199, 0.25)",
              transform: `scale(${interpolate(wordSpring4, [0, 1], [0.8, 1])}) translateY(${interpolate(
                wordSpring4,
                [0, 1],
                [24, 0]
              )}px)`,
              opacity: wordSpring4,
            }}
          >
            Improve.
          </div>
        )}
      </div>
    </div>
  );
};
