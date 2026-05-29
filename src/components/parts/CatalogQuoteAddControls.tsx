import { useState, useEffect } from "react";
import Magnetic from "@/components/motion/Magnetic";
import { usePartsCart } from "@/context/PartsCartContext";
import type { PartItem } from "@/mocks/parts";

const clampPartQty = (n: number) =>
  Math.max(1, Math.min(999, Math.floor(Number.isFinite(n) ? n : 1)));

interface CatalogQuoteAddControlsProps {
  part: PartItem;
  /** Fits parts tables on machine detail pages. */
  compact?: boolean;
}

export default function CatalogQuoteAddControls({ part, compact }: CatalogQuoteAddControlsProps) {
  const { addPart } = usePartsCart();
  const [qty, setQty] = useState(1);
  const [flashQty, setFlashQty] = useState<number | null>(null);

  useEffect(() => {
    if (flashQty === null) return;
    const t = window.setTimeout(() => setFlashQty(null), 2200);
    return () => window.clearTimeout(t);
  }, [flashQty]);

  const h = compact ? "h-9" : "h-11";
  const textSize = compact ? "text-[10px] tracking-[0.14em]" : "text-[11px] tracking-[0.18em]";
  const magStrength = compact ? 0.12 : 0.2;

  return (
    <div className={`flex flex-col gap-2 ${compact ? "min-w-[8.75rem]" : ""}`}>
      <div className="flex items-stretch gap-2">
        <div
          className={`flex items-center rounded-xl border border-canvas-edge bg-canvas overflow-hidden shrink-0 shadow-sm ${compact ? "h-9" : "h-11"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={() => setQty((q) => clampPartQty(q - 1))}
            className={`w-9 h-full flex items-center justify-center text-ink hover:bg-canvas-sunken transition-colors cursor-pointer`}
            aria-label="Decrease quantity"
          >
            <i className={`ri-subtract-line ${compact ? "text-base" : "text-lg"}`} />
          </button>
          <label htmlFor={`qty-quote-${part.id}`} className="sr-only">
            Quantity for {part.name}
          </label>
          <input
            id={`qty-quote-${part.id}`}
            type="number"
            min={1}
            max={999}
            value={qty}
            onChange={(e) =>
              setQty(clampPartQty(parseInt(e.target.value, 10) || 1))
            }
            className="w-9 text-center text-xs font-bold tabular-nums bg-transparent border-x border-canvas-edge h-full outline-none focus:bg-canvas-raised [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            onClick={() => setQty((q) => clampPartQty(q + 1))}
            className={`w-9 h-full flex items-center justify-center text-ink hover:bg-canvas-sunken transition-colors cursor-pointer`}
            aria-label="Increase quantity"
          >
            <i className={`ri-add-line ${compact ? "text-base" : "text-lg"}`} />
          </button>
        </div>
        <Magnetic strength={magStrength} range={compact ? 4 : 6}>
          <button
            type="button"
            onClick={() => {
              addPart(part, qty);
              setFlashQty(qty);
              setQty(1);
            }}
            className={`group/btn flex-1 min-w-0 ${h} px-2 sm:px-3 font-bold uppercase ${textSize} rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap inline-flex items-center justify-center gap-1.5 sm:gap-2 ${
              flashQty !== null
                ? "bg-canvas-sunken border border-canvas-edge text-ink"
                : "bg-brand-red text-white hover:bg-brand-glow hover:shadow-glow"
            }`}
          >
            {flashQty !== null ? (
              <>
                <i className={`ri-check-line shrink-0 ${compact ? "text-base" : "text-lg"}`} />
                <span className="truncate">Added ×{flashQty}</span>
              </>
            ) : (
              <>
                <span className="truncate">Add to cart</span>
                <i
                  className={`ri-shopping-cart-2-line transition-transform duration-300 group-hover/btn:translate-x-0.5 shrink-0 ${compact ? "text-sm" : "text-base"}`}
                />
              </>
            )}
          </button>
        </Magnetic>
      </div>
    </div>
  );
}
