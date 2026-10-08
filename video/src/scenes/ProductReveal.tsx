import React from "react";
import { interpolate, spring } from "remotion";
import { LogoReveal } from "../components/LogoReveal";
import { ProductUI } from "../components/ProductUI";
import { KineticText } from "../components/KineticText";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface ProductRevealProps {
  frame: number;
}

export const ProductRevealScene: React.FC<ProductRevealProps> = ({ frame }) => {
  // Phase 1 (f0 - f50): Bold Logo & Brand Name Reveal
  // Phase 2 (f50 - f150): Mobile Interface slides up with Home Dashboard
  const logoExitProgress = interpolate(frame, [45, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const mobileEnterSpr = spring({
    frame: Math.max(0, frame - 48),
    fps: FPS,
    config: { damping: 16, stiffness: 140, mass: 0.85 },
  });

  const mobileY = interpolate(mobileEnterSpr, [0, 1], [450, 0]);
  const mobileOpacity = interpolate(mobileEnterSpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background Aurora Lighting */}
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "15%",
          width: "70%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(46, 155, 255, 0.2) 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Brand & Wordmark Header Area */}
      {frame < 60 ? (
        <div
          style={{
            position: "absolute",
            top: "44%",
            left: SAFE_ZONE.paddingHorizontal,
            right: SAFE_ZONE.paddingHorizontal,
            transform: `translateY(-50%) translateY(${-logoExitProgress * 60}px) scale(${1 - logoExitProgress * 0.15})`,
            opacity: 1 - logoExitProgress,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <LogoReveal frame={frame} size={160} />
          <div style={{ marginTop: 36, width: "100%" }}>
            <KineticText
              frame={frame}
              startFrame={12}
              text="YOUR PERSONAL PROGRESS TRACKER."
              highlightWord="PROGRESS"
              accentColor={BRAND_COLORS.accentIcy}
              fontSize={44}
              glow
            />
          </div>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            top: SAFE_ZONE.paddingTop + 10,
            left: SAFE_ZONE.paddingHorizontal,
            right: SAFE_ZONE.paddingHorizontal,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            zIndex: 20,
            opacity: interpolate(frame, [60, 75], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }),
          }}
        >
          <div
            style={{
              fontSize: 16,
              fontWeight: 900,
              letterSpacing: "0.26em",
              color: BRAND_COLORS.accentCyan,
              textTransform: "uppercase",
            }}
          >
            WINTER ARC • DASHBOARD
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 900,
              letterSpacing: "-0.02em",
              color: BRAND_COLORS.textPrimary,
            }}
          >
            Every Habit Connected.
          </div>
        </div>
      )}

      {/* Mobile Device Enclosure sliding in naturally with Real Home Dashboard UI */}
      {frame >= 48 && (
        <div
          style={{
            position: "absolute",
            top: "57%",
            left: "50%",
            transform: `translate(-50%, -50%) translateY(${mobileY}px)`,
            opacity: mobileOpacity,
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <ProductUI
            frame={frame}
            type="home"
            zoom={1.04}
            screenshotSrc="video-assets/real/01_home_initial.png"
          />
        </div>
      )}
    </div>
  );
};
