"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const save = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setError("");
    setBusy(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError("Couldn't update password. Try the reset link again.");
      return;
    }
    router.replace("/");
  };

  return (
    <AppShell>
      <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center gap-4 px-6">
        <h1 className="text-2xl font-extrabold">Set a new password</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="h-12 w-full rounded-xl border border-border bg-card px-4"
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm password"
          className="h-12 w-full rounded-xl border border-border bg-card px-4"
        />
        {error && (
          <p role="alert" className="text-sm font-medium text-red-500">{error}</p>
        )}
        <button
          onClick={save}
          disabled={busy}
          className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-semibold text-background disabled:opacity-60"
        >
          {busy ? "Saving…" : "SAVE PASSWORD"}
        </button>
      </main>
    </AppShell>
  );
}
