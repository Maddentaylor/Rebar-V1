import { useCallback, useEffect, useState } from "react";
import type { PartItem } from "@/mocks/parts";
import { apiUrl, authHeaders } from "@/lib/apiClient";

const CHANGE_EVENT = "rms-custom-parts-changed";

export interface CustomPart extends PartItem {
  createdAt: number;
}

function notifyChange(): void {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export async function fetchCustomParts(): Promise<CustomPart[]> {
  const res = await fetch(apiUrl("/api/custom-parts"));
  if (!res.ok) {
    throw new Error("Could not load uploaded parts.");
  }
  const data = (await res.json()) as { parts?: CustomPart[] };
  return Array.isArray(data.parts) ? data.parts : [];
}

export async function addCustomPart(
  part: Omit<CustomPart, "createdAt">
): Promise<CustomPart> {
  const res = await fetch(apiUrl("/api/custom-parts"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({
      name: part.name,
      partNumber: part.partNumber,
      partsTypeId: part.partsTypeId,
      category: part.category,
      image: part.image,
      description: part.description,
    }),
  });

  if (res.status === 401) {
    throw new Error("Session expired. Sign in again.");
  }

  const data = (await res.json()) as { part?: CustomPart; error?: string };
  if (!res.ok) {
    throw new Error(data.error ?? "Could not save part.");
  }
  if (!data.part) {
    throw new Error("Could not save part.");
  }

  notifyChange();
  return data.part;
}

export async function deleteCustomPart(id: string): Promise<void> {
  const res = await fetch(apiUrl(`/api/custom-parts?id=${encodeURIComponent(id)}`), {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (res.status === 401) {
    throw new Error("Session expired. Sign in again.");
  }

  if (!res.ok) {
    const data = (await res.json()) as { error?: string };
    throw new Error(data.error ?? "Could not delete part.");
  }

  notifyChange();
}

export function useCustomParts(): {
  parts: CustomPart[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
} {
  const [parts, setParts] = useState<CustomPart[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setParts(await fetchCustomParts());
    } catch (err) {
      setParts([]);
      setError(err instanceof Error ? err.message : "Could not load parts.");
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

  return { parts, loading, error, refresh: load };
}

/**
 * Downscale + compress an uploaded image before sending to the server.
 */
export function fileToCompressedDataUrl(
  file: File,
  maxDim = 1024,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Could not read the image file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("That file is not a valid image."));
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const w = Math.max(1, Math.round(img.width * scale));
        const h = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Image processing is not supported in this browser."));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
