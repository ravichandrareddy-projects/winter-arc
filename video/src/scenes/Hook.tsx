import React from "react";
import { interpolate } from "remotion";
import { MountainBackground } from "../components/MountainBackground";
import { SnowParticles } from "../components/SnowParticles";
import { DataPoint } from "../components/DataPoint";
import { KineticText } from "../components/KineticText";
import { CameraMove } from "../components/CameraMove";
import { BRAND_COLORS, SAFE_ZONE } from "../config/timeline";

interface HookProps {
  frame: number;
}

export const HookScene: React.FC<HookProps> = ({ frame }) => {
  // Mountain slowly emerges from pitch black
  const mountainOpacity = interpolate(frame, [0, 45], [0, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Tiny glowing data point appears in the mountain distance at frame 35
  const dataPointOpacity = interpolate(frame, [35, 60], [0, 1], {
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
        {/* Mysterious Dark Winter Mountain */}
        <MountainBackground
          frame={frame}
          opacity={mountainOpacity}
          zoom={1.03}
        />

        {/* Snow flurries in the dark */}
        <SnowParticles frame={frame} count={35} opacity={0.65} />

        {/* Tiny glowing data point at the mountain summit */}
        <DataPoint
          x={540}
          y={860}
          size={12}
          color={BRAND_COLORS.accentCyan}
          pulse
          frame={frame}
          opacity={dataPointOpacity}
        />
      </CameraMove>

      {/* Cinematic On-Screen Typography */}
      <div
        style={{
          position: "absolute",
          top: "42%",
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <KineticText
          frame={frame}
          startFrame={25}
          text="THIS YEAR WILL BE DIFFERENT."
          highlightWord="DIFFERENT."
          accentColor={BRAND_COLORS.accentIcy}
          fontSize={72}
          glow
        />
      </div>

      {/* Subtle bottom timestamp indicator */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 60,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          opacity: interpolate(frame, [50, 75], [0, 0.6], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.24em",
            color: BRAND_COLORS.textMuted,
            textTransform: "uppercase",
          }}
        >
          CHAPTER 01 • THE REPETITION
        </span>
      </div>
    </div>
  );
};
