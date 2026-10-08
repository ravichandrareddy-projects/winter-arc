import React from "react";
import { interpolate, spring } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { CameraMove } from "../components/CameraMove";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface OpeningProps {
  frame: number;
}

export const OpeningScene: React.FC<OpeningProps> = ({ frame }) => {
  // Opening pacing:
  // f0 - f55: Pure cinematic silence, vast mountain atmosphere, cold wind, slow camera push
  // f55 - f120: Minimal title appears: WINTER ARC, Subtitle: THE CHALLENGE BEGINS.
  // f120 - f150: Peaceful transition into the challenge

  const titleSpring = spring({
    frame: Math.max(0, frame - 55),
    fps: FPS,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [24, 0]);

  const subtitleOpacity = interpolate(frame, [80, 105], [0, 1], {
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
      <CameraMove frame={frame} durationInFrames={150} type="slowPush">
        {/* Vast, majestic winter mountain range */}
        <MountainBackground
          frame={frame}
          opacity={0.88}
          zoom={1.04}
          panY={-10}
        />

        {/* Cold falling snow flurries */}
        <SnowParticles frame={frame} count={38} opacity={0.7} />
      </CameraMove>

      {/* Minimal Title Block appearing at f55 */}
      {frame >= 50 && (
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: SAFE_ZONE.paddingHorizontal,
            right: SAFE_ZONE.paddingHorizontal,
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            zIndex: 20,
          }}
        >
          <div
            style={{
              opacity: titleOpacity,
              transform: `translateY(${titleY}px)`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: 82,
                fontWeight: 900,
                letterSpacing: "0.14em",
                color: BRAND_COLORS.textPrimary,
                textTransform: "uppercase",
                textShadow: "0 10px 40px rgba(0,0,0,0.8), 0 0 30px rgba(56, 189, 248, 0.2)",
              }}
            >
              WINTER ARC
            </span>

            <div
              style={{
                marginTop: 18,
                width: 60,
                height: 2,
                backgroundColor: BRAND_COLORS.accentIcy,
                boxShadow: `0 0 12px ${BRAND_COLORS.accentIcy}`,
              }}
            />
          </div>

          <div
            style={{
              marginTop: 22,
              opacity: subtitleOpacity,
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.32em",
              color: BRAND_COLORS.textSecondary,
              textTransform: "uppercase",
            }}
          >
            THE CHALLENGE BEGINS
          </div>
        </div>
      )}
    </div>
  );
};
