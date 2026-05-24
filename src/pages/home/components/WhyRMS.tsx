import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import { companyOperatingYears } from "@/data/company";

const points = [
  {
    icon: "ri-tools-line",
    number: "01",
    title: "Built to Perform",
    body: "Every machine in our lineup is engineered for the demands of real job sites — heavy loads, continuous cycles, and zero tolerance for downtime.",
    accent: "Field-tested durability",
  },
  {
    icon: "ri-customer-service-2-line",
    number: "02",
    title: "Expert Support",
    body: "Our team has decades of hands-on experience in rebar fabrication. When you call, you talk to someone who actually knows the machines.",
    accent: "Real people, real answers",
  },
  {
    icon: "ri-truck-line",
    number: "03",
    title: "Parts When You Need Them",
    body: "We stock hundreds of genuine parts and ship fast. Most orders leave our Las Vegas warehouse within 24 hours so your operation stays running.",
    accent: "48-hour delivery target",
  },
];

export default function WhyRMS() {
  const railRef = useRef<HTMLDivElement>(null);
  const yearsOp = companyOperatingYears();

  const { scrollYProgress } = useScroll({
    target: railRef,
    offset: ["start 80%", "end 60%"],
  });
  // The rail draws in proportionally to scroll position.
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative bg-canvas py-28 md:py-32 px-6 overflow-hidden">
      <div className="pointer-events-none absolute -top-32 right-0 w-[640px] h-[640px] ambient-glow opacity-60"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
                  Why Choose Us
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl md:text-6xl font-black text-ink tracking-tightest leading-[0.98]"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                Three reasons<br />
                <span className="text-grad-ember">shops stay with RMS.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="w-20 h-1 bg-brand-red mt-5"></div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <p className="text-ink-muted text-sm md:text-base max-w-sm leading-relaxed">
              {yearsOp}+ years of putting the right equipment in the right hands, backed by unmatched service and a parts inventory that ships before your next shift starts.
            </p>
          </Reveal>
        </div>

        {/* Timeline */}
        <div ref={railRef} className="relative">
          {/* SVG rail that draws in on scroll */}
          <svg
            className="hidden md:block absolute top-[44px] left-[8%] right-[8%] w-[84%] h-2 pointer-events-none"
            viewBox="0 0 100 1"
            preserveAspectRatio="none"
            aria-hidden
          >
            <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#e4e2dc" strokeWidth="0.5" />
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="#D32F2F"
              strokeWidth="0.5"
              style={{ pathLength }}
            />
          </svg>

          <Stagger
            stagger={0.12}
            amount={0.15}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 items-stretch"
          >
            {points.map((p) => (
              <RevealItem key={p.number} className="h-full">
                <Tilt
                  max={6}
                  liftZ={16}
                  className="relative h-full bg-canvas-raised border border-canvas-edge rounded-2xl p-9 flex flex-col group cursor-default shadow-soft hover:shadow-card transition-shadow duration-300"
                >
                  <span className="display-backdrop absolute top-3 right-5 text-[110px] text-canvas-edge leading-none">
                    {p.number}
                  </span>

                  <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-brand-red rounded-2xl mb-7 shadow-ember group-hover:scale-105 transition-transform duration-300">
                    <i className={`${p.icon} text-white text-2xl`}></i>
                  </div>

                  <p className="relative z-10 text-brand-red text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                    {p.accent}
                  </p>
                  <h3
                    className="relative z-10 text-ink text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight"
                    style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                  >
                    {p.title}
                  </h3>
                  <p className="relative z-10 flex-1 text-ink-muted text-sm leading-relaxed">{p.body}</p>

                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl"></span>
                </Tilt>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
