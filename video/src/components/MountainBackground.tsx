import React from "react";
import { staticFile } from "remotion";
import { BRAND_COLORS } from "../config/timeline";

interface MountainBackgroundProps {
  frame: number;
  opacity?: number;
  zoom?: number;
  panY?: number;
  cinematicOverlay?: boolean;
}

export const MountainBackground: React.FC<MountainBackgroundProps> = ({
  frame,
  opacity = 1,
  zoom = 1,
  panY = 0,
  cinematicOverlay = true,
}) => {
  // Slow organic ambient drifts
  const driftX = Math.sin(frame * 0.015) * 16;
  const auroraDrift = Math.sin(frame * 0.02) * 25;
  const fogDrift = (frame * 0.4) % 1920;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        overflow: "hidden",
        backgroundColor: BRAND_COLORS.bgDeep,
      }}
    >
      {/* Sky Deep Gradient */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 110% 70% at 50% -10%, rgba(18, 48, 100, 0.45) 0%, ${BRAND_COLORS.bgDeep} 75%)`,
        }}
      />

      {/* Atmospheric Aurora Borealis Icy Bloom */}
      <div
        style={{
          position: "absolute",
          top: "-5%",
          left: "15%",
          width: "70%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle at 50% 50%, rgba(46, 155, 255, 0.16) 0%, rgba(56, 189, 248, 0.08) 50%, transparent 80%)`,
          filter: "blur(60px)",
          transform: `translateX(${auroraDrift}px) scale(${1 + Math.sin(frame * 0.03) * 0.05})`,
          pointerEvents: "none",
        }}
      />

      {/* Actual Winter Arc Mountain Artwork */}
      <div
        style={{
          position: "absolute",
          inset: "-5%",
          width: "110%",
          height: "110%",
          transform: `scale(${zoom}) translateY(${panY}px) translateX(${driftX}px)`,
          transformOrigin: "center center",
          opacity: 0.55,
          backgroundImage: `url(${staticFile("bg-mountains.png")})`,
          backgroundSize: "cover",
          backgroundPosition: "center 30%",
          filter: "brightness(0.68) contrast(1.15) saturate(0.9)",
        }}
      />

      {/* Vector Mountain Ridge Silhouette for Razor-sharp 1080x1920 Framing */}
      <svg
        viewBox="0 0 1080 1920"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Distant Ridge */}
        <polygon
          points="0,1100 180,840 340,990 520,760 720,940 910,810 1080,950 1080,1920 0,1920"
          fill="rgba(8, 18, 38, 0.85)"
        />
        {/* Snow Peak Caps */}
        <polygon
          points="510,775 520,760 530,775 524,785 516,785"
          fill="rgba(186, 230, 253, 0.45)"
        />
        <polygon
          points="172,852 180,840 188,852 184,860 176,860"
          fill="rgba(186, 230, 253, 0.35)"
        />
        <polygon
          points="902,822 910,810 918,822 914,830 906,830"
          fill="rgba(186, 230, 253, 0.35)"
        />

        {/* Foreground Mountain Mass */}
        <polygon
          points="0,1320 220,1140 460,1260 680,1080 880,1220 1080,1110 1080,1920 0,1920"
          fill="rgba(4, 9, 20, 0.96)"
        />
      </svg>

      {/* Subtle Mist Layer */}
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: 0,
          right: 0,
          height: "35%",
          background: `linear-gradient(to top, rgba(7, 11, 18, 0.95) 0%, rgba(15, 30, 60, 0.25) 50%, transparent 100%)`,
          pointerEvents: "none",
        }}
      />

      {/* Cinematic Vignette & Deep Ground Shadow */}
      {cinematicOverlay && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, transparent 40%, rgba(4, 8, 16, 0.82) 100%), linear-gradient(to bottom, rgba(4, 8, 16, 0.6) 0%, transparent 25%, transparent 70%, rgba(4, 8, 16, 0.95) 100%)`,
            pointerEvents: "none",
          }}
        />
      )}
    </div>
  );
};
