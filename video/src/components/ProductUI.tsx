import React from "react";
import { staticFile } from "remotion";
import { BRAND_COLORS, FPS } from "../config/timeline";

export type ProductUIType =
  | "home"
  | "sleep"
  | "fitness"
  | "food"
  | "habits"
  | "progress";

interface ProductUIProps {
  frame: number;
  type?: ProductUIType;
  screenshotSrc?: string;
  zoom?: number;
  highlightCardIndex?: number;
  title?: string;
  subtitle?: string;
}

export const ProductUI: React.FC<ProductUIProps> = ({
  frame,
  type = "home",
  screenshotSrc,
  zoom = 1,
  title,
  subtitle,
}) => {
  // Map type to real product screenshot fallback
  const screenshotMap: Record<ProductUIType, string> = {
    home: "video-assets/real/01_home_initial.png",
    sleep: "video-assets/real/04_sleep.png",
    fitness: "video-assets/real/06_fitness.png",
    food: "video-assets/real/07_food.png",
    habits: "video-assets/real/08_progress.png",
    progress: "video-assets/real/08_progress.png",
  };

  const activeSrc = screenshotSrc || screenshotMap[type];

  // Subtle floating phone tilt
  const tiltY = Math.sin(frame * 0.04) * 2;
  const tiltX = Math.cos(frame * 0.03) * 1.5;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      {/* Optional Top Category Badge */}
      {title && (
        <div
          style={{
            marginBottom: 24,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: BRAND_COLORS.accentCyan,
              background: "rgba(56, 189, 248, 0.12)",
              padding: "6px 20px",
              borderRadius: 999,
              border: `1px solid ${BRAND_COLORS.cardBorderIcy}`,
              boxShadow: `0 0 16px ${BRAND_COLORS.accentGlow}`,
            }}
          >
            {title}
          </div>
          {subtitle && (
            <div
              style={{
                fontSize: 16,
                fontWeight: 600,
                color: BRAND_COLORS.textSecondary,
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
      )}

      {/* Titanium Mobile Frame Enclosure */}
      <div
        style={{
          width: 580,
          height: 1040,
          position: "relative",
          borderRadius: 48,
          padding: 10,
          background: "linear-gradient(145deg, #1e293b, #090d16, #1e293b)",
          boxShadow: `0 35px 80px rgba(0, 0, 0, 0.8), 0 0 35px ${BRAND_COLORS.accentGlow}, inset 0 1px 2px rgba(255, 255, 255, 0.25)`,
          border: "2px solid rgba(255, 255, 255, 0.12)",
          transform: `scale(${zoom}) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformOrigin: "center center",
          overflow: "hidden",
        }}
      >
        {/* Dynamic Island / Speaker notch */}
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            width: 140,
            height: 28,
            backgroundColor: "#000000",
            borderRadius: 20,
            zIndex: 40,
            boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
          }}
        />

        {/* Inner Screen Bezel */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 40,
            overflow: "hidden",
            backgroundColor: "#070b12",
            position: "relative",
          }}
        >
          {/* Real App Screenshot Image */}
          <img
            src={staticFile(activeSrc)}
            alt={type}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top center",
            }}
          />

          {/* Premium Glass Reflection Sheen */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, transparent 40%, transparent 70%, rgba(46, 155, 255, 0.05) 100%)`,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};
