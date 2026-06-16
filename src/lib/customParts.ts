import { useEffect, useState } from "react";
import type { PartItem } from "@/mocks/parts";

/**
 * Admin-added parts.
 *
 * NOTE: This is a client-side store backed by the browser's localStorage. It lets
 * an admin add parts (with an uploaded image) that appear instantly on the Parts
 * catalog — without a redeploy. Because it lives in the browser, parts added here
 * are visible only in the browser/device they were created in. To make uploads
 * permanent and shared across all visitors, swap this store for API calls backed
 * by a database + blob storage (see notes in src/pages/admin/page.tsx).
 */

const STORAGE_KEY = "rms_custom_parts_v1";
const CHANGE_EVENT = "rms-custom-parts-changed";

export interface CustomPart extends PartItem {
  /** Epoch ms — used for sorting newest-first in the admin list. */
  createdAt: number;
}

function safeRead(): CustomPart[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (p): p is CustomPart =>
        p && typeof p.id === "string" && typeof p.partsTypeId === "string"
    );
  } catch {
    return [];
  }
}

function safeWrite(list: CustomPart[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function getCustomParts(): CustomPart[] {
  return safeRead().sort((a, b) => b.createdAt - a.createdAt);
}

export function addCustomPart(part: Omit<CustomPart, "createdAt">): void {
  const list = safeRead();
  list.push({ ...part, createdAt: Date.now() });
  safeWrite(list);
}

export function deleteCustomPart(id: string): void {
  safeWrite(safeRead().filter((p) => p.id !== id));
}

/** React hook that stays in sync with the store across tabs and components. */
export function useCustomParts(): CustomPart[] {
  const [items, setItems] = useState<CustomPart[]>(() => getCustomParts());

  useEffect(() => {
    const refresh = () => setItems(getCustomParts());
    window.addEventListener(CHANGE_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CHANGE_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return items;
}

/**
 * Downscale + compress an uploaded image to a data URL so it fits comfortably in
 * localStorage (which is ~5MB total). Returns a JPEG/PNG data URL string.
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
        // PNG keeps transparency; everything else compresses to JPEG.
        const isPng = file.type === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
