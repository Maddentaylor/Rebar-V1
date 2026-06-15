import type { ReactNode } from "react";
import { motion } from "framer-motion";

type MachineCardMediaProps = {
  src: string;
  alt: string;
  className?: string;
  children?: ReactNode;
  /** Fills fixed card slot with crop + trims soft vignette (>1 hides edges inside same box). */
  lineCoverZoom?: number;
  /** CSS object-position when `lineCoverZoom` is set (default `center`). */
  lineCoverObjectPosition?: string;
  /** Partner lockup on white — no gray cyclorama. */
  variant?: "photo" | "logo";
  /** Scales logo contain inside the frame (trim empty margins without cropping the lockup). */
  lineCardLogoScale?: number;
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
  lineCoverObjectPosition = "center",
  variant = "photo",
  lineCardLogoScale,
}: MachineCardMediaProps) {
  const isLogo = variant === "logo";
  const logoScale = isLogo ? (lineCardLogoScale ?? 1) : 1;
  const hoverScale = isLogo
    ? Math.min(logoScale * 1.02, 1.28)
    : lineCoverZoom != null
      ? Math.min(lineCoverZoom * 1.04, 1.35)
      : 1.05;
  const baseScale = isLogo ? logoScale : (lineCoverZoom ?? 1);

  return (
    <div className={`relative w-full overflow-hidden ${className}`}>
      {/* Studio field for photos; logo cards use flat white */}
      <div
        className={`absolute inset-0 z-0 ${
          isLogo ? "bg-white" : lineCoverZoom != null ? "bg-[#1a1c20]" : "bg-[#d7d9de]"
        }`}
        aria-hidden
      />
      {lineCoverZoom == null && !isLogo && (
        <>
          <div
            className="absolute inset-0 z-0 bg-gradient-to-b from-[#eef0f5] via-[#e1e4ea] to-[#c9cdd6]"
            aria-hidden
          />
          <div
            className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_72%_at_50%_-8%,rgba(255,255,255,0.75)_0%,transparent_56%)]"
            aria-hidden
          />
        </>
      )}

      <div
        className={
          lineCoverZoom != null
            ? "relative z-10 h-full min-h-0 w-full overflow-hidden"
            : isLogo
              ? "relative z-10 flex h-full min-h-0 w-full items-center justify-center overflow-hidden bg-white px-3 py-4"
              : "relative z-10 flex h-full min-h-0 w-full items-center justify-center overflow-hidden p-3 sm:p-4"
        }
      >
        <motion.img
          src={src}
          alt={alt}
          className={
            lineCoverZoom != null
              ? "h-full w-full object-cover [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.14))]"
              : isLogo
                ? "max-h-full max-w-full object-contain object-center"
                : "max-h-full max-w-full object-contain object-center [filter:drop-shadow(0_16px_28px_rgba(0,0,0,0.14))]"
          }
          style={
            lineCoverZoom != null
              ? {
                  transformOrigin: "center center",
                  objectPosition: lineCoverObjectPosition,
                }
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
