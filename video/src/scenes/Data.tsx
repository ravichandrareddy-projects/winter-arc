import React from "react";
import { interpolate, spring } from "remotion";
import { DataCounter } from "../components/DataCounter";
import { DataPoint } from "../components/DataPoint";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface DataProps {
  frame: number;
}

export const DataScene: React.FC<DataProps> = ({ frame }) => {
  // Phase 1 (f0 - f85): Numbers count up and appear in 2x2 grid
  // Phase 2 (f85 - f150): Cards dissolve and collapse into concentrated glowing data points travelling toward the center-bottom graph position!

  const collapseProgress = interpolate(frame, [85, 125], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cards = [
    {
      label: "STEPS",
      value: 8420,
      unit: "DAILY",
      accent: BRAND_COLORS.successEmerald,
      delay: 5,
      origX: 280,
      origY: 760,
    },
    {
      label: "PROTEIN",
      value: 96,
      unit: "G",
      accent: BRAND_COLORS.dangerCoral,
      delay: 15,
      origX: 780,
      origY: 760,
    },
    {
      label: "SLEEP",
      value: 402, // 6h 42m in minutes
      formatFn: () => "6h 42m",
      unit: "REST",
      accent: BRAND_COLORS.purpleSleep,
      delay: 25,
      origX: 280,
      origY: 1040,
    },
    {
      label: "STUDY",
      value: 2,
      unit: "HRS",
      accent: BRAND_COLORS.accentCyan,
      delay: 35,
      origX: 780,
      origY: 1040,
    },
  ];

  // Target convergence point for graph entrance: (540, 1200)
  const targetX = 540;
  const targetY = 1200;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(46, 155, 255, 0.1) 0%, transparent 70%)`,
        }}
      />

      {/* Top Philosophical Hook Text */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop,
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
            marginBottom: 8,
          }}
        >
          TELEMETRY & FEEDBACK
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          Progress isn't just something you feel.
        </div>
      </div>

      {/* 2x2 Metric Cards Grid */}
      <div
        style={{
          position: "absolute",
          top: "44%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 24,
          opacity: 1 - collapseProgress,
          zIndex: 10,
        }}
      >
        {cards.map((card, i) => (
          <DataCounter
            key={card.label}
            frame={frame}
            startFrame={card.delay}
            value={card.value}
            formatFn={card.formatFn}
            label={card.label}
            unit={card.unit}
            accentColor={card.accent}
          />
        ))}
      </div>

      {/* Points Collapse & Flight Transformation (f85 - f150) */}
      {frame >= 85 && (
        <div style={{ position: "absolute", inset: 0, zIndex: 30 }}>
          {cards.map((card, idx) => {
            const curX = interpolate(collapseProgress, [0, 1], [card.origX, targetX]);
            const curY = interpolate(collapseProgress, [0, 1], [card.origY, targetY]);

            return (
              <DataPoint
                key={idx}
                x={curX}
                y={curY}
                size={22}
                color={card.accent}
                pulse
                frame={frame}
                opacity={interpolate(collapseProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0.2])}
                label={collapseProgress < 0.5 ? card.label : undefined}
              />
            );
          })}
        </div>
      )}

      {/* Illustrative data disclaimer */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          color: BRAND_COLORS.textMuted,
        }}
      >
        *DEMO TELEMETRY • YOUR GOALS ADAPT TO YOUR ARC
      </div>
    </div>
  );
};
