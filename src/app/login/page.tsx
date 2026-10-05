"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { ArrowLeft, Check, Eye, EyeOff, Sparkles } from "lucide-react";
import { WinterArcLogo } from "@/components/brand";
import { useAuth } from "@/lib/auth";

type Mode = "signin" | "signup" | "forgot" | "verify";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-dvh flex items-center justify-center text-muted">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextRoute = searchParams?.get("next") || "/";

  const { status, user, signIn, signUp, signInGoogle, resetPassword } = useAuth();

  const [mode, setMode] = useState<Mode>("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  // If already authenticated, redirect to next route
  useEffect(() => {
    if (status === "authenticated" && user) {
      router.replace(nextRoute);
    }
  }, [status, user, router, nextRoute]);

  const busyGuard = (key: string, run: () => Promise<void>) => {
    if (busy) return;
    setBusy(key);
    setError("");
    run().finally(() => setBusy(null));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    busyGuard("signin", async () => {
      const res = await signIn(email, password);
      if (!res.ok) {
        setError(res.message ?? "Couldn't sign in. Please verify your credentials.");
      } else {
        router.replace(nextRoute);
      }
    });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    busyGuard("signup", async () => {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirm) {
        setError("Passwords do not match.");
        return;
      }
      const res = await signUp(name, email, password);
      if (!res.ok) {
        setError(res.message ?? "Couldn't create the account. Please try again.");
      } else if (res.needsVerify) {
        setMode("verify");
      } else {
        router.replace(nextRoute);
      }
    });
  };

  const handleGoogle = () => {
    busyGuard("google", async () => {
      const res = await signInGoogle();
      if (!res.ok) {
        setError(res.message ?? "Google sign-in was canceled or failed.");
      }
    });
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    busyGuard("forgot", async () => {
      if (!email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      const res = await resetPassword(email);
      if (!res.ok) {
        setError(res.message ?? "Couldn't send password reset email.");
      } else {
        setInfo("Reset link sent! Please check your email inbox.");
      }
    });
  };

  const inputStyles =
    "h-12 w-full rounded-2xl border border-border bg-card/60 px-4 text-base text-foreground placeholder:text-muted focus:border-accent focus:outline-none transition-colors";

  return (
    <div className="relative min-h-dvh flex flex-col items-center justify-center p-4 sm:p-6 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[480px] w-[600px] rounded-full bg-accent/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-10 h-[360px] w-[420px] rounded-full bg-indigo-500/10 blur-[100px]" />

      {/* Top back button */}
      <div className="absolute top-6 left-6 z-10">
        <NextLink
          href="/"
          className="flex items-center gap-2 rounded-full border border-border bg-card/70 px-4 py-2 text-xs font-semibold text-muted hover:text-foreground hover:border-accent transition-all backdrop-blur-md"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </NextLink>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Brand header */}
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 shadow-lg shadow-accent/10">
            <WinterArcLogo className="h-6 w-9 text-accent" />
          </div>
          <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight">
            WINTER <span className="text-accent">ARC</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-muted">
            The 90-Day Discipline & Self-Mastery Protocol
          </p>
        </div>

        {/* Auth card */}
        <div className="overflow-hidden rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          {mode === "verify" ? (
            <div className="flex flex-col items-center text-center py-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/20 text-accent mb-4">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="text-xl font-bold">Check your email</h2>
              <p className="mt-2 text-sm text-muted leading-relaxed">
                We sent a verification link to <span className="font-semibold text-foreground">{email}</span>. Click the link to activate your account and start your 90-day arc.
              </p>
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError("");
                  setInfo("");
                }}
                className="mt-6 flex h-11 items-center justify-center rounded-full bg-foreground px-6 text-sm font-bold text-background"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <>
              {/* Form title */}
              <div className="mb-5">
                <h2 className="text-xl font-bold">
                  {mode === "signup"
                    ? "Create your Account"
                    : mode === "forgot"
                    ? "Reset your Password"
                    : "Welcome back"}
                </h2>
                <p className="mt-1 text-xs text-muted">
                  {mode === "signup"
                    ? "Save your personal 90-day arc, logs, and photos securely."
                    : mode === "forgot"
                    ? "Enter your email to receive password reset instructions."
                    : "Sign in to access your ongoing Winter Arc protocol."}
                </p>
              </div>

              {/* Mode switch tabs */}
              {mode !== "forgot" && (
                <div className="mb-5 flex rounded-2xl border border-border bg-background/50 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                      setInfo("");
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      mode === "signin"
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signup");
                      setError("");
                      setInfo("");
                    }}
                    className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                      mode === "signup"
                        ? "bg-accent text-white shadow-md shadow-accent/20"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    Create Account
                  </button>
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={
                  mode === "signup"
                    ? handleSignUp
                    : mode === "forgot"
                    ? handleForgot
                    : handleSignIn
                }
                className="flex flex-col gap-3.5"
              >
                {mode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted" htmlFor="login-name">
                      Full Name
                    </label>
                    <input
                      id="login-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Alex"
                      maxLength={30}
                      className={inputStyles}
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted" htmlFor="login-email">
                    Email Address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputStyles}
                    required
                  />
                </div>

                {mode !== "forgot" && (
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-semibold text-muted" htmlFor="login-password">
                        Password
                      </label>
                      {mode === "signin" && (
                        <button
                          type="button"
                          onClick={() => {
                            setMode("forgot");
                            setError("");
                            setInfo("");
                          }}
                          className="text-[11px] font-semibold text-muted hover:text-accent transition-colors"
                        >
                          Forgot password?
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <input
                        id="login-password"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        autoComplete={mode === "signup" ? "new-password" : "current-password"}
                        className={`${inputStyles} pr-11`}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((s) => !s)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                        aria-label={showPass ? "Hide password" : "Show password"}
                      >
                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === "signup" && (
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-muted" htmlFor="login-confirm">
                      Confirm Password
                    </label>
                    <input
                      id="login-confirm"
                      type={showPass ? "text" : "password"}
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className={inputStyles}
                      required
                    />
                  </div>
                )}

                {error && (
                  <p role="alert" className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs font-medium text-red-400">
                    {error}
                  </p>
                )}

                {info && (
                  <p role="status" className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs font-medium text-emerald-400">
                    {info}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={busy != null}
                  className="mt-1 flex h-12 w-full items-center justify-center rounded-full bg-foreground text-sm font-bold text-background transition-opacity hover:opacity-90 disabled:opacity-60 shadow-lg"
                >
                  {busy === "signin"
                    ? "Signing in…"
                    : busy === "signup"
                    ? "Creating account…"
                    : busy === "forgot"
                    ? "Sending reset link…"
                    : mode === "signup"
                    ? "CREATE YOUR ARC"
                    : mode === "forgot"
                    ? "SEND RESET INSTRUCTIONS"
                    : "ENTER WINTER ARC"}
                </button>

                <button
                  type="button"
                  onClick={handleGoogle}
                  disabled={busy != null}
                  className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-border bg-background/60 text-sm font-bold transition-all hover:bg-card hover:border-accent disabled:opacity-60"
                >
                  <GoogleIcon />
                  {busy === "google" ? "Connecting Google…" : "Continue with Google"}
                </button>

                <div className="relative my-2 flex items-center justify-center">
                  <span className="w-full border-t border-border" />
                  <span className="absolute bg-card px-2 text-[10px] uppercase font-bold tracking-widest text-muted">
                    or
                  </span>
                </div>

                <NextLink
                  href="/"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full border border-dashed border-border text-xs font-semibold text-muted hover:text-foreground hover:border-foreground/40 transition-colors"
                >
                  <Sparkles className="h-3.5 w-3.5 text-accent" />
                  Continue as Guest (Preview Mode)
                </NextLink>

                {mode === "forgot" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode("signin");
                      setError("");
                      setInfo("");
                    }}
                    className="mt-2 text-xs font-semibold text-accent hover:underline text-center"
                  >
                    ← Back to Sign In
                  </button>
                )}
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.3h6.5c-.1 1.1-.8 2.7-2.4 3.8l-.1.1 3.5 2.7.2.1c2.2-2 3.8-5 3.8-8.8z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.8-2.9c-1 .7-2.4 1.2-4.1 1.2-3.2 0-5.9-2.1-6.8-5l-.1.1-3.7 2.9v.1C3.3 21.5 7.3 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.2 14.4c-.2-.7-.4-1.5-.4-2.4s.1-1.7.4-2.4l-.1-.1-3.6-2.8-.1.1C.5 8.6 0 10.2 0 12s.5 3.4 1.4 4.9l3.8-2.5z"
      />
      <path
        fill="#EA4335"
        d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.3 2.5 1.4 7.1l3.8 2.9c.9-2.9 3.6-5.3 6.8-5.3z"
      />
    </svg>
  );
}
