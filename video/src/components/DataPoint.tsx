import React from "react";
import { BRAND_COLORS } from "../config/timeline";

interface DataPointProps {
  x: number;
  y: number;
  size?: number;
  color?: string;
  glow?: boolean;
  pulse?: boolean;
  frame?: number;
  opacity?: number;
  label?: string;
}

export const DataPoint: React.FC<DataPointProps> = ({
  x,
  y,
  size = 14,
  color = BRAND_COLORS.accentIcy,
  glow = true,
  pulse = true,
  frame = 0,
  opacity = 1,
  label,
}) => {
  const pulseScale = pulse ? 1 + Math.sin(frame * 0.15) * 0.22 : 1;
  const pulseOpacity = pulse ? 0.45 + Math.sin(frame * 0.15) * 0.25 : 0.4;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        opacity,
      }}
    >
      {/* Outer Halo Wave */}
      {glow && (
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: `translate(-50%, -50%) scale(${pulseScale * 2.2})`,
            width: size * 3,
            height: size * 3,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
            opacity: pulseOpacity,
          }}
        />
      )}

      {/* Mid Glow Ring */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${pulseScale})`,
          width: size * 1.8,
          height: size * 1.8,
          borderRadius: "50%",
          border: `1.5px solid ${color}`,
          boxShadow: `0 0 14px ${color}`,
        }}
      />

      {/* Core Dot */}
      <div
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          boxShadow: `0 0 10px #ffffff, 0 0 20px ${color}`,
        }}
      />

      {label && (
        <div
          style={{
            position: "absolute",
            top: size + 8,
            left: "50%",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: BRAND_COLORS.textPrimary,
            textShadow: "0 2px 8px rgba(0,0,0,0.9)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
};
