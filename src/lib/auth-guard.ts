/**
 * Single auth guard for every protected action (spec §9).
 *
 *   requireAuth({ route: "/", label: "Save Water", replay: doSave });
 *
 * Authed → replay() runs immediately. Otherwise the action is parked and
 * the auth modal opens; after login the app returns to `route` and replays.
 */

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export interface PendingAction {
  route: string;
  label: string;
  /** in-memory continuation (email flow — no page redirect) */
  replay?: () => void;
  /** serializable context (survives the Google OAuth redirect via sessionStorage) */
  payload?: Record<string, string | number>;
}

let pending: PendingAction | null = null;
let statusGetter: () => AuthStatus = () => "loading";
const modalListeners = new Set<(a: PendingAction | null) => void>();
const resumeListeners = new Set<(a: PendingAction) => void>();

export function setStatusGetter(fn: () => AuthStatus): void {
  statusGetter = fn;
}

export function subscribeAuthModal(cb: (a: PendingAction | null) => void): () => void {
  modalListeners.add(cb);
  return () => {
    modalListeners.delete(cb);
  };
}

export function peekPending(): PendingAction | null {
  return pending;
}

export function requireAuth(action: PendingAction): boolean {
  // E2E hook (showcase filming + local testing): explicit localStorage flag
  // bypasses the modal and runs the action directly. Never set in production.
  try {
    if (typeof window !== "undefined" && window.localStorage.getItem("wa-e2e") === "1") {
      action.replay?.();
      return true;
    }
  } catch {
    /* storage blocked — fall through to normal flow */
  }
  if (statusGetter() === "authenticated") {
    action.replay?.();
    return true;
  }
  pending = action;
  modalListeners.forEach((cb) => cb(action));
  return false;
}

/** Consumed once after a successful sign in / sign up. */
export function takePending(): PendingAction | null {
  const p = pending;
  pending = null;
  modalListeners.forEach((cb) => cb(null));
  return p;
}

/** Pages subscribe to reopen the exact sheet after an OAuth redirect resume. */
export function subscribeAuthResume(cb: (a: PendingAction) => void): () => void {
  resumeListeners.add(cb);
  return () => {
    resumeListeners.delete(cb);
  };
}

export function emitAuthResume(action: PendingAction): void {
  resumeListeners.forEach((cb) => cb(action));
}

const STORAGE_KEY = "wa-pending-action";

export function stashPending(action: PendingAction): void {
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ route: action.route, label: action.label, payload: action.payload ?? {} })
    );
  } catch {
    /* storage blocked — route-only resume via ?next= */
  }
}

export function takeStashed(): PendingAction | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    window.sessionStorage.removeItem(STORAGE_KEY);
    const p = JSON.parse(raw) as { route: string; label: string; payload: Record<string, string | number> };
    if (!p || typeof p.route !== "string") return null;
    return { route: p.route, label: p.label ?? "Continue", payload: p.payload ?? {} };
  } catch {
    return null;
  }
}
