import { useEffect, useState } from "react";
import { apiUrl, authHeaders } from "@/lib/apiClient";

const SESSION_KEY = "rms_admin_user";
const TOKEN_KEY = "rms_admin_token";
const CHANGE_EVENT = "rms-admin-auth-changed";

/** Simple admin login — username rebar (or rebarlegacy), password Madden19! */
export const ADMIN_USERNAME = "rebar";
export const ADMIN_PASSWORD = "Madden19!";

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

export async function login(username: string, password: string): Promise<boolean> {
  // Localhost: never call remote API — avoids Vercel/env mismatches during dev.
  if (isLocalHost() && simpleLoginAccepted(username, password)) {
    saveSession(ADMIN_USERNAME);
    return true;
  }

  if (simpleLoginAccepted(username, password)) {
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
          return true;
        }
      }

      // API unavailable or misconfigured — still allow the simple password locally.
      if (import.meta.env.DEV || isLocalHost()) {
        saveSession(ADMIN_USERNAME);
        return true;
      }
    } catch {
      if (import.meta.env.DEV || isLocalHost()) {
        saveSession(ADMIN_USERNAME);
        return true;
      }
    }
  }

  return false;
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
  login: (u: string, p: string) => Promise<boolean>;
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
