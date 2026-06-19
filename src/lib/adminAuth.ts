import { useEffect, useState } from "react";
import { apiUrl, authHeaders } from "@/lib/apiClient";

const SESSION_KEY = "rms_admin_user";
const TOKEN_KEY = "rms_admin_token";
const CHANGE_EVENT = "rms-admin-auth-changed";

/** Simple admin login — username rebar (or rebarlegacy), password Madden19! */
export const ADMIN_USERNAME = "rebar";
export const ADMIN_PASSWORD = "Madden19!";

export type LoginResult =
  | { ok: true }
  | { ok: false; error: string };

function isLocalHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname;
  return host === "localhost" || host === "127.0.0.1";
}

function simpleLoginAccepted(username: string, password: string): boolean {
  const user = username.trim().toLowerCase();
  const okUser = user === ADMIN_USERNAME || user === "rebarlegacy";
  const okPass = password.toLowerCase() === ADMIN_PASSWORD.toLowerCase();
  return okUser && okPass;
}

function saveSession(username: string, token = "dev-local-session"): void {
  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.sessionStorage.setItem(SESSION_KEY, username);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function offlineSession(): LoginResult {
  saveSession(ADMIN_USERNAME);
  return { ok: true };
}

export async function login(username: string, password: string): Promise<LoginResult> {
  if (!simpleLoginAccepted(username, password)) {
    return { ok: false, error: "Incorrect username or password." };
  }

  // Localhost: skip API entirely.
  if (isLocalHost()) {
    return offlineSession();
  }

  try {
    const res = await fetch(apiUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = (await res.json()) as { token?: string; username?: string };
      if (data.token && data.username) {
        saveSession(data.username, data.token);
        return { ok: true };
      }
      return { ok: false, error: "Login response was invalid. Try again." };
    }

    let message = "Could not sign in. Try again in a moment.";
    try {
      const data = (await res.json()) as { error?: string };
      if (data.error) message = data.error;
    } catch {
      /* ignore */
    }

    if (res.status === 401) {
      return { ok: false, error: "Incorrect username or password." };
    }

    // API misconfigured or down — still allow staff in with local session.
    console.warn("admin login API failed:", res.status, message);
    return offlineSession();
  } catch (err) {
    console.warn("admin login API unreachable:", err);
    return offlineSession();
  }
}

export function logout(): void {
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCurrentAdmin(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_KEY);
}

export function useAdminAuth(): {
  user: string | null;
  login: (u: string, p: string) => Promise<LoginResult>;
  logout: () => void;
} {
  const [user, setUser] = useState<string | null>(() => getCurrentAdmin());

  useEffect(() => {
    const refresh = () => setUser(getCurrentAdmin());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return { user, login, logout };
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const res = await fetch(apiUrl("/api/admin/change-password"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (res.status === 401) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Current password is incorrect.");
  }

  const data = (await res.json()) as { error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Could not update password.");
  }
}

/** For authenticated admin API calls. */
export { authHeaders };
