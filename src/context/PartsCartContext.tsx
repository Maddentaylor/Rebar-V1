import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { PartItem } from "@/mocks/parts";

const STORAGE_KEY = "rms-parts-quote-cart";

export interface CartLine {
  part: PartItem;
  quantity: number;
}

interface PartsCartContextValue {
  lines: CartLine[];
  addPart: (part: PartItem, quantity?: number) => void;
  removeLine: (partId: string) => void;
  setLineQuantity: (partId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  lineCount: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

const PartsCartContext = createContext<PartsCartContextValue | null>(null);

function loadLines(): CartLine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row: unknown) =>
        row &&
        typeof row === "object" &&
        "part" in row &&
        "quantity" in row &&
        typeof (row as CartLine).quantity === "number" &&
        (row as CartLine).quantity > 0
    ) as CartLine[];
  } catch {
    return [];
  }
}

function readDocumentScrollY(): number {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  return lenis ? lenis.scroll : window.scrollY;
}

function restoreDocumentScrollY(y: number): void {
  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
  if (lenis) lenis.scrollTo(y, { immediate: true });
  else window.scrollTo(0, y);
}

export function PartsCartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>(() =>
    typeof window === "undefined" ? [] : loadLines()
  );
  const [isOpen, setIsOpen] = useState(false);
  const savedScrollYRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignore quota */
    }
  }, [lines]);

  const addPart = useCallback((part: PartItem, quantity = 1) => {
    const q = Math.max(1, Math.min(999, Math.floor(quantity)));
    setLines((prev) => {
      const idx = prev.findIndex((l) => l.part.id === part.id);
      if (idx === -1) return [...prev, { part, quantity: q }];
      const next = [...prev];
      next[idx] = {
        ...next[idx],
        quantity: Math.min(999, next[idx].quantity + q),
      };
      return next;
    });
  }, []);

  const removeLine = useCallback((partId: string) => {
    setLines((prev) => prev.filter((l) => l.part.id !== partId));
  }, []);

  const setLineQuantity = useCallback((partId: string, quantity: number) => {
    const q = Math.floor(quantity);
    if (q < 1) {
      setLines((prev) => prev.filter((l) => l.part.id !== partId));
      return;
    }
    setLines((prev) =>
      prev.map((l) =>
        l.part.id === partId ? { ...l, quantity: Math.min(999, q) } : l
      )
    );
  }, []);

  const clearCart = useCallback(() => setLines([]), []);

  const itemCount = useMemo(
    () => lines.reduce((n, l) => n + l.quantity, 0),
    [lines]
  );
  const lineCount = lines.length;

  const openCart = useCallback(() => {
    savedScrollYRef.current = readDocumentScrollY();
    setIsOpen(true);
  }, []);

  const closeCart = useCallback(() => {
    setIsOpen(false);
    const y = savedScrollYRef.current;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => restoreDocumentScrollY(y));
    });
  }, []);

  const toggleCart = useCallback(() => {
    setIsOpen((open) => {
      if (open) {
        const y = savedScrollYRef.current;
        requestAnimationFrame(() => {
          requestAnimationFrame(() => restoreDocumentScrollY(y));
        });
      } else {
        savedScrollYRef.current = readDocumentScrollY();
      }
      return !open;
    });
  }, []);

  const value = useMemo<PartsCartContextValue>(
    () => ({
      lines,
      addPart,
      removeLine,
      setLineQuantity,
      clearCart,
      itemCount,
      lineCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    }),
    [
      lines,
      addPart,
      removeLine,
      setLineQuantity,
      clearCart,
      itemCount,
      lineCount,
      isOpen,
      openCart,
      closeCart,
      toggleCart,
    ]
  );

  return (
    <PartsCartContext.Provider value={value}>{children}</PartsCartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components -- hook intentionally colocated with PartsCartProvider
export function usePartsCart() {
  const ctx = useContext(PartsCartContext);
  if (!ctx) {
    throw new Error("usePartsCart must be used within PartsCartProvider");
  }
  return ctx;
}
