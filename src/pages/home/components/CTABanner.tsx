import { Link } from "react-router-dom";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Magnetic from "@/components/motion/Magnetic";

export default function CTABanner() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const photoScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const photoY     = useTransform(scrollYProgress, [0, 1], ["0%", "12%"]);
  const textY      = useTransform(scrollYProgress, [0, 0.5, 1], ["12%", "0%", "-8%"]);
  const textOp     = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0.8]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden h-[560px] md:h-[640px] flex items-center bg-ink-deep"
    >
      <motion.div
        className="absolute inset-0"
        style={{ y: photoY, scale: photoScale }}
      >
        <img
          src="https://readdy.ai/api/search-image?query=wide%20angle%20aerial%20view%20of%20large%20active%20construction%20site%20with%20cranes%20steel%20rebar%20concrete%20workers%20at%20golden%20hour%20sunset%2C%20dramatic%20sky%20warm%20light%2C%20epic%20scale%20industrial%20construction%20photography%20cinematic&width=1920&height=900&seq=ctabanner2&orientation=landscape"
          alt=""
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10"></div>
      </motion.div>

      {/* Mid-layer ambient glow */}
      <div className="absolute top-[8%] right-[10%] w-[420px] h-[420px] ambient-glow animate-blob pointer-events-none"></div>

      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-8 md:px-12"
        style={{ y: textY, opacity: textOp }}
      >
        <div className="inline-flex items-center gap-3 mb-6 glass-dark rounded-full px-3.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red inline-block"></span>
          <span className="text-white text-[10px] font-bold uppercase tracking-[0.4em]">
            Trusted Across North America
          </span>
        </div>

        <h2
          className="text-white font-black tracking-tightest leading-[0.95] mb-6 max-w-4xl"
          style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", fontSize: "clamp(2.75rem, 6.5vw, 6rem)" }}
        >
          Downtime is not<br />
          <span className="text-grad-ember">an option.</span>
        </h2>
        <p className="text-white/75 text-base md:text-lg mb-9 max-w-xl">
          Every hour your machine sits idle costs you. We keep your floor running — with the right equipment, the right parts, right now.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Magnetic strength={0.35}>
            <Link
              to="/machines"
              className="group inline-flex items-center justify-center gap-3 pl-7 pr-3 h-14 bg-brand-red text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-glow hover:shadow-glow transition-all duration-300 cursor-pointer"
            >
              Browse All Machines
              <span className="w-9 h-9 flex items-center justify-center bg-white text-brand-red rounded-full transition-transform duration-300 group-hover:translate-x-0.5">
                <i className="ri-arrow-right-line text-base"></i>
              </span>
            </Link>
          </Magnetic>
          <Magnetic strength={0.25}>
            <Link
              to="/parts"
              className="group inline-flex items-center justify-center gap-2 px-7 h-14 border border-white/30 text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-white/5 hover:border-white transition-all duration-300 cursor-pointer"
            >
              <i className="ri-search-line text-base"></i>
              Shop Parts Catalog
            </Link>
          </Magnetic>
        </div>
      </motion.div>
    </section>
  );
}
