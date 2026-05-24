import { motion, useReducedMotion, type Variants } from "framer-motion";
import { ReactNode } from "react";
import { fadeUp, staggerContainer } from "@/lib/motionPresets";

type RevealProps = {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  className?: string;
  // viewport amount: 0..1 — fraction of element visible before triggering.
  amount?: number;
  // When true, only animate the first time it enters the viewport.
  once?: boolean;
  as?: "div" | "section" | "article" | "header" | "footer" | "ul" | "li" | "span";
};

// A drop-in wrapper that fades children up the first time they enter the
// viewport. Replaces the hand-rolled IntersectionObserver pattern.
export default function Reveal({
  children,
  variants = fadeUp,
  delay = 0,
  className,
  amount = 0.2,
  once = true,
  as = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const Tag = motion[as] as typeof motion.div;

  if (reduced) {
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

type StaggerProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delayChildren?: number;
  amount?: number;
  once?: boolean;
};

// Wraps children with a staggered container. Children should be `RevealItem`
// (or any motion element using the `fadeUp` variant) for the effect to apply.
export function Stagger({
  children,
  className,
  stagger = 0.08,
  delayChildren = 0,
  amount = 0.2,
  once = true,
}: StaggerProps) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={staggerContainer(stagger, delayChildren)}
    >
      {children}
    </motion.div>
  );
}

// A child of <Stagger> that uses the fadeUp variant by default.
export function RevealItem({
  children,
  variants = fadeUp,
  className,
  as = "div",
}: {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  as?: "div" | "li" | "span" | "article";
}) {
  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag className={className} variants={variants}>
      {children}
    </Tag>
  );
}
