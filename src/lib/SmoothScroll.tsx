import { useEffect, ReactNode } from "react";
import Lenis from "lenis";

// Stash the active Lenis instance globally so other helpers (route change
// scroll-to-top, anchor links) can issue lenis.scrollTo() instead of fighting
// the smooth-scroll loop with native scrollTo calls.
declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Lenis smooth scroll provider. Disabled when the user prefers reduced motion.
// Native scroll continues to work normally; Lenis just intercepts the wheel/touch
// events and animates window.scrollY toward the target on each rAF tick.
export default function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
