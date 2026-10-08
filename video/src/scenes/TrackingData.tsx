import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface TrackingDataProps {
  frame: number;
}

export const TrackingDataScene: React.FC<TrackingDataProps> = ({ frame }) => {
  // 4 clean telemetry cards with subtle live rolling progress
  const metrics = [
    {
      label: "DAILY STEPS",
      val: 8420,
      target: 10000,
      unit: "STEPS",
      delay: 5,
    },
    {
      label: "NUTRITION",
      val: 96,
      target: 120,
      unit: "G PROTEIN",
      delay: 18,
    },
    {
      label: "DEEP FOCUS",
      val: 2,
      target: 3,
      unit: "HOURS",
      delay: 31,
    },
    {
      label: "BEDTIME ANCHOR",
      customVal: "10:28 PM",
      targetText: "OPTIMAL",
      unit: "CONSISTENT",
      delay: 44,
    },
  ];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background radial atmosphere */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(56, 189, 248, 0.08) 0%, transparent 70%)`,
        }}
      />

      {/* Top Header */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop - 15,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.26em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          DAILY TELEMETRY
        </span>
        <span
          style={{
            fontSize: 36,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          Every Day Builds the Baseline.
        </span>
      </div>

      {/* 2×2 Minimal Glassmorphic Data Cards */}
      <div
        style={{
          position: "absolute",
          top: "52%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
          zIndex: 10,
        }}
      >
        {metrics.map((m) => {
          const spr = spring({
            frame: Math.max(0, frame - m.delay),
            fps: FPS,
            config: { damping: 18, stiffness: 140, mass: 0.8 },
          });

          const opacity = interpolate(spr, [0, 1], [0, 1]);
          const scale = interpolate(spr, [0, 1], [0.92, 1]);

          // Rolling number progression
          const rollFactor = Math.min(1, Math.max(0, (frame - m.delay) / 35));
          const currentDisplay = m.customVal
            ? m.customVal
            : m.val !== undefined
            ? Math.round(m.val * rollFactor).toLocaleString()
            : "";

          return (
            <div
              key={m.label}
              style={{
                opacity,
                transform: `scale(${scale})`,
                background: "rgba(10, 16, 28, 0.8)",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                border: `1px solid ${BRAND_COLORS.cardBorder}`,
                borderRadius: 24,
                padding: "28px 24px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: BRAND_COLORS.textMuted,
                  textTransform: "uppercase",
                }}
              >
                {m.label}
              </div>

              <div
                style={{
                  fontSize: 42,
                  fontWeight: 900,
                  color: BRAND_COLORS.textPrimary,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1,
                }}
              >
                {currentDisplay}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 8,
                  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: BRAND_COLORS.accentIcy,
                  }}
                >
                  {m.unit}
                </span>

                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: BRAND_COLORS.textSecondary,
                  }}
                >
                  {m.target ? `GOAL ${m.target.toLocaleString()}` : m.targetText}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Subtle Demarcation */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: "0.16em",
          color: BRAND_COLORS.textMuted,
          textTransform: "uppercase",
        }}
      >
        DISCIPLINE IS AN ACCUMULATION OF DAYS
      </div>
    </div>
  );
};
