import React from "react";
import { interpolate, spring } from "remotion";
import { ProductUI } from "../components/ProductUI";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface ProductIntroProps {
  frame: number;
}

export const ProductIntroScene: React.FC<ProductIntroProps> = ({ frame }) => {
  // Smooth cinematic push into dashboard
  const enterSpring = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  const phoneScale = interpolate(enterSpring, [0, 1], [0.88, 1]);
  const phoneOpacity = interpolate(enterSpring, [0, 1], [0, 1]);
  const phoneTranslateY = interpolate(enterSpring, [0, 1], [120, 0]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background Soft Ambient Light */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "20%",
          width: "60%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(56, 189, 248, 0.14) 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Refined Product Branding */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop - 25,
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
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.26em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 6,
          }}
        >
          THE DIGITAL SYSTEM
        </span>
        <span
          style={{
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          Winter Arc Command Center
        </span>
      </div>

      {/* Centered Realistic Mobile Frame with Real Home Dashboard */}
      <div
        style={{
          position: "absolute",
          top: "56%",
          left: "50%",
          transform: `translate(-50%, -50%) translateY(${phoneTranslateY}px) scale(${phoneScale})`,
          opacity: phoneOpacity,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <ProductUI
          frame={frame}
          type="home"
          zoom={1.0}
          screenshotSrc="video-assets/real/01_home_initial.png"
        />
      </div>
    </div>
  );
};
