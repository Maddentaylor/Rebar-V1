/** Base URL for API calls. Same-origin in production; proxied in dev when VITE_QUOTE_API_URL is set. */
export function apiUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (import.meta.env.DEV) {
    return normalized;
  }
  const base = (import.meta.env.VITE_QUOTE_API_URL ?? "").replace(/\/$/, "");
  return `${base}${normalized}`;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem("rms_admin_token");
}

export function authHeaders(): HeadersInit {
  const token = getAdminToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}
