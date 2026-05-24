import type { ReactNode } from "react";
import { motion } from "framer-motion";

type MachineCardMediaProps = {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  /** Fills fixed card slot with crop + trims soft vignette (>1 hides edges inside same box). */
  lineCoverZoom?: number;
};

/**
 * Lineup thumbnail used for every machine card: fixed outer height (pass h-72 / h-60),
 * light cyclorama field, and object-contain. Optional `lineCoverZoom` switches to crop + scale
 * for full-bleed photos with soft baked-in framing.
 */
export function MachineCardMedia({
  src,
  alt,
  className = "",
  children,
  lineCoverZoom,
}: MachineCardMediaProps) {
  const hoverScale =
    lineCoverZoom != null ? Math.min(lineCoverZoom * 1.04, 1.35) : 1.05;
  const baseScale = lineCoverZoom ?? 1;

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Studio field — stays behind the photo so PNG alpha reveals it */}
      <div className="absolute inset-0 z-0 bg-[#d7d9de]" aria-hidden />
      <div
        className="absolute inset-0 z-0 bg-gradient-to-b from-[#eef0f5] via-[#e1e4ea] to-[#c9cdd6]"
        aria-hidden
      />
      <div
        className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_72%_at_50%_-8%,rgba(255,255,255,0.75)_0%,transparent_56%)]"
        aria-hidden
      />

      <div className="relative z-10 flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-3 sm:p-4">
        <motion.img
          src={src}
          alt={alt}
          className={
            lineCoverZoom != null
              ? "h-full w-full object-cover object-center [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.14))]"
              : "max-h-full max-w-full object-contain object-center [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.14))]"
          }
          style={
            lineCoverZoom != null
              ? { transformOrigin: "center center" }
              : undefined
          }
          initial={{ scale: baseScale }}
          whileHover={{ scale: hoverScale }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      {/* Hairline only — no full-bleed tint (that was painting over transparent pixels) */}
      <div className="pointer-events-none absolute inset-0 z-20 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.07)]" aria-hidden />

      {children}
    </div>
  );
}
