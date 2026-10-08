import React from "react";
import { interpolate, spring } from "remotion";
import { AnimatedGraph } from "../components/AnimatedGraph";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface PatternHeroProps {
  frame: number;
}

export const PatternHeroScene: React.FC<PatternHeroProps> = ({ frame }) => {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Background Soft Glow */}
      <div
        style={{
          position: "absolute",
          top: "28%",
          left: "15%",
          width: "70%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, transparent 70%)`,
          filter: "blur(65px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Narrative Header */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop - 15,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          zIndex: 20,
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
          LONG-TERM TRAJECTORY
        </span>
        <span
          style={{
            fontSize: 38,
            fontWeight: 900,
            letterSpacing: "-0.02em",
            color: BRAND_COLORS.textPrimary,
          }}
        >
          Data Becomes a Pattern.
        </span>
      </div>

      {/* Master Animated Graph Curve (Daily points linking into compound curve) */}
      <div
        style={{
          position: "absolute",
          top: "54%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
        }}
      >
        <AnimatedGraph
          frame={frame}
          startFrame={0}
          width={960}
          height={500}
          dataPoints={[22, 34, 46, 42, 60, 58, 74, 82, 94]}
        />
      </div>

      {/* Bottom Subtitle: Consistency Compounds */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 180,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "0.2em",
          color: BRAND_COLORS.textSecondary,
          textTransform: "uppercase",
        }}
      >
        A QUIET PROOF THAT CONSISTENCY COMPOUNDS
      </div>
    </div>
  );
};
