import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS } from "../config/timeline";

interface DataCounterProps {
  frame: number;
  startFrame?: number;
  durationInFrames?: number;
  value: number;
  formatFn?: (val: number) => string;
  label: string;
  unit?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  cardVariant?: "glass" | "solid" | "compact";
}

export const DataCounter: React.FC<DataCounterProps> = ({
  frame,
  startFrame = 0,
  durationInFrames = 40,
  value,
  formatFn,
  label,
  unit,
  icon,
  accentColor = BRAND_COLORS.accentIcy,
  cardVariant = "glass",
}) => {
  const localFrame = Math.max(0, frame - startFrame);

  const spr = spring({
    frame: localFrame,
    fps: FPS,
    config: { damping: 18, stiffness: 140, mass: 0.8 },
  });

  const cardScale = interpolate(spr, [0, 1], [0.85, 1]);
  const cardOpacity = interpolate(spr, [0, 1], [0, 1]);
  const cardY = interpolate(spr, [0, 1], [30, 0]);

  // Roll number from 0 to target value
  const progress = interpolate(localFrame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const easedProgress = Math.min(1, Math.max(0, 1 - Math.pow(1 - progress, 3)));
  const displayedValue = Math.round(value * easedProgress);

  const formattedDisplay = formatFn
    ? formatFn(displayedValue)
    : displayedValue.toLocaleString();

  return (
    <div
      style={{
        transform: `translateY(${cardY}px) scale(${cardScale})`,
        opacity: cardOpacity,
        background:
          cardVariant === "glass"
            ? "rgba(13, 21, 35, 0.78)"
            : "rgba(10, 16, 28, 0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: `1px solid ${BRAND_COLORS.cardBorderIcy}`,
        borderRadius: 24,
        padding: "24px 32px",
        boxShadow: `0 12px 36px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 24px ${accentColor}22`,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        minWidth: 260,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: BRAND_COLORS.textSecondary,
          }}
        >
          {label}
        </span>
        {icon && (
          <div
            style={{
              color: accentColor,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
        }}
      >
        <span
          style={{
            fontSize: 54,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "-0.03em",
            color: BRAND_COLORS.textPrimary,
            textShadow: `0 0 20px ${accentColor}44`,
          }}
        >
          {formattedDisplay}
        </span>
        {unit && (
          <span
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: accentColor,
              letterSpacing: "0.05em",
            }}
          >
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};
