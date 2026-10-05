"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { WinterArcLogo } from "./brand";
import { useAuth } from "@/lib/auth";
import {
  subscribeAuthModal,
  takePending,
  type PendingAction,
} from "@/lib/auth-guard";

type Mode = "signin" | "signup" | "forgot" | "verify" | "success";

export function AuthModal() {
  const { status, signUp, signIn, signInGoogle, resetPassword } = useAuth();
  const [action, setAction] = useState<PendingAction | null>(null);
  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => subscribeAuthModal((a) => {
    setAction(a);
    if (a) {
      setMode("signin");
      setError("");
      setInfo("");
    }
  }), []);

  // successful auth while open → celebrate, then hand off to resume
  useEffect(() => {
    if (status === "authenticated" && action) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("success");
      const t = window.setTimeout(() => setAction(null), 1100);
      return () => window.clearTimeout(t);
    }
  }, [status, action]);

  if (!action) return null;

  const close = () => {
    takePending();
    setAction(null);
  };

  const busyGuard = (key: string, run: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    setError("");
    run().finally(() => setBusy(null));
  };

  const doSignIn = () =>
    busyGuard("signin", async () => {
      const r = await signIn(email, password);
      if (!r.ok) setError(r.message ?? "Couldn't sign in. Try again.");
    });

  const doSignUp = () =>
    busyGuard("signup", async () => {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords don't match.");
        return;
      }
      const r = await signUp(name, email, password);
      if (!r.ok) {
        setError(r.message ?? "Couldn't create the account. Try again.");
      } else if (r.needsVerify) {
        setMode("verify");
      }
    });

  const doGoogle = () =>
    busyGuard("google", async () => {
      const r = await signInGoogle();
      if (!r.ok) setError(r.message ?? "Google sign-in failed. Try again.");
    });

  const doForgot = () =>
    busyGuard("forgot", async () => {
      if (!email.includes("@")) {
        setError("Enter your email first.");
        return;
      }
      const r = await resetPassword(email);
      if (!r.ok) {
        setError(r.message ?? "Couldn't send the reset email.");
      } else {
        setInfo("Reset link sent — check your email.");
      }
    });

  const input =
    "h-12 w-full rounded-xl border border-border bg-background/80 px-4 text-base placeholder:text-muted";

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Sign in">
      <button aria-label="Close" onClick={close} className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div className="auth-pop relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-2xl">
        <div aria-hidden="true" className="app-bg opacity-40" />
        <div className="relative">
          <button
            onClick={close}
            aria-label="Close sign in"
            className="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-muted"
          >
            <X className="h-4 w-4" />
          </button>

          {mode === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="auth-check flex h-16 w-16 items-center justify-center rounded-full bg-green-500 text-white">
                <Check className="h-8 w-8" />
              </span>
              <p className="text-base font-bold">You&apos;re in. Continuing…</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <WinterArcLogo className="h-5 w-8 text-accent" />
                <p className="text-sm font-extrabold tracking-wide">
                  WINTER <span className="text-accent">ARC</span>
                </p>
              </div>
              <h2 className="mt-3 text-xl font-extrabold">
                {mode === "signup"
                  ? "Create your Winter Arc"
                  : mode === "forgot"
                    ? "Reset password"
                    : mode === "verify"
                      ? "Check your email"
                      : "YOUR ARC STARTS HERE."}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {mode === "verify"
                  ? `We sent a confirmation link to ${email || "your inbox"}. Open it, then come back — your ${action.label} will continue.`
                  : "Create an account to save your progress and continue your Arc across sessions and devices."}
              </p>

              {mode !== "verify" && (
                <div className="mt-4 flex flex-col gap-2.5">
                  {mode === "signup" && (
                    <>
                      <label className="text-xs font-semibold text-muted" htmlFor="auth-name">Name</label>
                      <input
                        id="auth-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        maxLength={30}
                        className={`${input} -mt-1`}
                      />
                    </>
                  )}
                  <label className="text-xs font-semibold text-muted" htmlFor="auth-email">Email</label>
                  <input
                    id="auth-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
                    className={`${input} -mt-1`}
                  />
                  {mode !== "forgot" && (
                    <>
                      <label className="text-xs font-semibold text-muted" htmlFor="auth-pass">Password</label>
                      <input
                        id="auth-pass"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        className={`${input} -mt-1`}
                      />
                    </>
                  )}
                  {mode === "signup" && (
                    <>
                      <label className="text-xs font-semibold text-muted" htmlFor="auth-confirm">Confirm Password</label>
                      <input
                        id="auth-confirm"
                        type="password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="Password"
                        autoComplete="new-password"
                        className={`${input} -mt-1`}
                      />
                    </>
                  )}

                  {error && (
                    <p role="alert" className="text-xs font-medium text-red-500">{error}</p>
                  )}
                  {info && (
                    <p role="status" className="text-xs font-medium text-green-400">{info}</p>
                  )}

                  {mode === "forgot" ? (
                    <button
                      onClick={doForgot}
                      disabled={busy != null}
                      className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-bold text-background disabled:opacity-60"
                    >
                      {busy ? "Sending…" : "SEND RESET LINK"}
                    </button>
                  ) : mode === "signup" ? (
                    <button
                      onClick={doSignUp}
                      disabled={busy != null}
                      className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-bold text-background disabled:opacity-60"
                    >
                      {busy ? "Creating your account…" : "CREATE ACCOUNT"}
                    </button>
                  ) : (
                    <button
                      onClick={doSignIn}
                      disabled={busy != null}
                      className="flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-bold text-background disabled:opacity-60"
                    >
                      {busy ? "Signing in…" : "SIGN IN"}
                    </button>
                  )}

                  <button
                    onClick={doGoogle}
                    disabled={busy != null}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background/60 text-sm font-bold disabled:opacity-60"
                  >
                    <GMark />
                    {busy === "google" ? "Signing you in…" : "Continue with Google"}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      try {
                        window.localStorage.setItem("wa-guest", "1");
                      } catch {}
                      const p = takePending();
                      p?.replay?.();
                      setAction(null);
                    }}
                    className="flex h-11 w-full items-center justify-center rounded-full border border-dashed border-border text-xs font-semibold text-muted hover:text-foreground transition-colors"
                  >
                    Continue as Guest (Store on device)
                  </button>

                  <div className="flex items-center gap-3 text-[11px] text-muted">
                    <span className="h-px flex-1 bg-border" /> OR <span className="h-px flex-1 bg-border" />
                  </div>

                  {mode === "signup" ? (
                    <button onClick={() => { setMode("signin"); setError(""); }} className="text-xs font-semibold text-accent">
                      Already have an account? Sign in
                    </button>
                  ) : (
                    <div className="flex items-center justify-between text-xs">
                      <button onClick={() => { setMode(mode === "forgot" ? "signin" : "forgot"); setError(""); setInfo(""); }} className="font-semibold text-muted">
                        {mode === "forgot" ? "← Back to sign in" : "Forgot password?"}
                      </button>
                      {mode !== "forgot" && (
                        <button onClick={() => { setMode("signup"); setError(""); }} className="font-bold text-accent">
                          Create account
                        </button>
                      )}
                    </div>
                  )}

                  <p className="flex items-center justify-center gap-3 text-[11px] text-muted">
                    <Link href="/settings" onClick={close} className="underline underline-offset-2">Privacy Policy</Link>
                    <Link href="/settings" onClick={close} className="underline underline-offset-2">Terms</Link>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GMark() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path fill="#4285F4" d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.8z" />
      <path fill="#34A853" d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.5 7.3 24 12 24z" />
      <path fill="#FBBC05" d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z" />
      <path fill="#EA4335" d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.5 1.4 7.1l3.8 2.9c.9-2.9 3.6-5.3 6.8-5.3z" />
    </svg>
  );
}
