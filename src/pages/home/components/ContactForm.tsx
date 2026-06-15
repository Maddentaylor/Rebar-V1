import { Link } from "react-router-dom";
import Reveal from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";
import { weHelpWithTopics } from "@/data/weHelpWithTopics";
import { COMPANY } from "@/data/company";

export default function ContactForm() {
  return (
    <>
      <div className="hairline h-px"></div>

      <section className="bg-canvas py-28 md:py-32 px-6 overflow-hidden relative">
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Header */}
          <div className="mb-16">
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
                  Get In Touch
                </span>
              </div>
            </Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <Reveal delay={0.05}>
                <h2
                  className="text-4xl md:text-6xl font-black text-ink leading-[0.98] tracking-tightest"
                  style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                >
                  Contact <span className="text-grad-ember">RMS.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-ink-muted text-sm md:text-base max-w-sm leading-relaxed">
                  A real person picks up. Reach out for quotes, parts, service, or technical questions.
                </p>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <div className="w-20 h-1 bg-brand-red mt-6"></div>
            </Reveal>
          </div>

          {/* Phone + Email cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <Reveal>
              <Tilt
                max={5}
                liftZ={14}
                glare
                className="bg-canvas-raised border border-canvas-edge rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300"
              >
                <a
                  href={COMPANY.phoneMachinesSalesTel}
                  className="group flex flex-col gap-6 p-10 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-brand-red/10 rounded-xl group-hover:bg-brand-red transition-colors duration-300">
                        <i className="ri-phone-line text-brand-red group-hover:text-white text-base transition-colors duration-300"></i>
                      </div>
                      <span className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.3em]">Call Us</span>
                    </div>
                    <i className="ri-arrow-right-up-line text-ink-subtle group-hover:text-brand-red text-xl transition-colors duration-300"></i>
                  </div>
                  <div>
                    <p
                      className="text-4xl md:text-5xl font-black text-ink group-hover:text-brand-red transition-colors duration-300 leading-none tracking-tightest"
                      style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                    >
                      {COMPANY.phoneMachinesSalesDisplay}
                    </p>
                  </div>
                  <p className="text-ink-subtle text-sm border-t border-canvas-edge pt-4">
                    Available during business hours
                  </p>
                </a>
              </Tilt>
            </Reveal>

            <Reveal delay={0.08}>
              <Tilt
                max={5}
                liftZ={14}
                glare
                className="bg-canvas-raised border border-canvas-edge rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300"
              >
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="group flex flex-col gap-6 p-10 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 flex items-center justify-center bg-brand-red/10 rounded-xl group-hover:bg-brand-red transition-colors duration-300">
                        <i className="ri-mail-line text-brand-red group-hover:text-white text-base transition-colors duration-300"></i>
                      </div>
                      <span className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.3em]">Email Us</span>
                    </div>
                    <i className="ri-arrow-right-up-line text-ink-subtle group-hover:text-brand-red text-xl transition-colors duration-300"></i>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p
                      className="text-2xl md:text-3xl font-semibold text-ink-muted group-hover:text-brand-red/70 transition-colors duration-300 leading-snug"
                      style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                    >
                      {COMPANY.email.split("@")[0]}@
                    </p>
                    <p
                      className="text-2xl md:text-3xl font-black text-ink group-hover:text-brand-red transition-colors duration-300 leading-snug tracking-tightest"
                      style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                    >
                      {COMPANY.email.split("@")[1]}
                    </p>
                  </div>
                  <p className="text-ink-subtle text-sm border-t border-canvas-edge pt-4">
                    We reply within one business day
                  </p>
                </a>
              </Tilt>
            </Reveal>
          </div>

          {/* Hours + Help */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <Reveal>
              <div>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-9 h-9 flex items-center justify-center bg-brand-red/10 rounded-xl">
                    <i className="ri-time-line text-brand-red text-sm"></i>
                  </div>
                  <p className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.3em]">Business Hours</p>
                </div>
                <div className="flex flex-col divide-y divide-canvas-edge">
                  <div className="flex justify-between items-center py-5">
                    <span className="text-ink text-lg font-bold leading-none tracking-tight">Mon – Fri</span>
                    <div className="text-right">
                      <span className="text-ink font-semibold text-base block">6:30 am – 3:00 pm</span>
                      <span className="text-ink-subtle text-xs">Pacific Time</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-5">
                    <span className="text-ink text-lg font-bold leading-none tracking-tight">Saturday</span>
                    <div className="text-right">
                      <span className="text-ink-muted font-semibold text-base block">By Appointment</span>
                      <span className="text-ink-subtle text-xs">Call ahead to schedule</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center py-5">
                    <span className="text-ink-muted text-lg font-bold leading-none tracking-tight">Sunday</span>
                    <div className="text-right">
                      <span className="text-ink-subtle font-semibold text-base block">Closed</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div>
                <div className="flex items-center gap-4 mb-7">
                  <div className="w-9 h-9 flex items-center justify-center bg-brand-red/10 rounded-xl">
                    <i className="ri-checkbox-circle-line text-brand-red text-sm"></i>
                  </div>
                  <p className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.3em]">We Help With</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {weHelpWithTopics.map((topic) => (
                    <Magnetic key={topic.label} strength={0.18} range={6}>
                      {topic.to ? (
                        <Link
                          to={topic.to}
                          className="group flex items-center gap-3 px-4 py-3.5 bg-canvas-raised border border-canvas-edge rounded-xl hover:border-brand-red/40 hover:bg-brand-red/5 transition-all duration-300 cursor-pointer"
                        >
                          <div className="w-7 h-7 flex items-center justify-center shrink-0">
                            <i className={`${topic.icon} text-brand-red text-base`}></i>
                          </div>
                          <span className="text-ink font-semibold text-sm group-hover:text-brand-red/90 transition-colors">
                            {topic.label}
                          </span>
                          <i className="ri-arrow-right-line text-ink-subtle text-base ml-auto opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" aria-hidden />
                        </Link>
                      ) : (
                        <div className="flex items-center gap-3 px-4 py-3.5 bg-canvas-raised border border-canvas-edge rounded-xl">
                          <div className="w-7 h-7 flex items-center justify-center shrink-0">
                            <i className={`${topic.icon} text-brand-red text-base`}></i>
                          </div>
                          <span className="text-ink font-semibold text-sm">{topic.label}</span>
                        </div>
                      )}
                    </Magnetic>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
