import React from "react";
import { interpolate, spring } from "remotion";
import { BRAND_COLORS, FPS } from "../config/timeline";

interface KineticTextProps {
  frame: number;
  text: string;
  subtext?: string;
  startFrame?: number;
  align?: "center" | "left" | "right";
  fontSize?: number;
  highlightWord?: string;
  accentColor?: string;
  glow?: boolean;
  letterSpacing?: string;
}

export const KineticText: React.FC<KineticTextProps> = ({
  frame,
  text,
  subtext,
  startFrame = 0,
  align = "center",
  fontSize = 64,
  highlightWord,
  accentColor = BRAND_COLORS.accentIcy,
  glow = true,
  letterSpacing = "-0.02em",
}) => {
  const localFrame = Math.max(0, frame - startFrame);
  const words = text.split(" ");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
        textAlign: align,
        width: "100%",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: align === "center" ? "center" : align === "left" ? "flex-start" : "flex-end",
          columnGap: "0.36em",
          rowGap: "0.15em",
          lineHeight: 1.15,
        }}
      >
        {words.map((word, index) => {
          // Stagger each word by 3 frames for kinetic punch
          const wordFrame = Math.max(0, localFrame - index * 3);
          const spr = spring({
            frame: wordFrame,
            fps: FPS,
            config: { damping: 14, stiffness: 180, mass: 0.6 },
          });

          const translateY = interpolate(spr, [0, 1], [38, 0]);
          const opacity = interpolate(spr, [0, 1], [0, 1]);
          const scale = interpolate(spr, [0, 1], [0.88, 1]);

          const isHighlighted =
            highlightWord &&
            word.toLowerCase().replace(/[^a-z0-9]/g, "") ===
              highlightWord.toLowerCase().replace(/[^a-z0-9]/g, "");

          return (
            <span
              key={`${word}-${index}`}
              style={{
                display: "inline-block",
                transform: `translateY(${translateY}px) scale(${scale})`,
                opacity,
                fontSize,
                fontWeight: 900,
                letterSpacing,
                color: isHighlighted ? accentColor : BRAND_COLORS.textPrimary,
                textShadow:
                  isHighlighted && glow
                    ? `0 0 32px ${BRAND_COLORS.accentGlow}, 0 0 12px ${accentColor}`
                    : glow
                    ? "0 4px 20px rgba(0,0,0,0.8)"
                    : undefined,
              }}
            >
              {word}
            </span>
          );
        })}
      </div>

      {subtext && (
        <div
          style={{
            marginTop: 18,
            fontSize: Math.round(fontSize * 0.38),
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: BRAND_COLORS.textSecondary,
            opacity: interpolate(localFrame, [10, 24], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
            transform: `translateY(${interpolate(localFrame, [10, 24], [16, 0], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            })}px)`,
          }}
        >
          {subtext}
        </div>
      )}
    </div>
  );
};
