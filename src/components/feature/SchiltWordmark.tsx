/**
 * Official Schilt Engineering lockup — raster asset with transparent background
 * (`public/partners/schilt-wordmark.png`). Update that file to change the artwork.
 */
export const SCHILT_LOCKUP_SRC = "/partners/schilt-wordmark.png";

type SchiltWordmarkProps = {
  className?: string;
  /** Slight brightening + shadow when sitting on royal-blue fills */
  elevateOnBlue?: boolean;
};

export default function SchiltWordmark({ className = "", elevateOnBlue = false }: SchiltWordmarkProps) {
  return (
    <img
      src={SCHILT_LOCKUP_SRC}
      alt="Schilt Engineering North America"
      className={
        `max-h-none w-auto object-contain object-left ` +
        (elevateOnBlue
          ? `brightness-110 contrast-105 drop-shadow-[0_2px_14px_rgba(0,0,0,0.3)]`
          : `brightness-105 drop-shadow-[0_2px_20px_rgba(0,0,0,0.55)]`) +
        ` ${className}`
      }
      loading="lazy"
      decoding="async"
    />
  );
}
