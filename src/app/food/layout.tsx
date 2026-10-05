import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food & Nutrition Tracking",
  description:
    "Log daily meals, monitor calories, and track macronutrient balance (protein, carbs, fats) to support your Winter Arc discipline.",
  alternates: {
    canonical: "https://winterarc.indevs.in/food",
  },
  openGraph: {
    title: "Food & Nutrition Tracking — Winter Arc",
    description:
      "Log daily meals, monitor calories, and track macronutrient balance (protein, carbs, fats) to support your Winter Arc discipline.",
    url: "https://winterarc.indevs.in/food",
  },
};

export default function FoodLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
