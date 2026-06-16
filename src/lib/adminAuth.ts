import { useEffect, useState } from "react";
import { apiUrl, authHeaders } from "@/lib/apiClient";

const SESSION_KEY = "rms_admin_user";
const TOKEN_KEY = "rms_admin_token";
const CHANGE_EVENT = "rms-admin-auth-changed";

export async function login(username: string, password: string): Promise<boolean> {
  try {
    const res = await fetch(apiUrl("/api/admin/login"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) return false;

    const data = (await res.json()) as { token?: string; username?: string };
    if (!data.token || !data.username) return false;

    window.sessionStorage.setItem(TOKEN_KEY, data.token);
    window.sessionStorage.setItem(SESSION_KEY, data.username);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    return true;
  } catch {
    return false;
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

/** For authenticated admin API calls. */
export { authHeaders };
