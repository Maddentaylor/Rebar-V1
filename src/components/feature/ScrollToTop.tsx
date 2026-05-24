import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Sticky navbar + breathing room (~`scroll-mt-24`). */
const SCROLL_MARGIN_OFFSET_PX = 96;

function scrollToHashTarget(hash: string): boolean {
  const id = decodeURIComponent(hash.startsWith("#") ? hash.slice(1) : hash);
  if (!id) return false;
  const el = document.getElementById(id);
  if (!el) return false;

  const lenis = typeof window !== "undefined" ? window.__lenis : undefined;

  if (lenis) {
    lenis.scrollTo(el, { offset: -SCROLL_MARGIN_OFFSET_PX, immediate: true });
    return true;
  }

  const rect = el.getBoundingClientRect();
  const top = rect.top + window.scrollY - SCROLL_MARGIN_OFFSET_PX;
  window.scrollTo({ top: Math.max(0, top), behavior: "instant" });
  return true;
}

// Reset scroll on route change. When the URL carries a `#fragment`, scroll to
// that element instead of snapping to top (Schilt partnership, etc.).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      // Let the routed screen paint before measuring anchors.
      if (hash && scrollToHashTarget(hash)) return;

      const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
      if (lenis) lenis.scrollTo(0, { immediate: true });
      else window.scrollTo({ top: 0, behavior: "instant" });
    });

    return () => cancelAnimationFrame(id);
  }, [pathname, hash]);

  return null;
}
