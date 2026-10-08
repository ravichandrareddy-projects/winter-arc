import React from "react";
import { interpolate, spring } from "remotion";
import { AnimatedGraph } from "../components/AnimatedGraph";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface GraphHeroProps {
  frame: number;
}

export const GraphHeroScene: React.FC<GraphHeroProps> = ({ frame }) => {
  // 4 Core Philosophy Steps: LOG → SEE → UNDERSTAND → IMPROVE
  const steps = [
    { label: "LOG", delay: 45, x: 130 },
    { label: "SEE", delay: 58, x: 380 },
    { label: "UNDERSTAND", delay: 71, x: 670 },
    { label: "IMPROVE", delay: 84, x: 950 },
  ];

  // Pipeline laser connector line drawing progress
  const laserProgress = interpolate(frame, [45, 100], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
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
      {/* High-intensity Icy Blue Hero Atmosphere Glow */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "10%",
          width: "80%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(46, 155, 255, 0.28) 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Header Text */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop - 10,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: BRAND_COLORS.accentCyan,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          THE VISIBLE TRANSFORMATION
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          It's something you can see.
        </div>
      </div>

      {/* Hero Animated Graph (0 to 60 frames draw reveal) */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <AnimatedGraph
          frame={frame}
          startFrame={0}
          width={960}
          height={480}
          dataPoints={[20, 32, 45, 40, 62, 58, 76, 85, 96]}
        />
      </div>

      {/* SIGNATURE WINTER ARC VISUAL: LOG → SEE → UNDERSTAND → IMPROVE */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 140,
          left: SAFE_ZONE.paddingHorizontal - 10,
          right: SAFE_ZONE.paddingHorizontal - 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 20,
        }}
      >
        {/* Category Label */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: BRAND_COLORS.textSecondary,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          THE WINTER ARC SYSTEM
        </div>

        {/* Word pipeline with connected laser line */}
        <div
          style={{
            position: "relative",
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "24px 20px",
            background: "rgba(11, 19, 34, 0.82)",
            border: `1.5px solid ${BRAND_COLORS.cardBorderIcy}`,
            borderRadius: 24,
            boxShadow: `0 14px 40px rgba(0,0,0,0.6), 0 0 20px rgba(46, 155, 255, 0.25)`,
          }}
        >
          {/* Animated Connecting Laser Beam */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: 40,
              width: `${laserProgress * (960 - 180)}px`,
              height: 3,
              background: `linear-gradient(90deg, #38bdf8, #2e9bff)`,
              boxShadow: `0 0 12px #38bdf8`,
              transform: "translateY(-50%)",
              zIndex: 1,
            }}
          />

          {steps.map((step, idx) => {
            const spr = spring({
              frame: Math.max(0, frame - step.delay),
              fps: FPS,
              config: { damping: 14, stiffness: 220, mass: 0.6 },
            });

            const scale = interpolate(spr, [0, 1], [0.6, 1]);
            const opacity = interpolate(spr, [0, 1], [0, 1]);
            const active = frame >= step.delay;

            return (
              <div
                key={step.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  transform: `scale(${scale})`,
                  opacity,
                  position: "relative",
                  zIndex: 2,
                }}
              >
                <div
                  style={{
                    padding: "10px 18px",
                    borderRadius: 14,
                    background: active
                      ? "rgba(46, 155, 255, 0.24)"
                      : "rgba(255, 255, 255, 0.05)",
                    border: `1px solid ${
                      active ? BRAND_COLORS.accentIcy : "rgba(255, 255, 255, 0.1)"
                    }`,
                    fontSize: 20,
                    fontWeight: 900,
                    letterSpacing: "0.08em",
                    color: active
                      ? BRAND_COLORS.textPrimary
                      : BRAND_COLORS.textMuted,
                    boxShadow: active
                      ? `0 0 16px ${BRAND_COLORS.accentGlow}`
                      : undefined,
                  }}
                >
                  {step.label}
                </div>

                {idx < steps.length - 1 && (
                  <span
                    style={{
                      color: active
                        ? BRAND_COLORS.accentCyan
                        : "rgba(255,255,255,0.2)",
                      fontSize: 18,
                      fontWeight: 900,
                    }}
                  >
                    →
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
