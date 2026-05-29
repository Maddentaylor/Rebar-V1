import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";
import { MachineCardMedia } from "@/components/machines/MachineCardMedia";
import { companyOperatingYears } from "@/data/company";

export default function MachinesPage() {
  const yearsOp = companyOperatingYears();
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />

      {/* Lighter editorial header */}
      <section className="relative pt-36 md:pt-44 pb-16 px-6 overflow-hidden bg-warm-fade">
        <div className="pointer-events-none absolute -top-24 -right-32 w-[640px] h-[640px] ambient-glow opacity-70"></div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-end">
          <div className="lg:col-span-7">
            {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
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
                {machines.length} machine lines engineered for rebar fabrication. Click any machine to explore models, features, and request information.
              </p>
            </Reveal>
          </div>

          {/* Stat strip on the right */}
          <Reveal delay={0.2} className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 pt-6 border-t border-canvas-edge">
              {[
                { value: `${machines.length}`, label: "Lines"            },
                { value: "30+",                label: "Models"           },
                { value: "500+",               label: "Compatible Parts" },
                { value: `${yearsOp}+`,                label: "Years Supplying"  },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="text-4xl md:text-5xl font-black text-grad-ember leading-none tracking-tightest"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {s.value}
                  </p>
                  <p className="mt-2 text-ink-subtle text-[10px] uppercase tracking-[0.3em]">{s.label}</p>
                </div>
              ))}
            </div>
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {machines.map((machine, i) => {
              const subCount = machine.subProducts?.length ?? 0;
              const machineHref =
                subCount === 1
                  ? `/machines/${machine.id}/${machine.subProducts![0].id}`
                  : `/machines/${machine.id}`;
              return (
                <RevealItem key={machine.id} className="group">
                  <Tilt
                    max={6}
                    liftZ={16}
                    glare
                    className="relative cursor-pointer overflow-hidden rounded-2xl border border-canvas-edge/70 bg-white shadow-soft transition-shadow duration-300 hover:border-canvas-edge hover:shadow-card"
                  >
                    <Link to={machineHref} className="block">
                      <MachineCardMedia
                        src={machine.image}
                        alt={machine.name}
                        className="h-60 min-h-[15rem] w-full"
                        lineCoverZoom={machine.lineCardCoverZoom}
                        lineCoverObjectPosition={machine.lineCardCoverObjectPosition}
                      >
                        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md ring-1 ring-white/12">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand-red"></span>
                          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-white/92">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {subCount > 1 && (
                          <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-white shadow-sm">
                            <i className="ri-stack-line text-[11px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{subCount} models</span>
                          </div>
                        )}
                      </MachineCardMedia>

                      <div className="p-5">
                        <h3
                          className="text-ink text-xl font-black mb-2 leading-tight tracking-tight"
                          style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                        >
                          {machine.name}
                        </h3>
                        <p className="text-ink-muted text-sm leading-relaxed mb-4 line-clamp-2">{machine.shortDesc}</p>
                        <div className="flex items-center gap-2 text-brand-red text-[11px] font-bold uppercase tracking-[0.25em]">
                          <span>View Details</span>
                          <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-1"></i>
                        </div>
                      </div>

                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></span>
                    </Link>
                  </Tilt>
                </RevealItem>
              );
            })}
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
