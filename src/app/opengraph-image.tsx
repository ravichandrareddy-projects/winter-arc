import { ImageResponse } from "next/og";

export const alt = "Winter Arc — 90-Day Discipline & Self-Mastery Protocol";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0F14",
          backgroundImage:
            "radial-gradient(circle at 50% 15%, rgba(59, 130, 246, 0.3) 0%, transparent 65%), radial-gradient(circle at 85% 85%, rgba(99, 102, 241, 0.2) 0%, transparent 50%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          padding: "60px 80px",
          textAlign: "center",
        }}
      >
        {/* Protocol Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            border: "1px solid rgba(59, 130, 246, 0.5)",
            backgroundColor: "rgba(59, 130, 246, 0.15)",
            padding: "8px 24px",
            borderRadius: "9999px",
            fontSize: "18px",
            fontWeight: "700",
            color: "#60A5FA",
            letterSpacing: "2px",
            textTransform: "uppercase",
            marginBottom: "24px",
          }}
        >
          ❄️ 90-Day Self-Mastery Protocol
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "80px",
            fontWeight: "900",
            letterSpacing: "-2px",
            lineHeight: 1.1,
            marginBottom: "20px",
            display: "flex",
            gap: "18px",
          }}
        >
          <span>WINTER</span>
          <span style={{ color: "#3B82F6" }}>ARC</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "26px",
            color: "#94A3B8",
            maxWidth: "850px",
            lineHeight: 1.4,
            marginBottom: "40px",
          }}
        >
          Add once. Log daily. Build unshakeable discipline across Sleep, 5 AM Wake-Up, Nutrition, Workouts & 90-Day Habit Progression.
        </div>

        {/* 4 Feature Badges */}
        <div
          style={{
            display: "flex",
            gap: "16px",
          }}
        >
          {["90-Day Heatmap", "Sleep & 5 AM Wake-Up", "Nutrition Macros", "Fitness Split Tracker"].map(
            (item) => (
              <div
                key={item}
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.07)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "12px 22px",
                  borderRadius: "16px",
                  fontSize: "17px",
                  fontWeight: "600",
                  color: "#E2E8F0",
                }}
              >
                {item}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
