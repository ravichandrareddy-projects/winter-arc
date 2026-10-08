import React from "react";
import { interpolate, spring } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface ChooseArcProps {
  frame: number;
}

export const ChooseArcScene: React.FC<ChooseArcProps> = ({ frame }) => {
  // Deliberate, dignified goals list appearing sequentially
  const goals = [
    { name: "SLEEP", delay: 10, icon: "01" },
    { name: "FITNESS", delay: 24, icon: "02" },
    { name: "FOOD", delay: 38, icon: "03" },
    { name: "STUDY", delay: 52, icon: "04" },
    { name: "HABITS", delay: 66, icon: "05" },
    { name: "PROGRESS", delay: 80, icon: "06" },
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
      {/* Background Mountain Depth */}
      <MountainBackground
        frame={frame + 300}
        opacity={0.45}
        zoom={1.02}
        panY={-5}
      />

      {/* Top Framing Heading */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop - 20,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
          opacity: interpolate(frame, [0, 20], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            letterSpacing: "0.26em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          SELECT YOUR FOCUS
        </span>
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          Choose Your Arc.
        </span>
      </div>

      {/* Deliberate Vertical Stack of Goals (Appearing with solemn precision) */}
      <div
        style={{
          position: "absolute",
          top: "55%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
          zIndex: 10,
        }}
      >
        {goals.map((item) => {
          const spr = spring({
            frame: Math.max(0, frame - item.delay),
            fps: FPS,
            config: { damping: 18, stiffness: 160, mass: 0.8 },
          });

          const opacity = interpolate(spr, [0, 1], [0, 1]);
          const translateX = interpolate(spr, [0, 1], [-25, 0]);

          return (
            <div
              key={item.name}
              style={{
                opacity,
                transform: `translateX(${translateX}px)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 28px",
                borderRadius: 20,
                background: "rgba(10, 16, 28, 0.72)",
                backdropFilter: "blur(20px)",
                WebkitBackdropFilter: "blur(20px)",
                border: `1px solid ${BRAND_COLORS.cardBorder}`,
                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: "0.15em",
                    color: BRAND_COLORS.accentIcy,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontSize: 26,
                    fontWeight: 900,
                    letterSpacing: "0.06em",
                    color: BRAND_COLORS.textPrimary,
                  }}
                >
                  {item.name}
                </span>
              </div>

              {/* Minimal selection marker */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: BRAND_COLORS.subtleLine,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
