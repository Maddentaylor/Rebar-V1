import { Link } from "react-router-dom";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { machines } from "@/mocks/machines";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Tilt from "@/components/motion/Tilt";
import Magnetic from "@/components/motion/Magnetic";
import SchiltAboutHero from "./SchiltAboutHero";
import { COMPANY, companyOperatingYears } from "@/data/company";

const whatWeDo = [
  {
    icon: "ri-tools-line",
    number: "01",
    title: "Machines",
    body: "A full lineup of rebar machinery — benders, shears, shearlines, radius formers, spiral winders, lifting, and controllers — engineered for high-volume fabrication shops.",
  },
  {
    icon: "ri-box-3-line",
    number: "02",
    title: "Parts",
    body: "Hundreds of genuine replacement parts in stock, ready to ship. Most orders leave our Las Vegas warehouse within 24 hours so your floor stays productive.",
  },
  {
    icon: "ri-customer-service-2-line",
    number: "03",
    title: "Service & Support",
    body: "Hands-on technical support from people who have spent decades around these machines. Installation, training, and remote diagnostics when you need them.",
  },
];

export default function AboutPage() {
  const yearsOp = companyOperatingYears();
  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="relative pt-36 md:pt-44 pb-16 px-6 overflow-hidden bg-warm-fade" id="about-intro">
        <div className="pointer-events-none absolute -top-24 -left-32 w-[680px] h-[680px] ambient-glow opacity-60"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          <Reveal delay={0}>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">About RMS</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="text-ink font-black tracking-tightest leading-[0.95]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Built by fabricators,<br />
              <span className="text-grad-ember">for fabricators.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="w-20 h-1 bg-brand-red mt-6"></div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-ink-muted text-base md:text-lg max-w-xl mt-6">
              More than six decades supplying, servicing, and supporting the machines that keep rebar fabrication shops running across North America.
            </p>
          </Reveal>

          <Reveal delay={0.23}>
            <div className="mt-10 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
              {[
                { fig: `${yearsOp}+`, sub: "Years serving shops", icon: "ri-timer-flash-line" },
                { fig: "Las Vegas", sub: "Parts & ops hub", icon: "ri-map-pin-line" },
                { fig: `${machines.length}`, sub: "Machine lines", icon: "ri-building-2-line" },
              ].map((item) => (
                <div
                  key={item.sub}
                  className="flex items-start gap-3 rounded-xl border-2 border-canvas-edge bg-canvas px-4 py-4 shadow-soft"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red text-lg text-white">
                    <i className={item.icon} aria-hidden />
                  </span>
                  <div>
                    <p className="text-lg font-black leading-none text-ink tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                      {item.fig}
                    </p>
                    <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-ink-subtle">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Our Story */}
      <section id="about-story" className="bg-canvas py-24 px-6 scroll-mt-28">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div>
              <div className="inline-flex items-center gap-3 mb-5">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Our Story</span>
              </div>
              <h2
                className="text-4xl md:text-6xl font-black text-ink leading-[0.95] mb-4 tracking-tightest"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                A straightforward<br />
                <span className="text-grad-ember">approach to hard work.</span>
              </h2>
              <p className="text-ink-muted text-base leading-relaxed mb-4">
                RMS Rebar Machine Service was founded by people who grew up on shop floors. We know what it costs when a bender goes down in the middle of a production run, and we know what it means to have the right part arrive the next morning.
              </p>
              <p className="text-ink-muted text-base leading-relaxed mb-4">
                Today we supply a full lineup of rebar fabrication machinery — from light benders to fully automated shear and bending lines — backed by one of the deepest parts inventories in the industry.
              </p>
              <p className="text-ink-muted text-base leading-relaxed mb-4">
                For specification-grade automation we&apos;re backed by{" "}
                <a
                  href="#schilt-partner"
                  className="font-semibold text-ink underline decoration-brand-red/35 underline-offset-[3px] transition-colors hover:text-brand-red"
                >
                  Schilt Engineering
                </a>{" "}
                in the Netherlands—see the partnership block below for detail.
              </p>
              <p className="text-ink-subtle text-sm leading-relaxed">
                We stay small on purpose. When you call, you talk to someone who knows the machines, knows your shop, and can make a decision. That&apos;s the standard we&apos;ve held for over {yearsOp} years, and it&apos;s the standard that keeps our customers coming back.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Tilt
              max={5}
              liftZ={20}
              glare
              className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-card"
            >
              <img
                src="https://readdy.ai/api/search-image?query=experienced%20industrial%20worker%20in%20rebar%20fabrication%20shop%20inspecting%20heavy%20bending%20machine%20with%20hands%20on%20controls%2C%20authentic%20documentary%20portrait%2C%20warm%20natural%20lighting%2C%20professional%20industrial%20photography&width=900&height=800&seq=aboutstory&orientation=portrait"
                alt="RMS technician at work"
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/85 via-black/20 to-transparent">
                <p className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-1">Since {COMPANY.foundedYear}</p>
                <p className="text-white text-lg font-bold tracking-tight" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Las Vegas, Nevada
                </p>
              </div>
            </Tilt>
          </Reveal>
        </div>
      </section>

      {/* What We Do */}
      <section id="about-capabilities" className="bg-canvas-raised py-24 md:py-28 px-6 relative overflow-hidden scroll-mt-28">
        <div className="pointer-events-none absolute top-0 right-0 h-[420px] w-[420px] ambient-glow opacity-[0.22]"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
            <div>
              <Reveal>
                <div className="inline-flex items-center gap-3 mb-4">
                  <span className="w-8 h-px bg-brand-red"></span>
                  <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">What We Do</span>
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2
                  className="text-4xl md:text-6xl font-black text-ink tracking-tightest leading-[0.95]"
                  style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                >
                  Three things.<br /><span className="text-grad-ember">Done well.</span>
                </h2>
              </Reveal>
            </div>
            <Reveal delay={0.15}>
              <p className="text-ink-muted text-sm max-w-xs leading-relaxed">
                We don&apos;t try to be everything. We focus on the equipment, parts, and support that keep fabrication shops producing.
              </p>
            </Reveal>
          </div>

          <Stagger stagger={0.1} amount={0.15} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {whatWeDo.map((item) => (
              <RevealItem key={item.number}>
                <Tilt
                  max={6}
                  liftZ={18}
                  className="relative bg-canvas border border-canvas-edge rounded-2xl p-9 flex flex-col group cursor-default shadow-soft hover:shadow-card hover:border-brand-red/30 transition-all duration-300"
                >
                  <span className="display-backdrop absolute top-3 right-5 text-[110px] text-canvas-edge leading-none">
                    {item.number}
                  </span>
                  <div className="relative z-10 w-16 h-16 flex items-center justify-center bg-brand-red rounded-2xl mb-7 shadow-ember group-hover:scale-105 transition-transform duration-300">
                    <i className={`${item.icon} text-white text-2xl`}></i>
                  </div>
                  <h3
                    className="relative z-10 text-ink text-2xl md:text-3xl font-black mb-3 leading-tight tracking-tight"
                    style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="relative z-10 text-ink-muted text-sm leading-relaxed">{item.body}</p>
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-brand-red rounded-b-2xl scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></span>
                </Tilt>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      <SchiltAboutHero className="border-t border-canvas-edge scroll-mt-24" />

      {/* By the Numbers */}
      <section id="about-numbers" className="border-t border-canvas-edge bg-canvas-raised px-6 py-20 scroll-mt-28 md:py-24">

        <div className="mx-auto max-w-7xl">
          <div className="mb-10">
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-3">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">By the Numbers</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2
                className="text-3xl font-black leading-[0.98] tracking-tightest text-ink md:text-5xl"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                {`${yearsOp}+ years.`}{" "}
                <span className="text-grad-ember">Thousands of orders.</span>
              </h2>
            </Reveal>
          </div>

          <Stagger stagger={0.08} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: `${yearsOp}+`, label: "Years in Business", tag: `Est. ${COMPANY.foundedYear}` },
              { value: `${machines.length}`, label: "Machine Lines",     tag: "Catalog depth" },
              { value: "500+",               label: "Parts in Stock",    tag: "Ready to ship" },
              { value: "48hr",               label: "Typical dispatch",  tag: "Parts turnaround" },
            ].map((stat, i) => (
              <RevealItem key={stat.label}>
                <div className="relative h-full overflow-hidden rounded-2xl border-2 border-canvas-edge bg-ink-deep p-6 text-white shadow-card ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-xl md:p-7">
                  <span className="pointer-events-none absolute -right-1 top-2 text-6xl font-black leading-none text-white/[0.06]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="inline-block rounded-sm bg-brand-red px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.15em] text-white">
                    {stat.tag}
                  </span>
                  <p
                    className="relative mt-4 text-4xl font-black leading-[0.95] tracking-tightest text-white md:text-5xl"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {stat.value}
                  </p>
                  <p className="relative mt-2 text-[11px] font-bold uppercase tracking-[0.28em] text-white/55">
                    {stat.label}
                  </p>
                  <div className="relative mt-4 h-1 w-12 rounded-full bg-gradient-to-r from-brand-red to-brand-glow" />
                </div>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="relative bg-ink-deep py-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-ember-radial pointer-events-none"></div>
        <div className="absolute top-[10%] right-[8%] w-[420px] h-[420px] ambient-glow animate-blob pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Reveal>
            <div>
              <h2
                className="text-3xl md:text-5xl font-black text-white mb-3 tracking-tightest leading-[0.95]"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                Ready to <span className="text-grad-ember">talk?</span>
              </h2>
              <p className="text-white/75 text-base md:text-lg max-w-lg">
                Call with a part number, a machine model, or just a question. A real person picks up.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3">
              <Magnetic strength={0.35}>
                <Link
                  to="/contact"
                  className="group inline-flex items-center justify-center gap-3 pl-7 pr-3 h-14 bg-brand-red text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-glow hover:shadow-glow transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Contact RMS
                  <span className="w-9 h-9 flex items-center justify-center bg-white text-brand-red rounded-full transition-transform duration-300 group-hover:translate-x-0.5">
                    <i className="ri-arrow-right-line text-base"></i>
                  </span>
                </Link>
              </Magnetic>
              <Link
                to="/machines"
                className="inline-flex items-center justify-center gap-2 px-7 h-14 border border-white/30 text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:border-white hover:bg-white/5 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                Browse Machines
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
