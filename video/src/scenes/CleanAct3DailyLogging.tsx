import React from "react";
import { interpolate, spring } from "remotion";
import { CleanPhoneMockup } from "../components/CleanPhoneMockup";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct3DailyLoggingProps {
  frame: number;
}

export const CleanAct3DailyLogging: React.FC<CleanAct3DailyLoggingProps> = ({
  frame,
}) => {
  // Pacing (180 frames = 6.0s / 14.5s to 20.5s):
  // f0 - f30: Camera push-in on daily logger
  // f30 - f75: Step logger taps +2,400 -> count increments 6,020 -> 8,420
  // f75 - f120: Protein logger taps +35g -> count increments 85g -> 120g (Goal Met)
  // f120 - f180: Streak Toast card slides in from bottom: "14 Days Continuous"

  const entrance = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 130 },
  });

  // Step tap action at f30
  const stepTapProgress = spring({
    frame: Math.max(0, frame - 30),
    fps: FPS,
    config: { damping: 16, stiffness: 180 },
  });

  const stepCount = Math.round(
    interpolate(stepTapProgress, [0, 1], [6020, 8420])
  );

  const stepPct = interpolate(stepTapProgress, [0, 1], [60, 84]);

  // Protein tap action at f75
  const proteinTapProgress = spring({
    frame: Math.max(0, frame - 75),
    fps: FPS,
    config: { damping: 16, stiffness: 180 },
  });

  const proteinCount = Math.round(
    interpolate(proteinTapProgress, [0, 1], [85, 120])
  );

  const proteinMet = frame >= 100;

  // Notification Toast at bottom (~f120)
  const toastSpring = spring({
    frame: Math.max(0, frame - 115),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  // Floating Companion Cards below Phone (~f45, ~f105)
  const companionCard1Spring = spring({
    frame: Math.max(0, frame - 45),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  const companionCard2Spring = spring({
    frame: Math.max(0, frame - 105),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#050608",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        paddingTop: 90,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", Inter, sans-serif',
      }}
    >
      {/* Soft Ambient Radial Vignette */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.08) 0%, rgba(3, 7, 18, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header Outside Phone */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          marginBottom: 36,
          zIndex: 20,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            letterSpacing: "0.24em",
            color: BRAND_COLORS.accentIcy,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          DAILY DISCIPLINE
        </span>
        <h2
          style={{
            fontSize: 48,
            fontWeight: 850,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            margin: 0,
          }}
        >
          Log The Small Actions.
        </h2>
      </div>

      {/* Clean Phone Mockup */}
      <CleanPhoneMockup frame={frame} scale={1.03}>
        {/* Inside App Header */}
        <div
          style={{
            padding: "16px 24px 12px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>
              TODAY
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 850,
                color: "#f8fafc",
                letterSpacing: "-0.01em",
              }}
            >
              Day 14 of 90
            </div>
          </div>

          <div
            style={{
              padding: "6px 14px",
              borderRadius: 999,
              background: "rgba(52, 211, 153, 0.15)",
              border: "1px solid rgba(52, 211, 153, 0.4)",
              color: BRAND_COLORS.emeraldPill,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "0.06em",
            }}
          >
            14-DAY STREAK 🔥
          </div>
        </div>

        {/* Live Daily Logging Cards */}
        <div
          style={{
            flex: 1,
            padding: "20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          {/* STEP LOGGING CARD */}
          <div
            style={{
              padding: "20px",
              borderRadius: 22,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              border: "1.5px solid rgba(255, 255, 255, 0.09)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>👟</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                  Daily Steps
                </span>
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: BRAND_COLORS.accentIcy,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {stepCount.toLocaleString()} / 10,000
              </span>
            </div>

            {/* Progress Bar */}
            <div
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${stepPct}%`,
                  borderRadius: 5,
                  backgroundColor: BRAND_COLORS.accentIcy,
                  boxShadow: `0 0 12px ${BRAND_COLORS.accentIcy}`,
                  transition: "width 0.1s linear",
                }}
              />
            </div>

            {/* Quick Log Button */}
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  backgroundColor:
                    frame >= 30 && frame <= 42
                      ? BRAND_COLORS.accentIcy
                      : "rgba(56, 189, 248, 0.15)",
                  color:
                    frame >= 30 && frame <= 42 ? "#030712" : BRAND_COLORS.accentIcy,
                  fontSize: 13,
                  fontWeight: 800,
                  transform:
                    frame >= 30 && frame <= 42 ? "scale(0.94)" : "scale(1)",
                  transition: "transform 0.1s",
                }}
              >
                +2,400 steps logged
              </div>
            </div>
          </div>

          {/* PROTEIN / NUTRITION CARD */}
          <div
            style={{
              padding: "20px",
              borderRadius: 22,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              border: proteinMet
                ? "1.5px solid rgba(52, 211, 153, 0.4)"
                : "1.5px solid rgba(255, 255, 255, 0.09)",
              display: "flex",
              flexDirection: "column",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 22 }}>🥗</span>
                <span style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                  Protein Target
                </span>
              </div>
              <span
                style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: proteinMet ? BRAND_COLORS.emeraldPill : "#f8fafc",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {proteinCount}g / 120g
              </span>
            </div>

            <div
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(proteinCount / 120) * 100}%`,
                  borderRadius: 5,
                  backgroundColor: BRAND_COLORS.emeraldPill,
                  boxShadow: `0 0 12px ${BRAND_COLORS.emeraldPill}`,
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: proteinMet ? BRAND_COLORS.emeraldPill : "#64748b",
                }}
              >
                {proteinMet ? "✓ Daily Target Met" : "Remaining: 35g"}
              </span>

              <div
                style={{
                  padding: "6px 14px",
                  borderRadius: 10,
                  backgroundColor:
                    frame >= 75 && frame <= 88
                      ? BRAND_COLORS.emeraldPill
                      : "rgba(52, 211, 153, 0.15)",
                  color:
                    frame >= 75 && frame <= 88
                      ? "#030712"
                      : BRAND_COLORS.emeraldPill,
                  fontSize: 13,
                  fontWeight: 800,
                  transform:
                    frame >= 75 && frame <= 88 ? "scale(0.94)" : "scale(1)",
                }}
              >
                +35g protein logged
              </div>
            </div>
          </div>

          {/* FOCUS TIME CARD */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 22,
              backgroundColor: "rgba(15, 23, 42, 0.7)",
              border: "1.5px solid rgba(255, 255, 255, 0.09)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 22 }}>🎯</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#f8fafc" }}>
                  Deep Work Block
                </div>
                <div style={{ fontSize: 13, color: "#64748b" }}>
                  Morning Session
                </div>
              </div>
            </div>

            <div
              style={{
                fontSize: 16,
                fontWeight: 900,
                color: BRAND_COLORS.purpleSleep,
              }}
            >
              3h 15m ✓
            </div>
          </div>
        </div>

        {/* Slide-in Notification Toast at Bottom of Screen (f115 - f180) */}
        {frame >= 115 && (
          <div
            style={{
              margin: "0 20px 24px 20px",
              padding: "16px 20px",
              borderRadius: 20,
              backgroundColor: "rgba(15, 23, 42, 0.95)",
              border: "1.5px solid rgba(52, 211, 153, 0.5)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: interpolate(toastSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(toastSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundColor: "rgba(52, 211, 153, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: BRAND_COLORS.emeraldPill,
                  fontWeight: 900,
                }}
              >
                ✓
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#ffffff" }}>
                  All 4 Pillars Complete
                </div>
                <div style={{ fontSize: 12, color: "#94a3b8" }}>
                  14 Days Continuous Streak
                </div>
              </div>
            </div>

            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: BRAND_COLORS.emeraldPill,
              }}
            >
              +1 DAY
            </span>
          </div>
        )}
      </CleanPhoneMockup>

      {/* Floating Companion Cards below Phone (mirrors friend's demo structure) */}
      <div
        style={{
          marginTop: 26,
          display: "flex",
          flexDirection: "column",
          gap: 12,
          width: 500,
          zIndex: 25,
        }}
      >
        {frame >= 40 && (
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 20,
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.09)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: companionCard1Spring,
              transform: `translateY(${interpolate(companionCard1Spring, [0, 1], [15, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: BRAND_COLORS.accentIcy,
                  boxShadow: `0 0 10px ${BRAND_COLORS.accentIcy}`,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                Habit Synchronized
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: BRAND_COLORS.accentIcy,
                letterSpacing: "0.06em",
              }}
            >
              100% TODAY
            </span>
          </div>
        )}

        {frame >= 100 && (
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 20,
              backgroundColor: "rgba(15, 23, 42, 0.75)",
              border: "1.5px solid rgba(255, 255, 255, 0.09)",
              backdropFilter: "blur(16px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: companionCard2Spring,
              transform: `translateY(${interpolate(companionCard2Spring, [0, 1], [15, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: BRAND_COLORS.emeraldPill,
                  boxShadow: `0 0 10px ${BRAND_COLORS.emeraldPill}`,
                }}
              />
              <span style={{ fontSize: 15, fontWeight: 700, color: "#e2e8f0" }}>
                Compounding Score
              </span>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: BRAND_COLORS.emeraldPill,
                letterSpacing: "0.06em",
              }}
            >
              94 / 100
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
