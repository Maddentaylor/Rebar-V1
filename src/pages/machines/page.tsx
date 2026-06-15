import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import MachineLineupCard from "@/components/machines/MachineLineupCard";

export default function MachinesPage() {
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />

      {/* Lighter editorial header */}
      <section className="relative pt-36 md:pt-44 pb-16 px-6 overflow-hidden bg-warm-fade">
        <div className="pointer-events-none absolute -top-24 -right-32 w-[640px] h-[640px] ambient-glow opacity-70"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          <Reveal delay={0}>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Our Equipment</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="text-ink font-black tracking-tightest leading-[0.95]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              The full <span className="text-grad-ember">lineup.</span>
            </h1>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="w-20 h-1 bg-brand-red mt-6"></div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="text-ink-muted text-base md:text-lg max-w-xl mt-6">
              Explore our machine lines — click any card for models, features, and quote information.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Machine Grid */}
      <section className="relative overflow-hidden bg-gradient-to-b from-canvas via-white to-[#f3f3f2] py-20 px-6">
        <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(211,47,47,0.06)_0%,transparent_70%)] blur-2xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] -translate-x-1/3 translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,28,32,0.035)_0%,transparent_68%)] blur-2xl" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Stagger
            stagger={0.06}
            amount={0.05}
            className="grid grid-cols-1 items-stretch sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {machines.map((machine, i) => (
              <RevealItem key={machine.id} className="h-full">
                <MachineLineupCard machine={machine} index={i} total={machines.length} />
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative bg-canvas-raised border-t border-canvas-edge overflow-hidden">
        <div className="pointer-events-none absolute -top-20 right-0 w-[520px] h-[520px] ambient-glow opacity-50"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Need Help Choosing?</span>
              </div>
              <h2
                className="text-3xl md:text-5xl font-black text-ink leading-[0.98] tracking-tightest"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                Not sure which <span className="text-grad-ember">machine you need?</span>
              </h2>
              <p className="text-ink-muted text-base mt-3 max-w-lg">
                Talk to our team — we&apos;ll help you find the right fit for your operation.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Magnetic strength={0.35}>
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center gap-3 pl-7 pr-2 h-14 bg-ink text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-red transition-colors duration-300 cursor-pointer"
              >
                Contact Us
                <span className="w-9 h-9 flex items-center justify-center bg-brand-red rounded-full transition-transform duration-300 group-hover:bg-white">
                  <i className="ri-arrow-right-line text-base text-white group-hover:text-brand-red transition-colors"></i>
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
