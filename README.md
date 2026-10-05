# winter-arc

A high-performance Winter Arc transformation and daily habit tracking dashboard built with Next.js, Tailwind CSS, Lucide icons, Supabase, and Remotion.

## Features

- **Daily Habit & Goal Tracking**: Track fitness, sleep, wake-up times, nutrition, and personal habits with streaks and interactive check-ins.
- **Fitness & Body Transformation**: Log workouts, upload and track progress photos, and monitor body metrics.
- **Nutrition & Fuel**: Meal log table, macronutrient breakdown, and daily caloric trends.
- **Sleep & Routine Management**: Sleep duration, schedule consistency, and wake-up accountability.
- **Interactive Analytics**: Habit heatmaps, KPI cards, and consistency trendlines.
- **Remotion Video Integration**: Built-in dynamic promo video rendering and storyboard generator.
- **PWA & Offline Capable**: Manifest and service worker support for mobile installation.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI & Styling**: React 19, Tailwind CSS, Lucide React
- **State Management**: Zustand
- **Database & Auth**: Supabase (@supabase/ssr, @supabase/supabase-js)
- **Video Generation**: Remotion (@remotion/cli, @remotion/renderer)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Video Rendering

To render promotional videos via Remotion:

```bash
# Preview in Remotion Studio
npm run video:preview

# Render ad video
npm run video:remotion
```
