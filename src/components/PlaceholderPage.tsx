"use client";

import { AppShell } from "@/components/AppShell";

export function PlaceholderPage({
  title,
  blurb,
}: {
  title: string;
  blurb: string;
}) {
  return (
    <AppShell>
      <main className="mx-auto flex min-h-dvh w-full max-w-2xl flex-col items-start justify-center gap-3 px-6">
        <h1 className="text-3xl font-extrabold">{title}</h1>
        <p className="text-sm text-muted">{blurb}</p>
        <p className="rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted">
          Coming soon — Home is ready, this screen is next
        </p>
      </main>
    </AppShell>
  );
}
