import React from "react";
import { interpolate, spring } from "remotion";
import { CleanPhoneMockup } from "../components/CleanPhoneMockup";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface CleanAct2FocusSelectionProps {
  frame: number;
}

export const CleanAct2FocusSelection: React.FC<CleanAct2FocusSelectionProps> = ({
  frame,
}) => {
  // Pacing (240 frames = 8.0s / 6.5s to 14.5s overall):
  // f0 - f35: Phone glides in from bottom
  // f35 ("sleep"): Card 1 activates
  // f75 ("fitness"): Card 2 activates
  // f105 ("nutrition"): Card 3 activates
  // f135 ("focus"): Card 4 activates
  // f190 ("challenge is personal"): Bottom status card locks in

  const phoneEntrance = spring({
    frame,
    fps: FPS,
    config: { damping: 18, stiffness: 120, mass: 0.9 },
  });

  const phoneY = interpolate(phoneEntrance, [0, 1], [400, 0]);

  // Card 1: Sleep (~f35)
  const sleepActive = frame >= 35;
  const sleepSpring = spring({
    frame: Math.max(0, frame - 35),
    fps: FPS,
    config: { damping: 14, stiffness: 180 },
  });

  // Card 2: Fitness (~f75)
  const fitnessActive = frame >= 75;
  const fitnessSpring = spring({
    frame: Math.max(0, frame - 75),
    fps: FPS,
    config: { damping: 14, stiffness: 180 },
  });

  // Card 3: Nutrition (~f105)
  const nutritionActive = frame >= 105;
  const nutritionSpring = spring({
    frame: Math.max(0, frame - 105),
    fps: FPS,
    config: { damping: 14, stiffness: 180 },
  });

  // Card 4: Focus (~f135)
  const focusActive = frame >= 135;
  const focusSpring = spring({
    frame: Math.max(0, frame - 135),
    fps: FPS,
    config: { damping: 14, stiffness: 180 },
  });

  // Bottom Pill: "Challenge is Personal" (~f190)
  const personalPillSpring = spring({
    frame: Math.max(0, frame - 190),
    fps: FPS,
    config: { damping: 16, stiffness: 150 },
  });

  // Floating Companion Cards below Phone (~f65, ~f125)
  const companionCard1Spring = spring({
    frame: Math.max(0, frame - 65),
    fps: FPS,
    config: { damping: 16, stiffness: 160 },
  });

  const companionCard2Spring = spring({
    frame: Math.max(0, frame - 125),
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
          top: "20%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, rgba(3, 7, 18, 0) 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Header text outside phone */}
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
          SELECT YOUR FOCUS
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
          Choose Your Arc.
        </h2>
      </div>

      {/* The Clean Phone Mockup */}
      <CleanPhoneMockup frame={frame} translateY={phoneY} scale={1.02}>
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
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 28,
                height: 28,
                borderRadius: 8,
                background: "linear-gradient(135deg, #0284c7, #38bdf8)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#ffffff",
                fontSize: 14,
                fontWeight: 900,
              }}
            >
              W
            </div>
            <span
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: "#f8fafc",
                letterSpacing: "-0.01em",
              }}
            >
              Winter Arc
            </span>
          </div>

          <div
            style={{
              padding: "4px 10px",
              borderRadius: 999,
              background: "rgba(56, 189, 248, 0.12)",
              color: BRAND_COLORS.accentIcy,
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.08em",
            }}
          >
            ACTIVE TARGETS
          </div>
        </div>

        {/* 4 Interactive Goal Selection Cards */}
        <div
          style={{
            flex: 1,
            padding: "20px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          {/* CARD 1: SLEEP */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 20,
              backgroundColor: sleepActive ? "#0c1524" : "rgba(15, 23, 42, 0.5)",
              border: sleepActive
                ? `1.5px solid ${BRAND_COLORS.accentIcy}`
                : "1.5px solid rgba(255, 255, 255, 0.08)",
              boxShadow: sleepActive
                ? `0 8px 24px rgba(56, 189, 248, 0.2)`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: `scale(${interpolate(sleepSpring, [0, 1], [0.96, 1])})`,
              transition: "border 0.2s, background-color 0.2s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>🌙</span>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: sleepActive ? "#ffffff" : "#94a3b8",
                  }}
                >
                  Sleep Schedule
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  10:30 PM • 8.0 hrs
                </div>
              </div>
            </div>

            {/* Toggle */}
            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                backgroundColor: sleepActive ? BRAND_COLORS.accentIcy : "#334155",
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: sleepActive ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>

          {/* CARD 2: FITNESS */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 20,
              backgroundColor: fitnessActive ? "#18140c" : "rgba(15, 23, 42, 0.5)",
              border: fitnessActive
                ? `1.5px solid ${BRAND_COLORS.warningAmber}`
                : "1.5px solid rgba(255, 255, 255, 0.08)",
              boxShadow: fitnessActive
                ? `0 8px 24px rgba(251, 191, 36, 0.2)`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: `scale(${interpolate(fitnessSpring, [0, 1], [0.96, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>💪</span>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: fitnessActive ? "#ffffff" : "#94a3b8",
                  }}
                >
                  Daily Fitness
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  1 Session • 10,000 Steps
                </div>
              </div>
            </div>

            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                backgroundColor: fitnessActive ? BRAND_COLORS.warningAmber : "#334155",
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: fitnessActive ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>

          {/* CARD 3: NUTRITION */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 20,
              backgroundColor: nutritionActive ? "#0c1813" : "rgba(15, 23, 42, 0.5)",
              border: nutritionActive
                ? `1.5px solid ${BRAND_COLORS.emeraldPill}`
                : "1.5px solid rgba(255, 255, 255, 0.08)",
              boxShadow: nutritionActive
                ? `0 8px 24px rgba(52, 211, 153, 0.2)`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: `scale(${interpolate(nutritionSpring, [0, 1], [0.96, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>🥗</span>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: nutritionActive ? "#ffffff" : "#94a3b8",
                  }}
                >
                  Nutrition & Diet
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  120g Protein • Whole Foods
                </div>
              </div>
            </div>

            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                backgroundColor: nutritionActive ? BRAND_COLORS.emeraldPill : "#334155",
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: nutritionActive ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>

          {/* CARD 4: FOCUS */}
          <div
            style={{
              padding: "18px 20px",
              borderRadius: 20,
              backgroundColor: focusActive ? "#140c1e" : "rgba(15, 23, 42, 0.5)",
              border: focusActive
                ? `1.5px solid ${BRAND_COLORS.purpleSleep}`
                : "1.5px solid rgba(255, 255, 255, 0.08)",
              boxShadow: focusActive
                ? `0 8px 24px rgba(129, 140, 248, 0.2)`
                : "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              transform: `scale(${interpolate(focusSpring, [0, 1], [0.96, 1])})`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <span style={{ fontSize: 26 }}>🎯</span>
              <div>
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 800,
                    color: focusActive ? "#ffffff" : "#94a3b8",
                  }}
                >
                  Deep Focus
                </div>
                <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                  3 Hours Flow State
                </div>
              </div>
            </div>

            <div
              style={{
                width: 44,
                height: 26,
                borderRadius: 13,
                backgroundColor: focusActive ? BRAND_COLORS.purpleSleep : "#334155",
                padding: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: focusActive ? "flex-end" : "flex-start",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: "#ffffff",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              />
            </div>
          </div>
        </div>

        {/* Lock-in Notification Toast at Bottom of Phone (~f190) */}
        {frame >= 185 && (
          <div
            style={{
              margin: "0 20px 24px 20px",
              padding: "14px 20px",
              borderRadius: 18,
              backgroundColor: "rgba(56, 189, 248, 0.14)",
              border: `1.5px solid ${BRAND_COLORS.accentIcy}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              opacity: interpolate(personalPillSpring, [0, 1], [0, 1]),
              transform: `translateY(${interpolate(personalPillSpring, [0, 1], [20, 0])}px)`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, color: BRAND_COLORS.accentIcy }}>✓</span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 800,
                  color: "#f8fafc",
                  letterSpacing: "0.02em",
                }}
              >
                THE CHALLENGE IS PERSONAL
              </span>
            </div>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: BRAND_COLORS.accentIcy,
              }}
            >
              LOCKED IN
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
        {frame >= 60 && (
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
                Target Discipline
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
              4 PILLARS ACTIVE
            </span>
          </div>
        )}

        {frame >= 120 && (
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
                Winter Protocol
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
              90 CONSECUTIVE DAYS
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
