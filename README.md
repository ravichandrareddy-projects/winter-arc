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

# Optional: add your real Google Analytics 4 web-stream measurement ID
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### Optional Google Analytics 4

Google Analytics and Firebase are separate from the existing Supabase authentication/sync setup. Firebase is not required for website visitor counts.

1. Create a GA4 web data stream for `https://winterarc.indevs.in` in Google Analytics and copy its `G-...` measurement ID.
2. In that stream, turn **Enhanced measurement off**. The app sends its own initial and client-navigation page views; automatic history tracking would duplicate those events and may include raw URLs.
3. Add `NEXT_PUBLIC_GA_MEASUREMENT_ID` to the hosting project's production environment and redeploy. `NEXT_PUBLIC_` values are included at build time.
4. Verify visits in Google Analytics Realtime after deployment (browser blockers may prevent collection).

Without a valid ID, no Google tag is loaded and the CSP does not allow analytics origins. With an ID, the tag loads during browser idle time. This integration sends route page views, omits URL queries/fragments, and disables Google Signals and advertising personalization. It does not send tracker entries, meals, sleep records, photos, or account details. Google Analytics can still use cookies and browser/device information; these visits are not described as anonymous. No custom Web Vitals collection is installed.

To verify either configuration locally, run `node scripts/test-analytics.mjs` against a production server using `WINTERARC_TEST_URL`. For the enabled test, build and start with `NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TEST12345`, then pass `WINTERARC_EXPECT_GA=G-TEST12345` to the test. The test intercepts the Google tag, so it sends no analytics to Google.

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Browser regression checks

Offline support is enabled in production builds. Build and start a local production server before running the browser checks:

```bash
npm run build
npm run start -- --port 3100
```

In another terminal, point the test runner at an installed Chrome/Chromium executable:

```bash
CHROME_PATH=/usr/bin/google-chrome npm run test:browser
```

Set `WINTERARC_TEST_URL` for a different local server and `WINTERARC_TEST_ARTIFACTS` to choose an artifact directory. Tests use isolated guest browser storage and cover progress totals, meal synchronization, themes, validation, custom arc phases, keyboard dialogs, narrow screens, photo-inclusive backup/restore, data clearing, hydration, and offline reopening.

JSON backups now include photo files. Older metadata-only backups still restore, with a message identifying missing images.

Run the local security regression checks after starting the production server:

```bash
CHROME_PATH=/usr/bin/google-chrome npm run test:security
```

These checks cover response security headers, malicious backup photo paths, persisted router destinations, and auth callback redirect handling.

Apply `supabase/migrations/0002_security_hardening.sql` to the Supabase project before deploying the storage changes. The policy permits owners to access direct `<user-id>/<photo-id>` paths and rejects other users, nested paths, and invalid filenames.

## Video Rendering

To render promotional videos via Remotion:

```bash
# Preview in Remotion Studio
npm run video:preview

# Render ad video
npm run video:remotion
```
