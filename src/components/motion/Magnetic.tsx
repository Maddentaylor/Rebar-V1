import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

type MagneticProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  // Strength of the magnetic pull (0..1). 0.3 is a tasteful default.
  strength?: number;
  // Max travel in pixels on each axis at full strength.
  range?: number;
};

// Subtle magnetic pull toward the cursor. Use on buttons/CTAs only — too many
// magnetic elements at once feels chaotic.
export default function Magnetic({
  children,
  className,
  style,
  strength = 0.3,
  range = 18,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const py = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    x.set(px * range * strength);
    y.set(py * range * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  if (reduced) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ ...style, x: sx, y: sy }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </motion.div>
  );
}
