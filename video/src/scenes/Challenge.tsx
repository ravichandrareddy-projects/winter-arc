import React from "react";
import { interpolate, spring } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { CameraMove } from "../components/CameraMove";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface ChallengeProps {
  frame: number;
}

export const ChallengeScene: React.FC<ChallengeProps> = ({ frame }) => {
  // Morning light awakening: warm cold dawn gradient rising over deep mountain silhouettes
  const dawnGlow = interpolate(frame, [0, 80], [0.12, 0.32], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const textSpring = spring({
    frame: Math.max(0, frame - 20),
    fps: FPS,
    config: { damping: 20, stiffness: 130, mass: 0.9 },
  });

  const cardOpacity = interpolate(textSpring, [0, 1], [0, 1]);
  const cardY = interpolate(textSpring, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      <CameraMove frame={frame} durationInFrames={150} type="panUp">
        {/* Mountain background with cold morning dawn tone */}
        <MountainBackground
          frame={frame + 150}
          opacity={0.82}
          zoom={1.03}
          panY={-15}
        />

        {/* Cold dawn sunrise radiance in the mountain gap */}
        <div
          style={{
            position: "absolute",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            height: "40%",
            borderRadius: "50%",
            background: `radial-gradient(circle, rgba(224, 242, 254, ${dawnGlow}) 0%, rgba(56, 189, 248, 0.12) 45%, transparent 75%)`,
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        {/* Atmospheric snow particles */}
        <SnowParticles frame={frame + 150} count={30} opacity={0.55} />
      </CameraMove>

      {/* Cinematic Center Text Framing: The Challenge is Personal */}
      <div
        style={{
          position: "absolute",
          top: "48%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: `translateY(-50%) translateY(${cardY}px)`,
          opacity: cardOpacity,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: "0.28em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 16,
          }}
        >
          A QUIET SEASON
        </span>

        <h1
          style={{
            fontSize: 58,
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
            margin: 0,
            textShadow: "0 8px 32px rgba(0,0,0,0.8)",
          }}
        >
          Step back.
          <br />
          Choose what matters.
          <br />
          <span style={{ color: BRAND_COLORS.accentSilver }}>And build.</span>
        </h1>

        <div
          style={{
            marginTop: 32,
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 24px",
            borderRadius: 999,
            background: "rgba(15, 23, 42, 0.75)",
            border: `1px solid ${BRAND_COLORS.cardBorderIcy}`,
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: BRAND_COLORS.accentIcy,
              boxShadow: `0 0 10px ${BRAND_COLORS.accentIcy}`,
            }}
          />
          <span
            style={{
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: "0.14em",
              color: BRAND_COLORS.textSecondary,
              textTransform: "uppercase",
            }}
          >
            THE CHALLENGE IS PERSONAL
          </span>
        </div>
      </div>
    </div>
  );
};
