import { useCallback, useEffect, useState } from "react";
import { apiUrl, authHeaders, getAdminToken } from "@/lib/apiClient";

const LOCAL_KEY = "rms_hidden_parts_v1";
const CHANGE_EVENT = "rms-hidden-parts-changed";

function readLocalHidden(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : []);
  } catch {
    return new Set();
  }
}

function writeLocalHidden(ids: Set<string>): void {
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify([...ids]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function notifyChange(): void {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Use browser storage when there is no working authenticated API (local dev or offline session). */
function usesOfflineHiddenStore(): boolean {
  if (import.meta.env.DEV && !(import.meta.env.VITE_QUOTE_API_URL ?? "").trim()) {
    return true;
  }
  return getAdminToken() === "dev-local-session";
}

export async function fetchHiddenPartIds(): Promise<Set<string>> {
  if (usesOfflineHiddenStore()) return readLocalHidden();

  try {
    const res = await fetch(apiUrl("/api/hidden-parts"));
    if (res.ok) {
      const data = (await res.json()) as { ids?: string[] };
      return new Set(Array.isArray(data.ids) ? data.ids : []);
    }
  } catch {
    /* fall through */
  }
  return readLocalHidden();
}

export async function hideCatalogPart(id: string): Promise<void> {
  if (usesOfflineHiddenStore()) {
    const next = readLocalHidden();
    next.add(id);
    writeLocalHidden(next);
    return;
  }

  try {
    const res = await fetch(apiUrl("/api/hidden-parts"), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
      },
      body: JSON.stringify({ id }),
    });
    if (res.status === 401) throw new Error("Session expired. Sign in again.");
    if (res.ok) {
      notifyChange();
      return;
    }
  } catch (err) {
    if (err instanceof Error && err.message.includes("Session expired")) throw err;
  }

  const next = readLocalHidden();
  next.add(id);
  writeLocalHidden(next);
}

export async function restoreCatalogPart(id: string): Promise<void> {
  if (usesOfflineHiddenStore()) {
    const next = readLocalHidden();
    next.delete(id);
    writeLocalHidden(next);
    return;
  }

  try {
    const res = await fetch(apiUrl(`/api/hidden-parts?id=${encodeURIComponent(id)}`), {
      method: "DELETE",
      headers: authHeaders(),
    });
    if (res.ok) {
      notifyChange();
      return;
    }
  } catch {
    /* local fallback below */
  }

  const next = readLocalHidden();
  next.delete(id);
  writeLocalHidden(next);
}

export function isCustomPartId(id: string): boolean {
  return id.startsWith("custom-");
}

export function useHiddenPartIds(): {
  hiddenIds: Set<string>;
  loading: boolean;
  refresh: () => void;
} {
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(() => new Set());
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setHiddenIds(await fetchHiddenPartIds());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const onChange = () => void load();
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CHANGE_EVENT, onChange);
  }, [load]);

  return { hiddenIds, loading, refresh: load };
}
