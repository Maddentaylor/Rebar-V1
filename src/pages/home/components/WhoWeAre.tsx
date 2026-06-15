import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import Reveal from "@/components/motion/Reveal";
import { SCHILT_PARTNER_ABOUT_ROUTE, COMPANY, companyOperatingYears } from "@/data/company";

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [val, setVal] = useState(0);
  const reduced = useReducedMotion();

  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 80, damping: 22, mass: 1 });

  useEffect(() => {
    if (!inView) return;
    if (reduced) { setVal(to); return; }
    mv.set(to);
    const unsub = spring.on("change", (v) => setVal(Math.round(v)));
    return () => unsub();
  }, [inView, to, mv, spring, reduced]);

  return (
    <span ref={ref} className="tabular-nums">
      {val}{suffix}
    </span>
  );
}

export default function WhoWeAre() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const yearsOp = companyOperatingYears();

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1.04, 1.1]);

  return (
    <section ref={sectionRef} className="relative bg-canvas overflow-hidden">
      {/* Subtle hairline */}
      <div className="hairline h-px"></div>

      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[640px]">
        {/* Left: Text */}
        <div className="relative flex flex-col justify-center px-8 md:px-16 py-24 md:py-28">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-6">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Who We Are</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h2
              className="text-4xl md:text-5xl xl:text-6xl font-black text-ink leading-[1.02] tracking-tightest mb-7"
              style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
            >
              More than a machine dealer —<br />
              <span className="text-grad-ember">a production partner.</span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="w-20 h-1 bg-brand-red mb-7"></div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-5 max-w-xl">
              RMS Rebar Machine Service was founded by fabricators, for fabricators. We know what it takes to keep a shop running at full capacity — the right machines, the right parts, and the right support when you need it most.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="text-ink-subtle text-sm md:text-base leading-relaxed mb-12 max-w-xl">
              From single-machine operations to full-scale fabrication facilities, we supply, service, and support the equipment that keeps your crew productive and your projects on schedule — backed by our partnership with Schilt Engineering of the Netherlands.
            </p>
          </Reveal>

          {/* Stats */}
          <Reveal delay={0.25}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-8 border-t border-canvas-edge">
              {[
                { to: yearsOp,              suffix: "+",  label: "Years in Business" },
                { to: 20,              suffix: "+",  label: "Machines" },
                { to: 500,             suffix: "+",  label: "Parts in Stock" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col">
                  <span
                    className="text-5xl md:text-6xl font-black text-grad-ember leading-none tracking-tightest"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <CountUp to={s.to} suffix={s.suffix} />
                  </span>
                  <span className="mt-3 text-ink-subtle text-[10px] uppercase tracking-[0.3em]">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* Right: image with parallax frame */}
        <div ref={imageRef} className="relative w-full h-[420px] lg:h-auto overflow-hidden">
          <motion.img
            src="https://readdy.ai/api/search-image?query=industrial%20rebar%20steel%20fabrication%20workers%20operating%20heavy%20bending%20machine%20inside%20a%20large%20metal%20workshop%2C%20bright%20overhead%20lights%2C%20action%20shot%20showing%20teamwork%20and%20machinery%20in%20use%2C%20photorealistic%20documentary%20style&width=1200&height=900&seq=whoweare1&orientation=portrait"
            alt="RMS team at work"
            className="w-full h-full object-cover object-top will-change-transform"
            style={{ y: imgY, scale: imgScale }}
          />

          <div className="absolute inset-0 bg-gradient-to-r from-canvas/60 via-transparent to-transparent pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none"></div>

          {/* Las Vegas pin */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-8 glass rounded-full pl-3 pr-5 py-2.5 inline-flex items-center gap-3"
          >
            <span className="w-7 h-7 flex items-center justify-center bg-brand-red rounded-full shadow-ember">
              <i className="ri-map-pin-fill text-white text-xs"></i>
            </span>
            <div className="text-ink">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-ink-muted leading-none">Las Vegas, Nevada</p>
              <p className="text-xs font-bold leading-none mt-0.5">Established {COMPANY.foundedYear}</p>
            </div>
          </motion.div>

          {/* Schilt chip */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="absolute top-8 right-8 glass-dark rounded-full"
          >
            <Link
              to={SCHILT_PARTNER_ABOUT_ROUTE}
              className="inline-flex cursor-pointer items-center gap-2 px-3 py-2 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/35"
              aria-label="Schilt Engineering — open partnership section on About"
            >
              <span className="w-1.5 h-1.5 shrink-0 rounded-full bg-brand-red" aria-hidden />
              <span className="text-white text-[10px] font-bold uppercase tracking-[0.25em]">Schilt Engineering Partner</span>
            </Link>
          </motion.div>
        </div>
      </div>

      <div className="hairline h-px"></div>
    </section>
  );
}
