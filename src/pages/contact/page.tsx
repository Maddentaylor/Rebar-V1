import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";
import { weHelpWithTopics } from "@/data/weHelpWithTopics";
import { COMPANY } from "@/data/company";

function orderingSteps() {
  const p = COMPANY.phoneMachinesSalesDisplay;
  return [
    {
      step: "01",
      icon: "ri-phone-line",
      title: "Call Us",
      desc: `Quotes, machine purchases, and order info — reach us at ${p}. No bots — a real person picks up.`,
    },
    {
      step: "02",
      icon: "ri-list-check-2",
      title: "Tell Us What You Need",
      desc: "Have your part number, machine model, or a description ready. We'll look it up and confirm availability.",
    },
    {
      step: "03",
      icon: "ri-file-text-line",
      title: "Get a Quote",
      desc: "We'll give you pricing and lead time on the spot. No waiting days for an email back.",
    },
    {
      step: "04",
      icon: "ri-truck-line",
      title: "We Ship It",
      desc: `Once confirmed, we process and ship your order. Parts and machines ship from our ${COMPANY.warehouseCity} facility.`,
    },
  ] as const;
}

export default function ContactPage() {
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />

      {/* Header */}
      <div className="relative pt-36 md:pt-44 pb-16 px-8 md:px-16 overflow-hidden bg-warm-fade">
        <div className="pointer-events-none absolute -top-24 -right-32 w-[640px] h-[640px] ambient-glow opacity-60"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          <Reveal delay={0}>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Get in Touch</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="text-ink font-black leading-[0.95] tracking-tightest"
              style={{ fontFamily: "'Inter', 'DM Sans', sans-serif", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Contact <span className="text-grad-ember">RMS.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="w-20 h-1 bg-brand-red mt-6"></div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-ink-muted text-base md:text-lg mt-6 max-w-xl">
              Call to place orders, ask about machines, or get parts support — a real person picks up.
            </p>
          </Reveal>
        </div>
      </div>

      <section className="bg-canvas py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* How to Order */}
          <div className="mb-24">
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Ordering is Simple</span>
              </div>
            </Reveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
              <Reveal delay={0.05}>
                <h2
                  className="text-3xl md:text-5xl font-black text-ink leading-[1] tracking-tightest"
                  style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                >
                  Call to order — <span className="text-grad-ember">parts &amp; machines.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-ink-muted text-sm max-w-sm leading-relaxed">
                  We don&apos;t have an online checkout. Everything is handled by phone so we can make sure you get exactly what you need.
                </p>
              </Reveal>
            </div>

            <Stagger stagger={0.07} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {orderingSteps().map((item) => (
                <RevealItem key={item.step}>
                  <Tilt
                    max={6}
                    liftZ={14}
                    className="relative bg-canvas-raised border border-canvas-edge rounded-2xl p-7 flex flex-col gap-4 shadow-soft hover:shadow-card hover:border-brand-red/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-12 h-12 flex items-center justify-center bg-brand-red/10 rounded-xl">
                        <i className={`${item.icon} text-brand-red text-xl`}></i>
                      </div>
                      <span className="display-backdrop text-5xl text-canvas-edge">{item.step}</span>
                    </div>
                    <div>
                      <p className="text-ink font-black text-base mb-1.5 tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                        {item.title}
                      </p>
                      <p className="text-ink-muted text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </Tilt>
                </RevealItem>
              ))}
            </Stagger>

            <Reveal>
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 p-7 bg-ink-deep rounded-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-ember-radial pointer-events-none"></div>
                <div className="relative w-12 h-12 flex items-center justify-center shrink-0 bg-white/5 border border-white/10 rounded-xl">
                  <i className="ri-information-line text-brand-red text-xl"></i>
                </div>
                <p className="relative text-white/80 text-sm leading-relaxed text-center sm:text-left flex-1">
                  <strong className="text-white">Not sure what part you need?</strong> Just call us with your machine model or describe the issue. Our team can identify the right part for you.
                </p>
                <Magnetic strength={0.3}>
                  <a
                    href={COMPANY.phoneMachinesSalesTel}
                    className="group relative shrink-0 inline-flex items-center gap-3 pl-6 pr-2 h-12 bg-brand-red hover:bg-brand-glow hover:shadow-glow text-white rounded-full font-bold uppercase tracking-[0.18em] text-[12px] transition-all cursor-pointer whitespace-nowrap"
                  >
                    <i className="ri-phone-fill"></i>
                    Call Now
                    <span className="w-9 h-9 flex items-center justify-center bg-white text-brand-red rounded-full transition-transform duration-300 group-hover:translate-x-0.5">
                      <i className="ri-arrow-right-line text-base"></i>
                    </span>
                  </a>
                </Magnetic>
              </div>
            </Reveal>
          </div>

          {/* Phone + Email cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
            <Reveal>
              <Tilt max={5} liftZ={14} glare className="bg-canvas-raised border border-canvas-edge rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300">
                <a href={COMPANY.phoneMachinesSalesTel} className="group flex flex-col gap-6 p-10 cursor-pointer">
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
                    <p className="text-4xl md:text-5xl font-black text-ink group-hover:text-brand-red transition-colors duration-300 leading-none tracking-tightest" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
                      {COMPANY.phoneMachinesSalesDisplay}
                    </p>
                  </div>
                  <p className="text-ink-subtle text-sm border-t border-canvas-edge pt-4">Available during business hours</p>
                </a>
              </Tilt>
            </Reveal>

            <Reveal delay={0.08}>
              <Tilt max={5} liftZ={14} glare className="bg-canvas-raised border border-canvas-edge rounded-2xl shadow-soft hover:shadow-card transition-shadow duration-300">
                <a href={`mailto:${COMPANY.email}`} className="group flex flex-col gap-6 p-10 cursor-pointer">
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
                    <p className="text-2xl md:text-3xl font-semibold text-ink-muted group-hover:text-brand-red/70 transition-colors duration-300 leading-snug" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
                      {COMPANY.email.split("@")[0]}@
                    </p>
                    <p className="text-2xl md:text-3xl font-black text-ink group-hover:text-brand-red transition-colors duration-300 leading-snug tracking-tightest" style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}>
                      {COMPANY.email.split("@")[1]}
                    </p>
                  </div>
                  <p className="text-ink-subtle text-sm border-t border-canvas-edge pt-4">We reply within one business day</p>
                </a>
              </Tilt>
            </Reveal>
          </div>

          {/* Hours + Help */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
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
                <Stagger stagger={0.05} className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {weHelpWithTopics.map((topic) => (
                    <RevealItem key={topic.label}>
                      <Magnetic strength={0.18} range={6}>
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
                    </RevealItem>
                  ))}
                </Stagger>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
