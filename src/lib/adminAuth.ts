import { useEffect, useState } from "react";
import { apiUrl, authHeaders } from "@/lib/apiClient";

const SESSION_KEY = "rms_admin_user";
const TOKEN_KEY = "rms_admin_token";
const CHANGE_EVENT = "rms-admin-auth-changed";

/** Matches server defaults — used for local dev when /api is not running. */
const LOCAL_DEV_USERNAME = "rebar";
const LOCAL_DEV_PASSWORD = "Madden19!";

function tryLocalDevLogin(username: string, password: string): boolean {
  if (!import.meta.env.DEV) return false;
  if (
    username.trim().toLowerCase() === LOCAL_DEV_USERNAME.toLowerCase() &&
    password.toLowerCase() === LOCAL_DEV_PASSWORD.toLowerCase()
  ) {
    window.sessionStorage.setItem(TOKEN_KEY, "dev-local-session");
    window.sessionStorage.setItem(SESSION_KEY, LOCAL_DEV_USERNAME);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  }
  return false;
}

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const data = (await res.json()) as { token?: string; username?: string };
      if (!data.token || !data.username) return false;

      window.sessionStorage.setItem(TOKEN_KEY, data.token);
      window.sessionStorage.setItem(SESSION_KEY, data.username);
      window.dispatchEvent(new Event(CHANGE_EVENT));
      return true;
    }

    // Wrong credentials from live API
    if (res.status === 401) return false;

    // API missing or not configured — allow local dev login on localhost
    return tryLocalDevLogin(username, password);
  } catch {
    return tryLocalDevLogin(username, password);
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
