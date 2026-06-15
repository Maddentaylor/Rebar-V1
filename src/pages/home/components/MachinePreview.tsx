import { Link } from "react-router-dom";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import MachineLineupCard from "@/components/machines/MachineLineupCard";

export default function MachinePreview() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-canvas via-white to-[#f3f3f2] py-28 px-6">
      {/* Ambient washes — balanced top-right + bottom-left */}
      <div className="pointer-events-none absolute -top-36 -right-28 h-[min(720px,90vw)] w-[min(720px,90vw)] rounded-full bg-[radial-gradient(circle_at_center,rgba(211,47,47,0.07)_0%,transparent_68%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-48 -left-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(26,28,32,0.035)_0%,transparent_65%)] blur-2xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
          <div>
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
                  Our Equipment
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-4xl md:text-6xl font-black text-ink tracking-tightest leading-[0.98]"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                The full lineup.
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="w-20 h-1 bg-brand-red mt-5"></div>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="text-ink-muted text-sm md:text-base mt-5 max-w-md">
                {machines.length} machine lines, dozens of models, hundreds of compatible parts. Every line is engineered for the realities of a working fab shop.
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <Magnetic strength={0.3}>
              <Link
                to="/machines"
                className="group inline-flex items-center justify-center gap-3 pl-6 pr-2 h-12 bg-ink text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-red transition-colors duration-300 cursor-pointer"
              >
                View All Machines
                <span className="w-9 h-9 flex items-center justify-center bg-brand-red rounded-full transition-transform duration-300 group-hover:bg-white">
                  <i className="ri-arrow-right-line text-base text-white group-hover:text-brand-red transition-colors"></i>
                </span>
              </Link>
            </Magnetic>
          </Reveal>
        </div>

        {/* Cards */}
        <Stagger
          stagger={0.07}
          amount={0.05}
          className="grid grid-cols-2 items-stretch md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {machines.map((m, i) => (
            <RevealItem key={m.id} className="h-full">
              <MachineLineupCard
                machine={m}
                index={i}
                total={machines.length}
                indexLabel="fraction"
                tiltMax={8}
                tiltLiftZ={20}
              />
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
