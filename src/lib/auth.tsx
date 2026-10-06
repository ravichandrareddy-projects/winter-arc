"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "./supabase/client";
import { useWinterArc } from "./store";
import {
  setStatusGetter,
  takePending,
  takeStashed,
  stashPending,
  peekPending,
  emitAuthResume,
  subscribeAuthResume,
  type AuthStatus,
  type PendingAction,
} from "./auth-guard";
import { AuthModal } from "@/components/AuthModal";
import { setHasSeenIntro } from "./intro-storage";

export type { AuthStatus };

interface AuthCtx {
  status: AuthStatus;
  user: User | null;
  signUp: (name: string, email: string, password: string) => Promise<{ ok: boolean; message?: string; needsVerify?: boolean }>;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  signInGoogle: () => Promise<{ ok: boolean; message?: string }>;
  resetPassword: (email: string) => Promise<{ ok: boolean; message?: string }>;
  signOut: () => Promise<void>;
}

const Ctx = createContext<AuthCtx>({
  status: "loading",
  user: null,
  signUp: async () => ({ ok: false }),
  signIn: async () => ({ ok: false }),
  signInGoogle: async () => ({ ok: false }),
  resetPassword: async () => ({ ok: false }),
  signOut: async () => undefined,
});

export function useAuth(): AuthCtx {
  return useContext(Ctx);
}

let browserClient: ReturnType<typeof createClient> | null = null;
function supabase() {
  if (!browserClient) browserClient = createClient();
  return browserClient;
}

/** Reopen the exact sheet after an OAuth redirect resume. */
export function useAuthResume(handler: (a: PendingAction) => void): void {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => subscribeAuthResume((a) => ref.current(a)), []);
}

function friendly(error: { message?: string } | null, fallback: string): string {
  const m = (error?.message ?? "").toLowerCase();
  if (!error) return fallback;
  if (m.includes("invalid login credentials")) return "Invalid email or password.";
  if (m.includes("user already registered") || m.includes("already exists"))
    return "Email already registered. Try signing in.";
  if (m.includes("email not confirmed")) return "Please verify your email, then sign in.";
  if (m.includes("password")) return "Password does not meet requirements (6+ characters).";
  if (m.includes("network") || m.includes("fetch")) return "Network error. Try again.";
  return fallback;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<User | null>(null);
  const statusRef = useRef<AuthStatus>("loading");

  const setAll = useCallback((s: AuthStatus, u: User | null) => {
    statusRef.current = s;
    setStatus(s);
    setUser(u);
  }, []);

  useEffect(() => {
    setStatusGetter(() => statusRef.current);
    const sb = supabase();
    sb.auth.getSession().then(({ data }) => {
      const u = data.session?.user ?? null;
      setAll(u ? "authenticated" : "unauthenticated", u);
      if (u) {
        useWinterArc.getState().setOwnerUid(u.id);
        void useWinterArc.getState().loadUserData(
          u.id,
          u.email ?? "",
          (u.user_metadata?.name as string) ?? ""
        );
      }
    });
    const { data: sub } = sb.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setHasSeenIntro(true);
        const u = session.user;
        setAll("authenticated", u);
        useWinterArc.getState().setOwnerUid(u.id);
        void useWinterArc.getState().loadUserData(
          u.id,
          u.email ?? "",
          (u.user_metadata?.name as string) ?? ""
        );
        // OAuth redirect resume first (replay fns don't survive redirects),
        // then the in-memory parked action.
        const stashed = takeStashed();
        if (stashed) {
          router.push(stashed.route);
          window.setTimeout(() => emitAuthResume(stashed), 600);
          return;
        }
        const p: PendingAction | null = takePending();
        if (p) {
          router.push(p.route);
          if (p.replay) window.setTimeout(() => p.replay?.(), 450);
        }
      } else {
        setAll("unauthenticated", null);
        const st = useWinterArc.getState();
        // Returning session user → wipe to demo (privacy).
        // Fresh visitor with pre-seeded content (E2E/showcase) → leave it.
        // Fresh visitor with nothing → demo bundle.
        if (st.ownerUid !== null || st.trackers.length === 0) {
          st.setOwnerUid(null);
          st.loadDemo();
        }
      }
    });
    return () => sub.subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signUp: AuthCtx["signUp"] = useCallback(async (name, email, password) => {
    if (password.length < 6) {
      return { ok: false, message: "Password does not meet requirements (6+ characters)." };
    }
    try {
      const { data, error } = await supabase().auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { name: name.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) return { ok: false, message: friendly(error, "Couldn't create the account. Try again.") };
      if (!data.session) return { ok: true, needsVerify: true };
      return { ok: true };
    } catch {
      return { ok: false, message: "Network error. Try again." };
    }
  }, []);

  const signIn: AuthCtx["signIn"] = useCallback(async (email, password) => {
    try {
      const { error } = await supabase().auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) return { ok: false, message: friendly(error, "Couldn't sign in. Try again.") };
      return { ok: true };
    } catch {
      return { ok: false, message: "Network error. Try again." };
    }
  }, []);

  const signInGoogle: AuthCtx["signInGoogle"] = useCallback(async () => {
    try {
      const p = peekPending();
      // stash serializable context — memory is wiped by the OAuth redirect
      if (p) stashPending(p);
      const next = p?.route ?? "/";
      const { error } = await supabase().auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (error) return { ok: false, message: "Google sign-in failed. Try again." };
      return { ok: true };
    } catch {
      return { ok: false, message: "Google sign-in failed. Try again." };
    }
  }, []);

  const resetPassword: AuthCtx["resetPassword"] = useCallback(async (email) => {
    try {
      const { error } = await supabase().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) return { ok: false, message: friendly(error, "Couldn't send the reset email.") };
      return { ok: true };
    } catch {
      return { ok: false, message: "Network error. Try again." };
    }
  }, []);

  const signOut: AuthCtx["signOut"] = useCallback(async () => {
    try {
      if (typeof window !== "undefined") {
        window.sessionStorage.removeItem("wa-pending-action");
        window.localStorage.removeItem("wa-guest");
      }
      setHasSeenIntro(false);
      const st = useWinterArc.getState();
      st.setOwnerUid(null);
      st.loadDemo();
    } catch {
      /* ignore */
    }
    await supabase().auth.signOut();
    router.push("/");
  }, [router]);

  return (
    <Ctx.Provider value={{ status, user, signUp, signIn, signInGoogle, resetPassword, signOut }}>
      {children}
      <AuthModal />
    </Ctx.Provider>
  );
}
