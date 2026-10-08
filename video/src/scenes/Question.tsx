import React from "react";
import { interpolate, spring } from "remotion";
import { DataPoint } from "../components/DataPoint";
import { KineticText } from "../components/KineticText";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface QuestionProps {
  frame: number;
}

export const QuestionScene: React.FC<QuestionProps> = ({ frame }) => {
  // Ordered constellation of points forming from bottom to top
  const points = [
    { x: 260, y: 1180, enterFrame: 15, label: "HABIT" },
    { x: 420, y: 1010, enterFrame: 30, label: "LOG" },
    { x: 620, y: 880, enterFrame: 45, label: "PATTERN" },
    { x: 820, y: 720, enterFrame: 60, label: "CLARITY" },
  ];

  // Laser line drawing between revealed points
  const lineProgress = interpolate(frame, [25, 80], [0, 1], {
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
      {/* Deep blue cosmos gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(46, 155, 255, 0.12) 0%, transparent 65%)`,
        }}
      />

      {/* SVG Connecting Laser Lines */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      >
        <defs>
          <linearGradient id="questionLaser" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#7ec5ff" />
          </linearGradient>
          <filter id="laserGlowQ" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Dynamic connected trajectory */}
        {lineProgress > 0 && (
          <path
            d={`M 260 1180 L 420 1010 L 620 880 L 820 720`}
            fill="none"
            stroke="url(#questionLaser)"
            strokeWidth="4"
            strokeDasharray="900"
            strokeDashoffset={(1 - lineProgress) * 900}
            strokeLinecap="round"
            filter="url(#laserGlowQ)"
          />
        )}
      </svg>

      {/* Sequential Glowing Data Points */}
      {points.map((pt, idx) => {
        const visible = frame >= pt.enterFrame;
        if (!visible) return null;

        const spr = spring({
          frame: frame - pt.enterFrame,
          fps: FPS,
          config: { damping: 14, stiffness: 200 },
        });

        return (
          <div key={idx} style={{ opacity: spr }}>
            <DataPoint
              x={pt.x}
              y={pt.y}
              size={18}
              color={BRAND_COLORS.accentIcy}
              pulse
              frame={frame}
              label={pt.label}
            />
          </div>
        );
      })}

      {/* Signature On-Screen Kinetic Text "SEE IT." */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          zIndex: 20,
        }}
      >
        <KineticText
          frame={frame}
          startFrame={40}
          text="SEE IT."
          highlightWord="SEE"
          accentColor={BRAND_COLORS.accentCyan}
          fontSize={88}
          subtext="WHEN YOU TRACK IT, YOU CAN CHANGE IT."
          glow
        />
      </div>

      {/* Cinematic Transition Flash to Product Reveal towards end of scene */}
      {frame >= 105 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#ffffff",
            opacity: interpolate(frame, [105, 120], [0, 0.45], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
