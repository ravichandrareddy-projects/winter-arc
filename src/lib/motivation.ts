export interface MotivationQuote {
  id: string;
  quote: string;
  author: string;
  theme: "discipline" | "focus" | "resilience" | "consistency";
}

export const MOTIVATION_QUOTES: MotivationQuote[] = [
  {
    id: "q1",
    quote: "You do not rise to the level of your goals. You fall to the level of your systems.",
    author: "James Clear",
    theme: "consistency",
  },
  {
    id: "q2",
    quote: "We must all suffer one of two things: the pain of discipline or the pain of regret.",
    author: "Jim Rohn",
    theme: "discipline",
  },
  {
    id: "q3",
    quote: "The winter arc is not about perfection. It is about relentless, quiet consistency.",
    author: "Winter Arc Protocol",
    theme: "discipline",
  },
  {
    id: "q4",
    quote: "We suffer more often in imagination than in reality.",
    author: "Seneca",
    theme: "resilience",
  },
  {
    id: "q5",
    quote: "The standard is the standard. No excuses, no shortcuts.",
    author: "Mike Tomlin",
    theme: "discipline",
  },
  {
    id: "q6",
    quote: "Cold mornings, quiet hours, undeniable results. Win in the dark.",
    author: "Winter Arc Creed",
    theme: "focus",
  },
  {
    id: "q7",
    quote: "Greatness is not a destiny. It is a daily decision to endure the work.",
    author: "Kobe Bryant",
    theme: "resilience",
  },
  {
    id: "q8",
    quote: "Don't count the days, make the days count.",
    author: "Muhammad Ali",
    theme: "consistency",
  },
  {
    id: "q9",
    quote: "Self-discipline is the master key to riches, mental clarity, and freedom.",
    author: "Marcus Aurelius",
    theme: "discipline",
  },
  {
    id: "q10",
    quote: "While everyone else waits for January 1st, your transformation is already done.",
    author: "Winter Arc Manifesto",
    theme: "focus",
  },
];

export interface ArcPhase {
  phase: number;
  name: string;
  subtitle: string;
  dayRange: string;
  description: string;
  badgeColor: string;
}

export const ARC_PHASES: ArcPhase[] = [
  {
    phase: 1,
    name: "The Foundation",
    subtitle: "Habit Locking",
    dayRange: "Days 1 – 30",
    description: "Eliminate friction. Solidify sleep schedule, hydration, and zero-day resistance.",
    badgeColor: "#38bdf8",
  },
  {
    phase: 2,
    name: "The Hardening",
    subtitle: "Overdrive & Grit",
    dayRange: "Days 31 – 60",
    description: "Raise intensity. Nutrition precision, higher physical output, mental endurance.",
    badgeColor: "#818cf8",
  },
  {
    phase: 3,
    name: "The Transcendence",
    subtitle: "Peak Transformation",
    dayRange: "Days 61 – 90",
    description: "Undeniable results. The habits have become your identity. Pure discipline.",
    badgeColor: "#34d399",
  },
];

export interface DailyChallenge {
  title: string;
  target: string;
  xp: string;
}

export const DAILY_CHALLENGES: DailyChallenge[] = [
  { title: "Cold Awakening", target: "Drink 500ml ice-cold water before touching your phone", xp: "+50 Grit" },
  { title: "No Zero Day", target: "Complete all daily primary trackers with 100% checkmark", xp: "+100 Momentum" },
  { title: "Deep Focus Hour", target: "60 minutes of uninterrupted study or project building", xp: "+75 Focus" },
  { title: "Warrior Wind-down", target: "Zero screens 30 minutes prior to your scheduled sleep time", xp: "+60 Recovery" },
  { title: "Iron Nutrition", target: "Meet your daily protein target without processed sugars", xp: "+80 Fuel" },
];

export function getDailyChallenge(dayNumber: number): DailyChallenge {
  return DAILY_CHALLENGES[Math.abs(dayNumber - 1) % DAILY_CHALLENGES.length];
}

export function getArcPhase(dayNumber: number): ArcPhase {
  if (dayNumber <= 30) return ARC_PHASES[0];
  if (dayNumber <= 60) return ARC_PHASES[1];
  return ARC_PHASES[2];
}
