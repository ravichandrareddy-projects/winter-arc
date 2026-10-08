import React from "react";
import { interpolate, spring } from "remotion";
import { KineticText } from "../components/KineticText";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface ProblemProps {
  frame: number;
}

export const ProblemScene: React.FC<ProblemProps> = ({ frame }) => {
  // Floating words list
  const floatingTags = [
    { word: "SLEEP", targetX: 280, targetY: 480, chaosX: 180, chaosY: 410, rot: -8, color: "#818cf8" },
    { word: "FITNESS", targetX: 780, targetY: 540, chaosX: 840, chaosY: 620, rot: 12, color: "#fb923c" },
    { word: "FOOD", targetX: 320, targetY: 780, chaosX: 240, chaosY: 890, rot: 15, color: "#fb7185" },
    { word: "STUDY", targetX: 760, targetY: 860, chaosX: 810, chaosY: 980, rot: -14, color: "#38bdf8" },
    { word: "HABITS", targetX: 300, targetY: 1200, chaosX: 220, chaosY: 1300, rot: -10, color: "#34d399" },
    { word: "GOALS", targetX: 760, targetY: 1280, chaosX: 820, chaosY: 1210, rot: 9, color: "#fbbf24" },
  ];

  // Chaos timeline:
  // f0 - f35: Organized entrance
  // f35 - f70: Rapid spiraling chaos, overlapping cards, flashing random metrics
  // f70 - f120: SUDDEN FREEZE! Screen dim, bold dramatic question appears
  const isFrozen = frame >= 68;

  const chaosFactor = isFrozen
    ? 1
    : interpolate(frame, [25, 68], [0, 1], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });

  // Numbers flashing rapidly during chaos
  const flashNum1 = Math.floor(Math.abs(Math.sin(frame * 1.8)) * 9000);
  const flashNum2 = Math.floor(Math.abs(Math.cos(frame * 2.2)) * 100);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background Warning Tint during chaos */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, rgba(244, 63, 94, ${
            chaosFactor * 0.14
          }) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Floating Category Badges (Starts organized, spins into chaos) */}
      {floatingTags.map((tag, idx) => {
        const spr = spring({
          frame: Math.max(0, frame - idx * 4),
          fps: FPS,
          config: { damping: 12, stiffness: 150 },
        });

        const jitterX = isFrozen ? 0 : Math.sin(frame * 0.4 + idx) * 35 * chaosFactor;
        const jitterY = isFrozen ? 0 : Math.cos(frame * 0.5 + idx) * 45 * chaosFactor;

        const posX = interpolate(chaosFactor, [0, 1], [tag.targetX, tag.chaosX]) + jitterX;
        const posY = interpolate(chaosFactor, [0, 1], [tag.targetY, tag.chaosY]) + jitterY;
        const rotation = interpolate(chaosFactor, [0, 1], [0, tag.rot * 2.5]);
        const scale = isFrozen
          ? 0.85
          : interpolate(spr, [0, 1], [0.4, 1 + chaosFactor * 0.15]);

        return (
          <div
            key={tag.word}
            style={{
              position: "absolute",
              left: posX,
              top: posY,
              transform: `translate(-50%, -50%) rotate(${rotation}deg) scale(${scale})`,
              padding: "18px 32px",
              borderRadius: 22,
              background: "rgba(15, 23, 42, 0.9)",
              border: `1.5px solid ${tag.color}`,
              boxShadow: `0 12px 30px rgba(0,0,0,0.6), 0 0 ${20 * chaosFactor}px ${tag.color}66`,
              display: "flex",
              alignItems: "center",
              gap: 12,
              opacity: isFrozen ? 0.28 : 0.95,
              zIndex: idx + 5,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: tag.color,
                boxShadow: `0 0 10px ${tag.color}`,
              }}
            />
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                letterSpacing: "0.12em",
                color: BRAND_COLORS.textPrimary,
              }}
            >
              {tag.word}
            </span>
          </div>
        );
      })}

      {/* Flashing chaotic metrics when cards overlap (f30 - f68) */}
      {frame >= 30 && !isFrozen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontSize: 120,
              fontWeight: 900,
              color: "rgba(255, 255, 255, 0.12)",
              letterSpacing: "-0.05em",
              transform: `rotate(${Math.sin(frame) * 15}deg)`,
            }}
          >
            {flashNum1} / {flashNum2}%
          </div>
        </div>
      )}

      {/* SUDDEN FREEZE MOMENT (f68 - f120): Dramatic Question Appears */}
      {isFrozen && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: `0 ${SAFE_ZONE.paddingHorizontal}px`,
            backgroundColor: "rgba(4, 8, 16, 0.8)",
            backdropFilter: "blur(18px)",
            WebkitBackdropFilter: "blur(18px)",
            zIndex: 30,
            textAlign: "center",
          }}
        >
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
            <KineticText
              frame={frame}
              startFrame={69}
              text="ARE YOU ACTUALLY"
              fontSize={64}
              glow
            />
            <KineticText
              frame={frame}
              startFrame={73}
              text="CHANGING?"
              highlightWord="CHANGING?"
              accentColor={BRAND_COLORS.dangerCoral}
              fontSize={82}
              glow
            />
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 16,
              fontWeight: 800,
              letterSpacing: "0.25em",
              color: BRAND_COLORS.textMuted,
              textTransform: "uppercase",
              opacity: interpolate(frame, [78, 92], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
              }),
            }}
          >
            OR ARE YOU JUST GUESSING?
          </div>
        </div>
      )}
    </div>
  );
};
