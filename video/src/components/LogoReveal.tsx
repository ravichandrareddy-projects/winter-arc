import React from "react";
import { interpolate, spring, staticFile } from "remotion";
import { BRAND_COLORS, FPS } from "../config/timeline";

interface LogoRevealProps {
  frame: number;
  startFrame?: number;
  size?: number;
  showWordmark?: boolean;
  wordmarkSubtitle?: string;
  pulse?: boolean;
}

export const LogoReveal: React.FC<LogoRevealProps> = ({
  frame,
  startFrame = 0,
  size = 140,
  showWordmark = true,
  wordmarkSubtitle = "DISCIPLINE BUILDS FREEDOM",
  pulse = true,
}) => {
  const localFrame = Math.max(0, frame - startFrame);

  const spr = spring({
    frame: localFrame,
    fps: FPS,
    config: { damping: 14, stiffness: 160, mass: 0.7 },
  });

  const scale = interpolate(spr, [0, 1], [0.4, 1]);
  const opacity = interpolate(spr, [0, 1], [0, 1]);

  const pulseGlow = pulse ? 1 + Math.sin(localFrame * 0.1) * 0.18 : 1;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Outer Glowing Emblem Frame */}
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          transform: `scale(${scale})`,
          opacity,
        }}
      >
        {/* Pulsing Icy Blue Halo */}
        <div
          style={{
            position: "absolute",
            inset: -20,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${BRAND_COLORS.accentIcy} 0%, transparent 70%)`,
            opacity: 0.35 * pulseGlow,
            filter: "blur(24px)",
            pointerEvents: "none",
          }}
        />

        {/* Real Logo Container */}
        <div
          style={{
            width: size,
            height: size,
            borderRadius: Math.round(size * 0.28),
            background: "linear-gradient(135deg, rgba(22, 36, 60, 0.95), rgba(7, 12, 22, 0.98))",
            border: `2px solid ${BRAND_COLORS.accentCyan}`,
            boxShadow: `0 12px 32px rgba(0, 0, 0, 0.7), 0 0 28px ${BRAND_COLORS.accentGlow}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: Math.round(size * 0.12),
          }}
        >
          <img
            src={staticFile("logo.png")}
            alt="Winter Arc Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              filter: `drop-shadow(0 0 8px ${BRAND_COLORS.accentCyan})`,
            }}
          />
        </div>
      </div>

      {/* Wordmark Typography */}
      {showWordmark && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            opacity: interpolate(localFrame, [12, 25], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(localFrame, [12, 25], [20, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          <div
            style={{
              fontSize: Math.round(size * 0.42),
              fontWeight: 900,
              letterSpacing: "0.14em",
              color: BRAND_COLORS.textPrimary,
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>WINTER</span>
            <span
              style={{
                color: BRAND_COLORS.accentIcy,
                textShadow: `0 0 24px ${BRAND_COLORS.accentGlow}`,
              }}
            >
              ARC
            </span>
          </div>

          {wordmarkSubtitle && (
            <div
              style={{
                marginTop: 6,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: "0.32em",
                color: BRAND_COLORS.textSecondary,
                textTransform: "uppercase",
              }}
            >
              {wordmarkSubtitle}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
