import { Link } from "react-router-dom";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";
import { MachineCardMedia } from "@/components/machines/MachineCardMedia";

function MachineCard({ machine, index }: { machine: typeof machines[0]; index: number }) {
  const subCount = machine.subProducts?.length ?? 0;
  const machineHref =
    subCount === 1
      ? `/machines/${machine.id}/${machine.subProducts![0].id}`
      : `/machines/${machine.id}`;

  return (
    <RevealItem className="group">
      <Tilt
        max={8}
        liftZ={20}
        glare
        className="relative cursor-pointer overflow-hidden rounded-2xl border border-canvas-edge/70 bg-white shadow-soft transition-shadow duration-300 hover:border-canvas-edge hover:shadow-card"
      >
        <Link to={machineHref} className="block">
          <MachineCardMedia
            src={machine.image}
            alt={machine.name}
            className="h-72 min-h-[18rem] w-full"
            lineCoverZoom={machine.lineCardCoverZoom}
            lineCoverObjectPosition={machine.lineCardCoverObjectPosition}
          >
            <div className="absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md ring-1 ring-white/12">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-red"></span>
              <span className="font-mono text-[10px] font-bold tracking-[0.28em] text-white/90">
                {String(index + 1).padStart(2, "0")} / {String(machines.length).padStart(2, "0")}
              </span>
            </div>
            {subCount > 1 && (
              <div className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-white shadow-sm">
                <i className="ri-stack-line text-[11px]"></i>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                  {subCount} model{subCount === 1 ? "" : "s"}
                </span>
              </div>
            )}
          </MachineCardMedia>

          <div className="relative p-5">
            <h3
              className="text-ink text-xl font-black mb-1.5 leading-tight tracking-tight"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {machine.name}
            </h3>
            <p className="text-ink-muted text-xs leading-relaxed line-clamp-2">{machine.shortDesc}</p>

            <div className="mt-4 inline-flex items-center gap-2 text-brand-red text-[11px] font-bold uppercase tracking-[0.25em]">
              <span>View Details</span>
              <i className="ri-arrow-right-line text-sm transition-transform duration-300 group-hover:translate-x-1"></i>
            </div>
          </div>
        </Link>
      </Tilt>
    </RevealItem>
  );
}

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
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          {machines.map((m, i) => (
            <MachineCard key={m.id} machine={m} index={i} />
          ))}
        </Stagger>
      </div>
    </section>
  );
}
