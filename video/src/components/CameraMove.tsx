import React from "react";
import { interpolate } from "remotion";

interface CameraMoveProps {
  frame: number;
  durationInFrames: number;
  type?: "slowPush" | "slowPull" | "subtleFloat" | "panUp" | "static";
  children: React.ReactNode;
}

export const CameraMove: React.FC<CameraMoveProps> = ({
  frame,
  durationInFrames,
  type = "slowPush",
  children,
}) => {
  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  let scale = 1;
  let translateY = 0;
  let rotate = 0;

  switch (type) {
    case "slowPush":
      scale = interpolate(progress, [0, 1], [1, 1.08]);
      translateY = interpolate(progress, [0, 1], [0, -15]);
      break;
    case "slowPull":
      scale = interpolate(progress, [0, 1], [1.08, 1]);
      translateY = interpolate(progress, [0, 1], [-15, 0]);
      break;
    case "subtleFloat":
      scale = 1 + Math.sin(frame * 0.03) * 0.015;
      translateY = Math.cos(frame * 0.02) * 8;
      rotate = Math.sin(frame * 0.015) * 0.4;
      break;
    case "panUp":
      translateY = interpolate(progress, [0, 1], [40, -20]);
      scale = interpolate(progress, [0, 1], [1.02, 1.05]);
      break;
    case "static":
    default:
      scale = 1;
      translateY = 0;
      break;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        transform: `scale(${scale}) translateY(${translateY}px) rotate(${rotate}deg)`,
        transformOrigin: "center center",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};
