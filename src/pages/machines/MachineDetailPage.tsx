import { useState, type CSSProperties } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";

export default function MachineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const machine = machines.find((m) => m.id === id);
  const [selectedModel, setSelectedModel] = useState(machine?.models[0] ?? "");

  if (!machine) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-ink text-4xl font-black mb-4">Machine Not Found</h1>
          <Link to="/machines" className="text-brand-red hover:underline cursor-pointer">Back to Machines</Link>
        </div>
      </div>
    );
  }

  const subProducts = machine.subProducts ?? [];
  const hasSchilt = subProducts.some((s) => s.schilt);

  if (subProducts.length === 1) {
    return <Navigate to={`/machines/${machine.id}/${subProducts[0].id}`} replace />;
  }

  return (
    <div className="bg-canvas min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Page header */}
      <div className="relative pt-36 md:pt-44 pb-12 px-8 md:px-16 overflow-hidden bg-warm-fade">
        <div className="pointer-events-none absolute -top-24 -right-32 w-[640px] h-[640px] ambient-glow opacity-60"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <Reveal delay={0}>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-brand-red"></span>
                  <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Machine Line</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h1
                  className="text-ink font-black leading-[0.95] mb-5 tracking-tightest"
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.5rem, 6vw, 5.5rem)" }}
                >
                  {machine.name}.
                </h1>
              </Reveal>
              <Reveal delay={0.1}>
                <div className="w-20 h-1 bg-brand-red mb-5"></div>
              </Reveal>
              <Reveal delay={0.15}>
                <p className="text-ink-muted text-base md:text-lg max-w-2xl">{machine.shortDesc}</p>
              </Reveal>

              <Reveal delay={0.2}>
                <div className="flex items-center gap-3 mt-6 flex-wrap">
                  {subProducts.length > 0 && (
                    <span className="inline-flex items-center gap-2 bg-canvas-raised border border-canvas-edge px-3 py-1.5 rounded-full text-ink-muted text-xs font-semibold">
                      <i className="ri-stack-line text-brand-red"></i>
                      {subProducts.length} {subProducts.length === 1 ? "model" : "models"} in this line
                    </span>
                  )}
                  {hasSchilt && (
                    <span className="inline-flex items-center gap-2 bg-ink-deep text-white px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em]">
                      <i className="ri-award-fill text-brand-red"></i>
                      Schilt-engineered models
                    </span>
                  )}
                </div>
              </Reveal>
            </div>
            <Reveal delay={0.25}>
              <Magnetic strength={0.3}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 pl-6 pr-2 h-12 bg-ink text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-red transition-colors duration-300 cursor-pointer"
                >
                  Contact Us
                  <span className="w-9 h-9 flex items-center justify-center bg-brand-red rounded-full transition-transform duration-300 group-hover:bg-white">
                    <i className="ri-arrow-right-line text-base text-white group-hover:text-brand-red transition-colors"></i>
                  </span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Sub-Products Grid */}
      {subProducts.length > 0 ? (
        <section className="py-16 px-8 md:px-16 bg-canvas">
          <div className="max-w-7xl mx-auto">
            <Stagger stagger={0.06} amount={0.05} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 [&>*]:min-w-0">
              {subProducts.map((sub, idx) => (
                <RevealItem key={sub.id} className="group min-w-0">
                  <Tilt
                    max={6}
                    liftZ={18}
                    glare
                    className="relative bg-canvas-raised border border-canvas-edge rounded-2xl overflow-hidden cursor-pointer shadow-soft hover:shadow-card transition-shadow duration-300"
                  >
                    <Link to={`/machines/${machine.id}/${sub.id}`} className="block">
                      <div
                        className={
                          sub.coverObjectFit === "contain" || sub.listingMediaTall
                            ? "relative w-full overflow-hidden bg-[#d7d9de] h-[clamp(15.75rem,min(42vw,24rem),25rem)] max-h-[42vh]"
                            : sub.coverObjectFit === "bleed"
                              ? "relative w-full overflow-hidden bg-black h-[clamp(14rem,min(40vw,22rem),24rem)] max-h-[min(42vh,26rem)]"
                              : "relative w-full overflow-hidden h-56"
                        }
                      >
                        <img
                          src={sub.image}
                          alt={sub.name}
                          className={
                            sub.coverObjectFit === "contain"
                              ? sub.containFlushX
                                ? "h-full w-full object-contain object-center px-0 py-4 transition-transform duration-[900ms] group-hover:scale-[1.04] sm:py-5 [filter:drop-shadow(0_14px_32px_rgba(0,0,0,.3))]"
                                : "h-full w-full object-contain object-center px-2 py-4 transition-transform duration-[900ms] group-hover:scale-[1.04] sm:px-3 sm:py-5 [filter:drop-shadow(0_14px_32px_rgba(0,0,0,.3))]"
                              : sub.coverObjectFit === "bleed"
                                ? "pointer-events-none absolute left-1/2 top-[50%] h-full min-h-[108%] w-[118%] max-w-none -translate-x-1/2 -translate-y-1/2 object-cover object-[center_48%] transition-transform duration-[900ms] group-hover:scale-[1.02]"
                                : sub.coverCropZoom != null
                                  ? "h-full w-full object-cover object-center transition-transform duration-[900ms]"
                                  : `h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-110 ${sub.coverObjectPosition ? "" : "object-top"}`
                          }
                          style={
                            sub.coverObjectFit === "contain" || sub.coverObjectFit === "bleed"
                              ? !sub.coverObjectPosition
                                ? undefined
                                : { objectPosition: sub.coverObjectPosition }
                              : (() => {
                                  const s: CSSProperties = {};
                                  if (sub.coverObjectPosition) s.objectPosition = sub.coverObjectPosition;
                                  if (sub.coverCropZoom != null) {
                                    s.transform = `scale(${sub.coverCropZoom})`;
                                    s.transformOrigin = "center center";
                                  }
                                  return Object.keys(s).length > 0 ? s : undefined;
                                })()
                          }
                        />
                        <div
                          className={
                            sub.coverObjectFit === "contain" || sub.listingMediaTall
                              ? "pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-800/22 via-transparent to-transparent"
                              : "absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                          }
                        ></div>

                        <div className="absolute top-3 left-3 glass-dark rounded-full px-2.5 py-1 inline-flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                          <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.25em]">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                        </div>

                        {sub.schilt && (
                          <div className="absolute top-3 right-3 inline-flex items-center gap-1.5 bg-brand-red text-white px-2.5 py-1 rounded-full">
                            <i className="ri-award-fill text-[11px]"></i>
                            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Schilt</span>
                          </div>
                        )}

                        <div className="absolute bottom-3 left-0 right-0 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <span className="bg-canvas text-ink text-[10px] font-bold uppercase tracking-[0.25em] px-4 py-1.5 rounded-full shadow-card">
                            View Details
                          </span>
                        </div>
                      </div>

                      <div className="p-5">
                        <h3
                          className="text-ink text-lg font-black mb-1.5 leading-tight tracking-tight group-hover:text-brand-red transition-colors duration-200"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {sub.name}
                        </h3>
                        <p className="text-ink-muted text-xs leading-relaxed mb-4 line-clamp-2">{sub.shortDesc}</p>

                        <div className="mb-4 min-h-[2.375rem]">
                          {sub.specifications.length > 0 ? (
                            <div className="flex items-center gap-2 flex-wrap">
                              {sub.specifications.slice(0, 2).map((spec, si) => (
                                <span
                                  key={si}
                                  className="inline-flex items-center gap-1 bg-canvas border border-canvas-edge text-ink-muted text-[10px] px-2.5 py-1 rounded-full"
                                >
                                  <span className="font-semibold text-ink uppercase tracking-wider">{spec.label}:</span>
                                  <span className="truncate max-w-[80px]">{spec.value.split(" ")[0]}</span>
                                </span>
                              ))}
                            </div>
                          ) : null}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-canvas-edge">
                          <span className="text-ink-subtle text-[10px] uppercase tracking-[0.25em]">{sub.features.length} features</span>
                          <div className="flex items-center gap-1.5 text-brand-red text-[10px] font-bold uppercase tracking-[0.25em]">
                            <span>Details</span>
                            <i className="ri-arrow-right-line transition-transform duration-200 group-hover:translate-x-1"></i>
                          </div>
                        </div>
                      </div>

                      <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                    </Link>
                  </Tilt>
                </RevealItem>
              ))}
            </Stagger>
          </div>
        </section>
      ) : (
        <section className="py-16 px-8 md:px-16 bg-canvas">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
            <Reveal>
              <div>
                <div className="inline-flex items-center gap-3 mb-5">
                  <span className="w-8 h-px bg-brand-red"></span>
                  <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Key Features</span>
                </div>
                <Stagger stagger={0.06} className="flex flex-col divide-y divide-canvas-edge">
                  {machine.features.map((feature, i) => (
                    <RevealItem key={i} as="div" className="flex items-start gap-4 py-5">
                      <span className="w-7 h-7 flex items-center justify-center mt-0.5 shrink-0 bg-brand-red/10 rounded-full">
                        <i className="ri-checkbox-circle-fill text-brand-red text-sm"></i>
                      </span>
                      <span className="text-ink text-sm leading-relaxed">{feature}</span>
                    </RevealItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <div className="inline-flex items-center gap-3 mb-5">
                  <span className="w-8 h-px bg-brand-red"></span>
                  <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Available Models</span>
                </div>
                <div className="flex flex-col gap-3">
                  {machine.models.map((model) => (
                    <button
                      key={model}
                      onClick={() => setSelectedModel(model)}
                      className={`p-5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                        selectedModel === model
                          ? "border-brand-red bg-brand-red/5 shadow-card"
                          : "border-canvas-edge bg-canvas-raised hover:border-ink-subtle"
                      }`}
                    >
                      <p className="text-ink font-black text-lg tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {model}
                      </p>
                      {selectedModel === model && (
                        <span className="w-7 h-7 flex items-center justify-center bg-brand-red rounded-full">
                          <i className="ri-check-line text-white text-sm"></i>
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* Bottom CTA — softened to canvas-raised */}
      <section className="relative bg-canvas-raised border-t border-canvas-edge py-16 px-8 md:px-16 overflow-hidden">
        <div className="pointer-events-none absolute -top-20 -left-10 w-[400px] h-[400px] ambient-glow opacity-50"></div>

        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <Reveal>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse inline-block"></span>
                <span className="text-ink-subtle text-[10px] uppercase tracking-[0.3em]">Available Now</span>
              </div>
              <p className="text-ink font-black text-2xl md:text-3xl mb-1 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                Questions about <span className="text-grad-ember">{machine.name}?</span>
              </p>
              <p className="text-ink-muted text-sm">Our team will help you find the right machine for your operation.</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex items-center gap-3 shrink-0">
              <Magnetic strength={0.3}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center gap-2 pl-6 pr-2 h-12 bg-ink text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-red transition-colors duration-300 cursor-pointer"
                >
                  Contact Us
                  <span className="w-9 h-9 flex items-center justify-center bg-brand-red rounded-full transition-transform duration-300 group-hover:bg-white">
                    <i className="ri-arrow-right-line text-base text-white group-hover:text-brand-red transition-colors"></i>
                  </span>
                </Link>
              </Magnetic>
              <Link
                to="/parts"
                className="px-7 h-12 border border-canvas-edge text-ink-muted font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:border-ink hover:text-ink inline-flex items-center transition-colors cursor-pointer whitespace-nowrap"
              >
                Browse Parts
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
