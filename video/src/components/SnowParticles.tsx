import React, { useMemo } from "react";

interface SnowParticlesProps {
  frame: number;
  count?: number;
  opacity?: number;
}

interface Flake {
  x: number;
  speedY: number;
  swayAmp: number;
  swayFreq: number;
  size: number;
  alpha: number;
  blur: number;
}

export const SnowParticles: React.FC<SnowParticlesProps> = ({
  frame,
  count = 42,
  opacity = 0.75,
}) => {
  // Precompute pseudo-random attributes so flakes remain deterministic across frames
  const flakes = useMemo<Flake[]>(() => {
    return Array.from({ length: count }).map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = seed / 233280;
      const rnd2 = ((seed * 9301 + 49297) % 233280) / 233280;
      const rnd3 = ((seed * 9301 + 49297 * 2) % 233280) / 233280;

      return {
        x: rnd * 1080,
        speedY: 1.2 + rnd2 * 2.4,
        swayAmp: 10 + rnd3 * 22,
        swayFreq: 0.02 + rnd * 0.03,
        size: 2 + rnd2 * 4.5,
        alpha: 0.25 + rnd3 * 0.65,
        blur: rnd > 0.7 ? 1.5 : 0,
      };
    });
  }, [count]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        opacity,
        overflow: "hidden",
      }}
    >
      {flakes.map((flake, i) => {
        const y = ((frame * flake.speedY + i * 45) % 2000) - 80;
        const x = (flake.x + Math.sin(frame * flake.swayFreq + i) * flake.swayAmp) % 1080;

        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: flake.size,
              height: flake.size,
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 0 6px rgba(186, 230, 253, 0.8)",
              opacity: flake.alpha,
              filter: flake.blur > 0 ? `blur(${flake.blur}px)` : undefined,
            }}
          />
        );
      })}
    </div>
  );
};
