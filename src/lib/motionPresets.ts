import type { Variants, Transition } from "framer-motion";

// House-style spring used by reveals, tilts, and magnetics. Slightly underdamped
// so motion feels "live" but settles cleanly.
export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 26,
  mass: 0.9,
};

// Slow and confident — for hero text and large display elements.
export const easeHero: Transition = {
  duration: 0.85,
  ease: [0.22, 1, 0.36, 1],
};

// Snappy — for buttons, chips, small UI feedback.
export const easeUI: Transition = {
  duration: 0.32,
  ease: [0.32, 0.72, 0, 1],
};

// Standard fade-and-rise. The default reveal pattern.
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28, pointerEvents: "none" },
  show:   { opacity: 1, y: 0, pointerEvents: "auto", transition: easeHero },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show:   { opacity: 1, transition: easeHero },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 40 },
  show:   { opacity: 1, x: 0, transition: easeHero },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  show:   { opacity: 1, x: 0, transition: easeHero },
};

// Clip-path reveal feels editorial — used on display headlines.
export const revealClipPath: Variants = {
  hidden: { clipPath: "inset(0 100% 0 0)", opacity: 1 },
  show:   {
    clipPath: "inset(0 0 0 0)",
    opacity: 1,
    transition: { duration: 0.95, ease: [0.65, 0, 0.35, 1] },
  },
};

// Container that staggers its children's `show` variant.
export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: stagger,
      delayChildren,
    },
  },
});

// For letter-by-letter or word-by-word headline animation.
export const splitChild: Variants = {
  hidden: { opacity: 0, y: "100%" },
  show: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};
