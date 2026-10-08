import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct4GrowthPatternProps {
  frame: number;
}

export const CleanAct4GrowthPattern: React.FC<CleanAct4GrowthPatternProps> = ({
  frame,
}) => {
  // Pacing (210 frames = 7.0s / 20.5s to 27.5s):
  // f0 - f30: Clean flip into Studio Off-White canvas + card entrance
  // f30 - f120: Curve draws left to right, ticker counts from 34% to 92%
  // f100 - f150: Emerald badge springs in: "+68% INCREASE IN CONSISTENCY"
  // f140 - f210: Subtitle: "A quiet proof that consistency compounds."

  const cardEntrance = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 140 },
  });

  // Curve drawing progress (0 to 1) over f30 - f120
  const curveProgress = interpolate(frame, [30, 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Live counter
  const livePercent = Math.round(
    interpolate(curveProgress, [0, 1], [34, 92])
  );

  // Badge spring (~f100)
  const badgeSpring = spring({
    frame: Math.max(0, frame - 100),
    fps: FPS,
    config: { damping: 16, stiffness: 180 },
  });

  // Subtitle spring (~f135)
  const subtitleSpring = spring({
    frame: Math.max(0, frame - 135),
    fps: FPS,
    config: { damping: 18, stiffness: 160 },
  });

  // Data points for smooth curve
  const dataPoints = [
    { x: 40, y: 280, label: "Day 1" },
    { x: 180, y: 250, label: "Day 15" },
    { x: 340, y: 200, label: "Day 30" },
    { x: 500, y: 160, label: "Day 45" },
    { x: 660, y: 110, label: "Day 60" },
    { x: 820, y: 60, label: "Day 90" },
  ];

  // Head position
  const totalLength = dataPoints.length - 1;
  const currentIdxFloat = curveProgress * totalLength;
  const i0 = Math.floor(currentIdxFloat);
  const i1 = Math.min(totalLength, i0 + 1);
  const frac = currentIdxFloat - i0;

  const headX = interpolate(
    frac,
    [0, 1],
    [dataPoints[i0].x, dataPoints[i1].x]
  );
  const headY = interpolate(
    frac,
    [0, 1],
    [dataPoints[i0].y, dataPoints[i1].y]
  );

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#f8fafc", // Pristine Studio Off-White Canvas
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
      {/* Soft Ethereal Radial Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.05) 0%, rgba(248, 250, 252, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Container Card */}
      <div
        style={{
          width: "100%",
          maxWidth: 960,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          transform: `scale(${interpolate(cardEntrance, [0, 1], [0.93, 1])}) translateY(${interpolate(
            cardEntrance,
            [0, 1],
            [30, 0]
          )}px)`,
          opacity: cardEntrance,
        }}
      >
        {/* Category Pill Tag */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.22em",
            color: "#0284c7",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          LONG-TERM TRAJECTORY
        </div>

        {/* Clean Headline */}
        <h2
          style={{
            fontSize: 60,
            fontWeight: 850,
            letterSpacing: "-0.035em",
            color: "#0f172a",
            margin: "0 0 44px 0",
            textAlign: "center",
          }}
        >
          Data Becomes a Pattern.
        </h2>

        {/* High-Contrast Minimalist White Metric Card */}
        <div
          style={{
            width: "100%",
            borderRadius: 36,
            backgroundColor: "#ffffff",
            border: "1.5px solid rgba(0, 0, 0, 0.07)",
            boxShadow:
              "0 24px 60px rgba(15, 23, 42, 0.08), 0 0 1px rgba(0, 0, 0, 0.1)",
            padding: "36px 44px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Card Top: Metric Header & Emerald Pill */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              marginBottom: 28,
            }}
          >
            <div>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 800,
                  letterSpacing: "0.14em",
                  color: "#64748b",
                  textTransform: "uppercase",
                }}
              >
                DISCIPLINE COMPOUND CURVE
              </span>
              <div
                style={{
                  fontSize: 72,
                  fontWeight: 900,
                  letterSpacing: "-0.04em",
                  color: "#0f172a",
                  lineHeight: 1,
                  marginTop: 6,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {livePercent}%
              </div>
            </div>

            {/* Emerald Increase Badge */}
            <div
              style={{
                padding: "10px 22px",
                borderRadius: 999,
                backgroundColor: "#ecfdf5",
                border: "1.5px solid #10b981",
                boxShadow: "0 4px 14px rgba(16, 185, 129, 0.15)",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transform: `scale(${interpolate(badgeSpring, [0, 1], [0.8, 1])})`,
                opacity: badgeSpring,
              }}
            >
              <span style={{ fontSize: 16, color: "#10b981", fontWeight: 900 }}>
                ↑
              </span>
              <span
                style={{
                  fontSize: 15,
                  fontWeight: 850,
                  letterSpacing: "0.06em",
                  color: "#047857",
                }}
              >
                +68% INCREASE
              </span>
            </div>
          </div>

          {/* SVG Graph Canvas */}
          <div style={{ width: "100%", height: 320, position: "relative" }}>
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 860 320"
              preserveAspectRatio="none"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.28" />
                  <stop offset="85%" stopColor="#0284c7" stopOpacity="0.03" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Gridlines */}
              <line
                x1="40"
                y1="80"
                x2="820"
                y2="80"
                stroke="rgba(0,0,0,0.06)"
                strokeDasharray="4 4"
              />
              <line
                x1="40"
                y1="180"
                x2="820"
                y2="180"
                stroke="rgba(0,0,0,0.06)"
                strokeDasharray="4 4"
              />
              <line
                x1="40"
                y1="280"
                x2="820"
                y2="280"
                stroke="rgba(0,0,0,0.12)"
              />

              {/* Area Under Curve */}
              {curveProgress > 0 && (
                <path
                  d={`M 40 280 L 40 ${dataPoints[0].y} Q 340 200, ${headX} ${headY} L ${headX} 280 Z`}
                  fill="url(#curveGradient)"
                />
              )}

              {/* Smooth Spline Curve */}
              {curveProgress > 0 && (
                <path
                  d={`M 40 ${dataPoints[0].y} Q 340 200, ${headX} ${headY}`}
                  stroke="#0284c7"
                  strokeWidth="5"
                  strokeLinecap="round"
                  fill="none"
                  style={{ filter: "drop-shadow(0 4px 10px rgba(2,132,199,0.3))" }}
                />
              )}

              {/* Leading Core Dot */}
              {curveProgress > 0 && (
                <circle
                  cx={headX}
                  cy={headY}
                  r="7"
                  fill="#ffffff"
                  stroke="#0284c7"
                  strokeWidth="4"
                  style={{ filter: "drop-shadow(0 2px 8px rgba(2,132,199,0.4))" }}
                />
              )}

              {/* X-Axis Day Labels */}
              {dataPoints.map((pt) => (
                <text
                  key={pt.label}
                  x={pt.x}
                  y="312"
                  fontSize="13"
                  fontWeight="700"
                  fill="#94a3b8"
                  textAnchor="middle"
                  style={{
                    fontFamily:
                      '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
                  }}
                >
                  {pt.label}
                </text>
              ))}
            </svg>
          </div>
        </div>

        {/* Subtitle Outside Card */}
        <div
          style={{
            marginTop: 40,
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            color: "#64748b",
            textAlign: "center",
            opacity: subtitleSpring,
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [15, 0])}px)`,
          }}
        >
          A quiet proof that consistency compounds.
        </div>
      </div>
    </div>
  );
};
