import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SubProductImageGalleryProps = {
  images: string[];
  productName: string;
  /** `default` = flat neutral stage for full-color photos · `studio` = soft radial for cut-out / renders */
  presentation?: "default" | "studio";
  /** When present in `images`, that slide opens first (e.g. same as listing cover). */
  leadImageSrc?: string;
  /** Omit the eyebrow line above the viewer when the page already has a headline. */
  hideIntroLine?: boolean;
  className?: string;
};

/**
 * Large preview + horizontally scrollable thumbnail strip with snap scrolling.
 */
export function SubProductImageGallery({
  images,
  productName,
  presentation = "default",
  leadImageSrc,
  hideIntroLine = false,
  className = "",
}: SubProductImageGalleryProps) {
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const safe = images.filter(Boolean);
  const leadIx =
    leadImageSrc && safe.length > 0 ? safe.indexOf(leadImageSrc) : -1;
  const initialActive = leadIx >= 0 ? leadIx : 0;

  const [active, setActive] = useState(initialActive);

  useEffect(() => {
    const s = images.filter(Boolean);
    const nextLead =
      leadImageSrc && s.length > 0 ? s.indexOf(leadImageSrc) : -1;
    setActive(nextLead >= 0 ? nextLead : 0);
  }, [images, leadImageSrc]);

  useEffect(() => {
    thumbRefs.current[active]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [active]);

  if (safe.length === 0) return null;

  const mainSrc = safe[active] ?? safe[0];
  const isStudio = presentation === "studio";

  const ambient =
    "pointer-events-none absolute inset-0 " +
    (isStudio
      ? "bg-[radial-gradient(ellipse_90%_72%_at_50%_18%,rgba(255,255,255,1)_0%,rgba(237,239,244,1)_52%,rgba(216,219,226,1)_100%)]"
      : "bg-[radial-gradient(ellipse_95%_80%_at_50%_28%,rgba(255,255,255,1)_0%,rgba(251,251,249,1)_42%,rgba(238,237,232,1)_100%)]");

  const sheen =
    "pointer-events-none absolute inset-0 opacity-[0.65] bg-[linear-gradient(130deg,rgba(255,255,255,.75)_0%,transparent_42%,transparent_58%,rgba(211,47,47,.035)_100%)]";

  return (
    <div className={`space-y-6 ${className}`}>
      {!hideIntroLine && (
        <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-ink-subtle">
          Photo gallery · swipe or scroll thumbnails
        </p>
      )}

      <div className="relative overflow-hidden rounded-[1.65rem] border border-black/[0.06] shadow-[0_28px_64px_-32px_rgba(26,26,31,0.35),0_2px_0_0_rgba(255,255,255,.7)_inset] ring-1 ring-white/80">
        <div aria-hidden className={`${ambient}`} />
        <div aria-hidden className={`${sheen}`} />

        {/* floor line — anchors the composition */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-24 bg-[linear-gradient(to_top,rgba(26,26,31,.04)_0%,transparent_85%)]"
          aria-hidden
        />

        <div
          className={
            "relative z-[2] flex w-full min-h-0 max-w-full items-center justify-center px-4 pt-6 sm:px-6 sm:pt-8 lg:justify-start lg:px-6 lg:pt-9 min-h-[min(38vh,280px)] sm:min-h-[min(42vh,300px)] lg:min-h-[min(46vh,320px)] " +
            (safe.length > 1 ? "pb-20 sm:pb-24" : "pb-10 sm:pb-12")
          }
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={mainSrc}
              src={mainSrc}
              alt={`${productName} — ${active + 1} of ${safe.length}`}
              className="h-auto w-full max-w-full object-contain object-center lg:object-left max-h-[min(56svh,560px)] sm:max-h-[min(60svh,600px)] md:max-h-[min(64svh,640px)] lg:max-h-[min(68svh,680px)] [filter:drop-shadow(0_28px_50px_rgba(0,0,0,.12))]"
              initial={{ opacity: 0.6, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.6, scale: 0.985 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              loading="eager"
              decoding="async"
            />
          </AnimatePresence>
        </div>

        {safe.length > 1 ? (
          <div className="pointer-events-none absolute inset-x-0 bottom-5 z-[3] flex justify-between px-4 sm:bottom-6 sm:px-7">
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + safe.length) % safe.length)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.07] bg-white/95 text-ink shadow-[0_12px_28px_-10px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:scale-[1.03] hover:bg-white hover:shadow-lg active:scale-95"
              aria-label="Previous photo"
            >
              <i className="ri-arrow-left-s-line text-xl" />
            </button>
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % safe.length)}
              className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.07] bg-white/95 text-ink shadow-[0_12px_28px_-10px_rgba(0,0,0,.35)] backdrop-blur-md transition hover:scale-[1.03] hover:bg-white hover:shadow-lg active:scale-95"
              aria-label="Next photo"
            >
              <i className="ri-arrow-right-s-line text-xl" />
            </button>
          </div>
        ) : null}
      </div>

      {safe.length > 1 ? (
        <div className="-mx-0.5 rounded-[1.25rem] border border-canvas-edge/80 bg-[linear-gradient(to_bottom,#fff_0%,rgba(251,251,249,.92)_100%)] p-3 shadow-[0_12px_32px_-20px_rgba(26,26,31,.12)] backdrop-blur-sm sm:p-4">
          <div
            className="flex snap-x snap-proximity gap-3 overflow-x-auto px-1 py-1 [scrollbar-width:thin] [-webkit-overflow-scrolling:touch]"
            role="tablist"
            aria-label="Product photos · scroll sideways"
          >
            {safe.map((src, i) => (
              <button
                key={`${src}-${i}`}
                ref={(el) => {
                  thumbRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={active === i}
                onClick={() => setActive(i)}
                className={`relative shrink-0 snap-center overflow-hidden rounded-xl border-2 bg-[#faf9f7] shadow-sm outline-none transition focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 ${
                  active === i
                    ? "border-brand-red ring-[3px] ring-brand-red/15"
                    : "border-transparent hover:border-canvas-edge"
                }`}
              >
                <img
                  src={src}
                  alt=""
                  className="pointer-events-none m-2 h-[4.65rem] w-[4.65rem] select-none object-contain sm:h-[5.65rem] sm:w-[5.65rem]"
                  draggable={false}
                />
                <span className="sr-only">
                  Photo {i + 1} of {safe.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {safe.length > 1 ? (
        <div className="flex items-center justify-center gap-3 px-2">
          <span className="h-px w-14 flex-1 rounded-full bg-gradient-to-r from-transparent to-canvas-edge" aria-hidden />
          <p className="shrink-0 text-[11px] font-bold uppercase tracking-[0.28em] text-ink-subtle">
            Image {active + 1} of {safe.length}
          </p>
          <span className="h-px w-14 flex-1 rounded-full bg-gradient-to-l from-transparent to-canvas-edge" aria-hidden />
        </div>
      ) : null}
    </div>
  );
}

export default SubProductImageGallery;
