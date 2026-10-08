import React from "react";
import { interpolate } from "remotion";

interface TransitionProps {
  frame: number;
  durationInFrames: number;
  inDuration?: number;
  outDuration?: number;
  type?: "fade" | "glitchFlash" | "zoomFade";
  children: React.ReactNode;
}

export const Transition: React.FC<TransitionProps> = ({
  frame,
  durationInFrames,
  inDuration = 10,
  outDuration = 10,
  type = "fade",
  children,
}) => {
  // Entrance opacity
  const enterOpacity = interpolate(frame, [0, inDuration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Exit opacity
  const exitOpacity = interpolate(
    frame,
    [durationInFrames - outDuration, durationInFrames],
    [1, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  const opacity = Math.min(enterOpacity, exitOpacity);

  let transform = "";
  if (type === "zoomFade") {
    const enterScale = interpolate(frame, [0, inDuration], [0.94, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
    const exitScale = interpolate(
      frame,
      [durationInFrames - outDuration, durationInFrames],
      [1, 1.05],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    );
    transform = `scale(${enterScale * (exitScale / 1)})`;
  }

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transform: transform || undefined,
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </div>
  );
};
