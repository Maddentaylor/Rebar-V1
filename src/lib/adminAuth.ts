import { useEffect, useState } from "react";

/**
 * Simple admin authentication.
 *
 * SECURITY NOTE: This runs entirely in the browser, so the accounts below are
 * visible to anyone who inspects the site's JavaScript. It is a convenience gate
 * to keep the admin UI out of casual view — it is NOT real security. Before using
 * this to protect anything sensitive, move the check to a server endpoint
 * (e.g. an /api/admin/login Vercel function validating a hashed password and
 * issuing an httpOnly session cookie). See notes in src/pages/admin/page.tsx.
 *
 * To change/add accounts, edit ADMIN_ACCOUNTS below, or set VITE_ADMIN_PASSWORD
 * in your environment to override the default admin password at build time.
 */

export interface AdminAccount {
  username: string;
  password: string;
}

export const ADMIN_ACCOUNTS: AdminAccount[] = [
  {
    username: "admin",
    password: import.meta.env.VITE_ADMIN_PASSWORD || "rms-admin",
  },
];

const SESSION_KEY = "rms_admin_user";
const CHANGE_EVENT = "rms-admin-auth-changed";

export function login(username: string, password: string): boolean {
  const match = ADMIN_ACCOUNTS.find(
    (a) => a.username.toLowerCase() === username.trim().toLowerCase() && a.password === password
  );
  if (!match) return false;
  window.sessionStorage.setItem(SESSION_KEY, match.username);
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return true;
}

export function logout(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCurrentAdmin(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(SESSION_KEY);
}

/** React hook exposing the current admin user and reacting to login/logout. */
export function useAdminAuth(): {
  user: string | null;
  login: (u: string, p: string) => boolean;
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
