import React from "react";
import { interpolate, spring } from "remotion";
import { ProductUI, ProductUIType } from "../components/ProductUI";
import { BRAND_COLORS, FPS, SAFE_ZONE } from "../config/timeline";

interface TrackingProps {
  frame: number;
}

export const TrackingScene: React.FC<TrackingProps> = ({ frame }) => {
  // 4 rapid segments across 180 frames:
  // 0-45 (1.5s):   SLEEP
  // 45-90 (1.5s):  FITNESS
  // 90-135 (1.5s): FOOD
  // 135-180 (1.5s): HABITS

  let currentCategory: {
    title: string;
    type: ProductUIType;
    subtitle: string;
    accent: string;
    localF: number;
  };

  if (frame < 45) {
    currentCategory = {
      title: "SLEEP",
      type: "sleep",
      subtitle: "Bedtime Consistency & Rhythm",
      accent: BRAND_COLORS.purpleSleep,
      localF: frame,
    };
  } else if (frame < 90) {
    currentCategory = {
      title: "FITNESS",
      type: "fitness",
      subtitle: "Progressive Overload & Workouts",
      accent: BRAND_COLORS.warningAmber,
      localF: frame - 45,
    };
  } else if (frame < 135) {
    currentCategory = {
      title: "FOOD",
      type: "food",
      subtitle: "Calories & Clean Nutrition Baseline",
      accent: BRAND_COLORS.dangerCoral,
      localF: frame - 90,
    };
  } else {
    currentCategory = {
      title: "HABITS",
      type: "habits",
      subtitle: "Daily Execution & 90-Day Streaks",
      accent: BRAND_COLORS.successEmerald,
      localF: frame - 135,
    };
  }

  // Quick snap spring on each word/scene transition
  const snapSpr = spring({
    frame: currentCategory.localF,
    fps: FPS,
    config: { damping: 14, stiffness: 220, mass: 0.6 },
  });

  const cardScale = interpolate(snapSpr, [0, 1], [0.94, 1.02]);
  const cardOpacity = interpolate(snapSpr, [0, 1], [0, 1]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: BRAND_COLORS.bgDeep,
        overflow: "hidden",
      }}
    >
      {/* Category Dynamic Ambient Glow */}
      <div
        style={{
          position: "absolute",
          top: "25%",
          left: "20%",
          width: "60%",
          height: "45%",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${currentCategory.accent}25 0%, transparent 70%)`,
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Bold Kinetic Category Header */}
      <div
        style={{
          position: "absolute",
          top: SAFE_ZONE.paddingTop + 5,
          left: SAFE_ZONE.paddingHorizontal,
          right: SAFE_ZONE.paddingHorizontal,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 6,
          zIndex: 20,
        }}
      >
        <div
          style={{
            fontSize: 52,
            fontWeight: 900,
            letterSpacing: "0.14em",
            color: currentCategory.accent,
            textShadow: `0 0 28px ${currentCategory.accent}66`,
            textTransform: "uppercase",
          }}
        >
          {currentCategory.title}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 700,
            letterSpacing: "0.08em",
            color: BRAND_COLORS.textSecondary,
          }}
        >
          {currentCategory.subtitle}
        </div>
      </div>

      {/* Synchronized Screen Card Showcase - Perfectly Centered in 9:16 Canvas */}
      <div
        style={{
          position: "absolute",
          top: "56%",
          left: "50%",
          transform: `translate(-50%, -50%) scale(${cardScale})`,
          opacity: cardOpacity,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <ProductUI
          frame={frame}
          type={currentCategory.type}
          zoom={1.0}
        />
      </div>

      {/* 4-Segment Progress Indicator Bar at Bottom */}
      <div
        style={{
          position: "absolute",
          bottom: SAFE_ZONE.paddingBottom - 160,
          left: SAFE_ZONE.paddingHorizontal + 40,
          right: SAFE_ZONE.paddingHorizontal + 40,
          display: "flex",
          gap: 12,
          zIndex: 20,
        }}
      >
        {["SLEEP", "FITNESS", "FOOD", "HABITS"].map((name, i) => {
          const isActive =
            (i === 0 && frame < 45) ||
            (i === 1 && frame >= 45 && frame < 90) ||
            (i === 2 && frame >= 90 && frame < 135) ||
            (i === 3 && frame >= 135);

          return (
            <div
              key={name}
              style={{
                flex: 1,
                height: 5,
                borderRadius: 3,
                backgroundColor: isActive
                  ? BRAND_COLORS.accentCyan
                  : "rgba(255, 255, 255, 0.15)",
                boxShadow: isActive
                  ? `0 0 12px ${BRAND_COLORS.accentCyan}`
                  : undefined,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
