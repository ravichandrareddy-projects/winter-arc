import React from "react";
import { interpolate, spring } from "remotion";
import { LogoReveal } from "../components/LogoReveal";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface SystemPipelineProps {
  frame: number;
}

export const SystemPipelineScene: React.FC<SystemPipelineProps> = ({ frame }) => {
  // Timeline:
  // f0 - f65: 4 words appear in continuous kinetic sequence connected by laser line
  // f65 - f95: Line transforms upward into mountain silhouette
  // f95 - f135: Mountain morphs into glowing Winter Arc emblem!

  const steps = [
    { label: "LOG", delay: 5 },
    { label: "SEE", delay: 18 },
    { label: "UNDERSTAND", delay: 32 },
    { label: "IMPROVE", delay: 46 },
  ];

  // Laser line drawing across words
  const lineProgress = interpolate(frame, [10, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Mountain ridge emergence
  const mountainMorphProgress = interpolate(frame, [65, 95], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Final Logo reveal emergence
  const logoMorphProgress = interpolate(frame, [95, 120], [0, 1], {
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
      {/* Background Soft Glow */}
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "20%",
          width: "60%",
          height: "40%",
          borderRadius: "50%",
          background: `radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, transparent 70%)`,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* PHASE 1: Words and connecting line (f0 - f80) */}
      {frame < 90 && (
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: SAFE_ZONE.paddingHorizontal - 15,
            right: SAFE_ZONE.paddingHorizontal - 15,
            transform: "translateY(-50%)",
            opacity: 1 - mountainMorphProgress * 0.8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 800,
              letterSpacing: "0.28em",
              color: BRAND_COLORS.accentIcy,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            THE CORE PHILOSOPHY
          </div>

          <div
            style={{
              position: "relative",
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "28px 24px",
              background: "rgba(10, 16, 28, 0.82)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: `1.5px solid ${BRAND_COLORS.cardBorderIcy}`,
              borderRadius: 24,
              boxShadow: "0 16px 40px rgba(0, 0, 0, 0.6)",
            }}
          >
            {/* Thin Connecting Icy-Blue Line */}
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: 36,
                width: `${lineProgress * (960 - 180)}px`,
                height: 2.5,
                background: `linear-gradient(90deg, #38bdf8, #bae6fd)`,
                boxShadow: `0 0 10px #38bdf8`,
                transform: "translateY(-50%)",
                zIndex: 1,
              }}
            />

            {steps.map((st, idx) => {
              const spr = spring({
                frame: Math.max(0, frame - st.delay),
                fps: FPS,
                config: { damping: 14, stiffness: 220, mass: 0.6 },
              });

              const active = frame >= st.delay;

              return (
                <div
                  key={st.label}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    transform: `scale(${interpolate(spr, [0, 1], [0.7, 1])})`,
                    opacity: interpolate(spr, [0, 1], [0, 1]),
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      padding: "10px 16px",
                      borderRadius: 14,
                      background: active
                        ? "rgba(56, 189, 248, 0.2)"
                        : "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${
                        active
                          ? BRAND_COLORS.accentIcy
                          : "rgba(255, 255, 255, 0.1)"
                      }`,
                      fontSize: 18,
                      fontWeight: 900,
                      letterSpacing: "0.06em",
                      color: active
                        ? BRAND_COLORS.textPrimary
                        : BRAND_COLORS.textMuted,
                      boxShadow: active
                        ? `0 0 14px ${BRAND_COLORS.accentGlow}`
                        : undefined,
                    }}
                  >
                    {st.label}
                  </div>

                  {idx < steps.length - 1 && (
                    <span
                      style={{
                        color: active
                          ? BRAND_COLORS.accentIcy
                          : "rgba(255,255,255,0.2)",
                        fontSize: 16,
                        fontWeight: 900,
                      }}
                    >
                      →
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* PHASE 2: Line transforms into Mountain Silhouette (f65 - f95) */}
      {frame >= 65 && frame < 110 && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 480,
            height: 320,
            opacity: interpolate(
              frame,
              [65, 80, 95, 110],
              [0, 1, 1, 0]
            ),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 15,
          }}
        >
          <svg
            viewBox="0 0 400 300"
            style={{ width: "100%", height: "100%" }}
          >
            <polyline
              points={`20,240 120,${240 - mountainMorphProgress * 120} 200,${
                240 - mountainMorphProgress * 180
              } 280,${240 - mountainMorphProgress * 100} 380,240`}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: "drop-shadow(0 0 12px rgba(56, 189, 248, 0.8))",
              }}
            />
          </svg>
        </div>
      )}

      {/* PHASE 3: Mountain becomes the Winter Arc Logo! (f95+) */}
      {frame >= 90 && (
        <div
          style={{
            position: "absolute",
            top: "48%",
            left: "50%",
            transform: `translate(-50%, -50%) scale(${interpolate(
              logoMorphProgress,
              [0, 1],
              [0.75, 1]
            )})`,
            opacity: logoMorphProgress,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 20,
          }}
        >
          <LogoReveal frame={frame - 90} size={150} pulse />
        </div>
      )}
    </div>
  );
};
