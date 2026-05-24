import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode, type CSSProperties } from "react";

type TiltProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  // Max tilt in degrees on each axis.
  max?: number;
  // Pop the element forward in Z on hover for that floaty parallax feel.
  liftZ?: number;
  // Optional glare layer that follows the cursor.
  glare?: boolean;
  // Children that should counter-translate slightly (parallax inside the card).
  // Used by passing this same value into the inner Tilt.Inner component.
  scale?: number;
};

type TiltGlareProps = {
  xPct: MotionValue<number>;
  yPct: MotionValue<number>;
  z: MotionValue<number>;
  liftZ: number;
};

/** Cursor-following glare; separate component so hooks are not conditional in `Tilt`. */
function TiltGlare({ xPct, yPct, z, liftZ }: TiltGlareProps) {
  const glareX = useTransform(xPct, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(yPct, [-0.5, 0.5], ["0%", "100%"]);
  const background = useTransform(
    [glareX, glareY] as never,
    ([gx, gy]: string[]) =>
      `radial-gradient(220px circle at ${gx} ${gy}, rgba(255,255,255,0.35), transparent 60%)`,
  );
  const opacity = useTransform(z, [0, liftZ], [0, 1]);

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 mix-blend-overlay"
      style={{
        background,
        opacity,
      }}
    />
  );
}

// 3D mouse-tracking tilt. Springy return-to-rest so it never feels stiff.
// Works with any DOM child. Disabled under prefers-reduced-motion.
export default function Tilt({
  children,
  className,
  style,
  max = 7,
  liftZ = 14,
  glare = false,
  scale = 1.012,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const xPct = useMotionValue(0);
  const yPct = useMotionValue(0);

  const rotateX = useSpring(useTransform(yPct, [-0.5, 0.5], [max, -max]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const rotateY = useSpring(useTransform(xPct, [-0.5, 0.5], [-max, max]), {
    stiffness: 220,
    damping: 22,
    mass: 0.6,
  });
  const z = useSpring(0, { stiffness: 240, damping: 26 });
  const scaleSpring = useSpring(1, { stiffness: 240, damping: 26 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    xPct.set(px);
    yPct.set(py);
  };

  const handleEnter = () => {
    z.set(liftZ);
    scaleSpring.set(scale);
  };

  const handleLeave = () => {
    xPct.set(0);
    yPct.set(0);
    z.set(0);
    scaleSpring.set(1);
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
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        ...style,
        rotateX,
        rotateY,
        z,
        scale: scaleSpring,
        transformPerspective: 900,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
      {glare ? <TiltGlare xPct={xPct} yPct={yPct} z={z} liftZ={liftZ} /> : null}
    </motion.div>
  );
}
