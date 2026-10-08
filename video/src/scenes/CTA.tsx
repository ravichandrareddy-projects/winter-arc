import React from "react";
import { interpolate, spring } from "remotion";
import { LogoReveal } from "../components/LogoReveal";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CTAProps {
  frame: number;
}

export const CTAScene: React.FC<CTAProps> = ({ frame }) => {
  // Simple, elegant, crystal clear climax:
  // f0 - f25: Logo reveal with pulsing emblem
  // f20 - f50: START YOUR WINTER ARC text appears
  // f40 - f70: FREE badge appears
  // f55 - f85: winterarc.indevs.in URL pill appears
  // f85 - f120: Held rock-solid and readable for social retention!

  const sprText = spring({
    frame: Math.max(0, frame - 15),
    fps: FPS,
    config: { damping: 14, stiffness: 180, mass: 0.7 },
  });

  const sprBadge = spring({
    frame: Math.max(0, frame - 32),
    fps: FPS,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
  });

  const sprUrl = spring({
    frame: Math.max(0, frame - 48),
    fps: FPS,
    config: { damping: 14, stiffness: 200, mass: 0.6 },
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
      {/* Dark Mountain Ambient Backdrop */}
      <MountainBackground
        frame={frame + 1080}
        opacity={0.65}
        zoom={1.02}
        panY={-10}
      />

      {/* Gentle Snowflakes */}
      <SnowParticles frame={frame + 1080} count={30} opacity={0.6} />

      {/* Centered High-Impact CTA Container */}
      <div
        style={{
          position: "absolute",
          top: "47%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 28,
          zIndex: 20,
        }}
      >
        {/* Centered Official Winter Arc Logo */}
        <LogoReveal
          frame={frame}
          size={160}
          showWordmark={false}
          pulse
        />

        {/* Large Bold Headline: START YOUR WINTER ARC */}
        <div
          style={{
            transform: `scale(${interpolate(sprText, [0, 1], [0.85, 1])}) translateY(${interpolate(
              sprText,
              [0, 1],
              [30, 0]
            )}px)`,
            opacity: interpolate(sprText, [0, 1], [0, 1]),
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            lineHeight: 1.05,
          }}
        >
          <span
            style={{
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: "-0.03em",
              color: BRAND_COLORS.textPrimary,
            }}
          >
            START YOUR
          </span>
          <span
            style={{
              fontSize: 78,
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: BRAND_COLORS.accentIcy,
              textShadow: `0 0 32px ${BRAND_COLORS.accentGlow}, 0 0 12px ${BRAND_COLORS.accentCyan}`,
            }}
          >
            WINTER ARC
          </span>
        </div>

        {/* Highlight FREE Pill Badge */}
        <div
          style={{
            transform: `scale(${interpolate(sprBadge, [0, 1], [0.7, 1])})`,
            opacity: interpolate(sprBadge, [0, 1], [0, 1]),
            display: "flex",
            alignItems: "center",
            gap: 10,
            background: "rgba(52, 211, 153, 0.16)",
            border: `1.5px solid ${BRAND_COLORS.successEmerald}`,
            padding: "10px 28px",
            borderRadius: 999,
            boxShadow: `0 0 20px rgba(52, 211, 153, 0.3)`,
          }}
        >
          <span
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "0.15em",
              color: BRAND_COLORS.successEmerald,
            }}
          >
            100% FREE
          </span>
          <span style={{ color: "rgba(255,255,255,0.4)" }}>•</span>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.08em",
              color: BRAND_COLORS.textPrimary,
            }}
          >
            NO CREDIT CARD REQUIRED
          </span>
        </div>

        {/* Clean URL Card Pill */}
        <div
          style={{
            transform: `scale(${interpolate(sprUrl, [0, 1], [0.8, 1])}) translateY(${interpolate(
              sprUrl,
              [0, 1],
              [20, 0]
            )}px)`,
            opacity: interpolate(sprUrl, [0, 1], [0, 1]),
            marginTop: 10,
            background: "rgba(11, 18, 30, 0.9)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: `1.5px solid ${BRAND_COLORS.cardBorderIcy}`,
            boxShadow: `0 16px 40px rgba(0,0,0,0.7), 0 0 24px rgba(46, 155, 255, 0.25)`,
            borderRadius: 24,
            padding: "20px 48px",
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: BRAND_COLORS.accentCyan,
              boxShadow: `0 0 10px ${BRAND_COLORS.accentCyan}`,
            }}
          />
          <span
            style={{
              fontSize: 34,
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: BRAND_COLORS.textPrimary,
              fontFamily:
                'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            }}
          >
            winterarc.indevs.in
          </span>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 14,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: BRAND_COLORS.textMuted,
          textTransform: "uppercase",
        }}
      >
        DISCIPLINE BUILDS FREEDOM
      </div>
    </div>
  );
};
