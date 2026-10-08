import React from "react";
import { interpolate } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { AnimatedGraph } from "../components/AnimatedGraph";
import { KineticText } from "../components/KineticText";
import { CameraMove } from "../components/CameraMove";
import { BRAND_COLORS, SAFE_ZONE } from "../config/timeline";

interface PayoffProps {
  frame: number;
}

export const PayoffScene: React.FC<PayoffProps> = ({ frame }) => {
  // Mountain fades in behind graph, visually merging landscape and telemetry
  const mountainOpacity = interpolate(frame, [0, 30], [0.35, 0.75], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const graphOpacity = interpolate(frame, [0, 20], [0.7, 0.85], {
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
      <CameraMove frame={frame} durationInFrames={120} type="slowPush">
        {/* Winter Mountain Environment Backdrop */}
        <MountainBackground
          frame={frame + 960}
          opacity={mountainOpacity}
          zoom={1.05}
          panY={-30}
        />

        {/* Ambient Snowfall */}
        <SnowParticles frame={frame + 960} count={28} opacity={0.55} />

        {/* Subtly Layered Progress Graph Merged into Mountain Sky */}
        <div
          style={{
            position: "absolute",
            top: "34%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0.92)",
            opacity: graphOpacity,
            zIndex: 5,
            filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.8))",
          }}
        >
          <AnimatedGraph
            frame={frame + 60}
            startFrame={0}
            width={940}
            height={440}
            dataPoints={[20, 32, 45, 40, 62, 58, 76, 85, 96]}
            showFormulaBar={false}
          />
        </div>
      </CameraMove>

      {/* Hero Emotional Statement Typography */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 110,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          zIndex: 20,
        }}
      >
        <KineticText
          frame={frame}
          startFrame={15}
          text="YOUR PROGRESS SHOULD BE VISIBLE."
          highlightWord="VISIBLE."
          accentColor={BRAND_COLORS.accentIcy}
          fontSize={68}
          subtext="NO GUESSWORK. JUST PROVEN DISCIPLINE."
          glow
        />
      </div>
    </div>
  );
};
