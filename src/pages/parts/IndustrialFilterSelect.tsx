import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type IndustrialFilterOption = { id: string; label: string };

type IndustrialFilterSelectProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: IndustrialFilterOption[];
  disabled?: boolean;
};

export function IndustrialFilterSelect({
  label,
  value,
  onChange,
  options,
  disabled,
}: IndustrialFilterSelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.id === value);
  const displayLabel = selected?.label ?? "";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const pick = (id: string) => {
    onChange(id);
    setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={
        /* Open menu must stack above sibling filters (grid column order) and stay below fixed nav (z-50). */
        open ? "relative z-40" : "relative z-10"
      }
    >
      <p className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.3em] mb-2.5">
        {label}
      </p>
      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        onClick={() => !disabled && setOpen((o) => !o)}
        className={[
          "group flex w-full items-center justify-between gap-3 rounded-2xl border bg-canvas-raised px-4 py-3.5 text-left",
          "text-sm font-semibold text-ink shadow-soft transition-all duration-300 ease-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red/20 focus-visible:ring-offset-2 focus-visible:ring-offset-canvas",
          "disabled:cursor-not-allowed disabled:opacity-45",
          open
            ? "border-brand-red/35 ring-2 ring-brand-red/10 shadow-card"
            : "border-canvas-edge hover:border-brand-red/22 hover:shadow-md",
        ].join(" ")}
      >
        <span className={`min-w-0 flex-1 truncate ${!value ? "text-ink-subtle font-medium" : ""}`}>
          {displayLabel}
        </span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-canvas-sunken/80 text-ink-muted transition-colors duration-300 group-hover:text-brand-red group-hover:bg-brand-red/6"
          aria-hidden
        >
          <i className="ri-arrow-down-s-line text-lg leading-none"></i>
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listId}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 max-h-64 min-w-0 overflow-x-hidden overflow-y-auto rounded-2xl border border-canvas-edge bg-canvas-raised/95 py-1.5 shadow-card backdrop-blur-xl"
          >
            {options.map((o) => {
              const isSelected = value === o.id;
              return (
                <li key={o.id || "__empty"} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => pick(o.id)}
                    className={[
                      "flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium transition-colors duration-200",
                      "rounded-xl mx-1.5 cursor-pointer",
                      isSelected
                        ? "bg-brand-red/10 text-brand-red"
                        : "text-ink-muted hover:bg-canvas-sunken hover:text-ink",
                    ].join(" ")}
                  >
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200 ${
                        isSelected
                          ? "border-brand-red bg-brand-red text-white"
                          : "border-canvas-edge bg-canvas-raised"
                      }`}
                    >
                      {isSelected && <i className="ri-check-line text-[10px] leading-none"></i>}
                    </span>
                    <span className="min-w-0 flex-1 leading-snug">{o.label}</span>
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
