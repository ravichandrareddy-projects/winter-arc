import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS } from "../config/timeline";

interface AnimatedGraphProps {
  frame: number;
  startFrame?: number;
  width?: number;
  height?: number;
  dataPoints?: number[];
  color?: string;
  showFormulaBar?: boolean;
}

export const AnimatedGraph: React.FC<AnimatedGraphProps> = ({
  frame,
  startFrame = 0,
  width = 920,
  height = 420,
  dataPoints = [24, 38, 32, 54, 49, 72, 68, 88, 94],
  color = BRAND_COLORS.accentIcy,
  showFormulaBar = true,
}) => {
  const localFrame = Math.max(0, frame - startFrame);

  // Growth progress: from 0 to 1 over 50 frames
  const drawProgress = interpolate(localFrame, [0, 50], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Smooth cubic easing
  const easedDraw =
    drawProgress < 0.5
      ? 4 * drawProgress * drawProgress * drawProgress
      : 1 - Math.pow(-2 * drawProgress + 2, 3) / 2;

  // Staggered points coordinate calculation
  const paddingX = 40;
  const paddingY = 40;
  const graphW = width - paddingX * 2;
  const graphH = height - paddingY * 2;

  const points = dataPoints.map((val, idx) => {
    const x = paddingX + (idx / (dataPoints.length - 1)) * graphW;
    const normVal = (val - 15) / 85;
    // Animate upward lift
    const targetY = height - paddingY - normVal * graphH;
    const baselineY = height - paddingY;
    const pointProgress = Math.min(
      1,
      Math.max(0, easedDraw * 1.3 - (idx / dataPoints.length) * 0.4)
    );
    const y = interpolate(pointProgress, [0, 1], [baselineY, targetY]);

    return { x, y, val, reached: pointProgress > 0.85 };
  });

  // Construct smooth Bezier curve SVG Path
  let linePath = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    const midY = (p0.y + p1.y) / 2;
    linePath += ` Q ${p0.x} ${p0.y}, ${midX} ${midY}`;
  }
  // Finish curve to last point
  const lastPt = points[points.length - 1];
  linePath += ` T ${lastPt.x} ${lastPt.y}`;

  // Area path for gradient fill
  const areaPath = `${linePath} L ${lastPt.x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`;

  // Total path length approximation for strokeDasharray
  const totalLength = 1400;
  const dashOffset = (1 - easedDraw) * totalLength;

  // Current live metric counter rolling up
  const currentMetric = Math.round(
    interpolate(easedDraw, [0, 1], [24, 94])
  );

  return (
    <div
      style={{
        width,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Top Header with live stats and momentum badge */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "0 10px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.14em",
              color: BRAND_COLORS.textSecondary,
              textTransform: "uppercase",
            }}
          >
            DISCIPLINE COMPOUND CURVE
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: 12,
              marginTop: 4,
            }}
          >
            <span
              style={{
                fontSize: 48,
                fontWeight: 900,
                color: BRAND_COLORS.textPrimary,
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-0.03em",
              }}
            >
              {currentMetric}%
            </span>
            <span
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: BRAND_COLORS.successEmerald,
              }}
            >
              +68% INCREASE
            </span>
          </div>
        </div>

        <div
          style={{
            background: "rgba(52, 211, 153, 0.15)",
            border: `1px solid ${BRAND_COLORS.successEmerald}`,
            padding: "8px 16px",
            borderRadius: 999,
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.08em",
            color: BRAND_COLORS.successEmerald,
            boxShadow: `0 0 16px rgba(52, 211, 153, 0.25)`,
          }}
        >
          CONSISTENCY UNLOCKED
        </div>
      </div>

      {/* Main Glassmorphic Graph Card */}
      <div
        style={{
          width,
          height,
          position: "relative",
          background: "rgba(11, 18, 30, 0.75)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderRadius: 28,
          border: `1px solid ${BRAND_COLORS.cardBorderIcy}`,
          boxShadow: `0 18px 48px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.08)`,
          overflow: "hidden",
        }}
      >
        {/* Horizontal gridlines */}
        {[0.25, 0.5, 0.75].map((fraction, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: paddingX,
              right: paddingX,
              top: paddingY + fraction * graphH,
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.05)",
            }}
          />
        ))}

        <svg
          width={width}
          height={height}
          style={{ position: "absolute", inset: 0 }}
        >
          <defs>
            <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={color} stopOpacity="0.45" />
              <stop offset="80%" stopColor={color} stopOpacity="0.04" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>

            <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="60%" stopColor={color} />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Area Fill */}
          <path
            d={areaPath}
            fill="url(#areaGradient)"
            opacity={easedDraw}
          />

          {/* Glowing Stroke */}
          <path
            d={linePath}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOffset}
            filter="url(#laserGlow)"
          />

          {/* Live Edge Cursor Ring */}
          {easedDraw > 0.05 && (
            <circle
              cx={interpolate(
                easedDraw,
                points.map((_, i) => i / (points.length - 1)),
                points.map((p) => p.x)
              )}
              cy={interpolate(
                easedDraw,
                points.map((_, i) => i / (points.length - 1)),
                points.map((p) => p.y)
              )}
              r="8"
              fill="#ffffff"
              stroke={color}
              strokeWidth="4"
              style={{
                filter: `drop-shadow(0 0 10px ${color})`,
              }}
            />
          )}

          {/* Node Circles */}
          {points.map((pt, i) => {
            if (!pt.reached) return null;
            return (
              <g key={i}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="#ffffff"
                  stroke={color}
                  strokeWidth="2.5"
                />
              </g>
            );
          })}
        </svg>

        {/* X-Axis Day Labels */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: paddingX,
            right: paddingX,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {["DAY 1", "DAY 15", "DAY 30", "DAY 45", "DAY 60", "DAY 75", "DAY 90"].map(
            (label, i) => (
              <span
                key={i}
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: BRAND_COLORS.textMuted,
                  letterSpacing: "0.08em",
                }}
              >
                {label}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
};
