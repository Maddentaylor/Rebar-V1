import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SchiltPartnerBadge from "@/components/feature/SchiltPartnerBadge";
import { COMPANY, SCHILT_PARTNER_ABOUT_ROUTE, companyOperatingYears } from "@/data/company";

// Magazine-cover hero. Single full-bleed photograph, restrained editorial
// type at the bottom-left, and the vertical RMS mark used as a "spine" on
// the right edge — the way a magazine puts the masthead down the gutter.
export default function Hero() {
  const yearsOp = companyOperatingYears();
  const spineVolume = Math.max(1, yearsOp + 1);

  return (
    <section className="relative w-full overflow-hidden bg-ink-deep">
      {/* Full viewport height — no max-height cap so tall viewports don&apos;t
          show a band of the next section (canvas) above the fold. */}
      <div className="relative w-full h-[100svh] min-h-[640px]">
        {/* Single hero photograph — premium product photography of a rebar machine. */}
        <motion.img
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          src="https://readdy.ai/api/search-image?query=cinematic%20wide%20angle%20professional%20photograph%20of%20a%20single%20industrial%20rebar%20bending%20machine%20in%20clean%20modern%20metal%20fabrication%20workshop%20dramatic%20studio%20lighting%20premium%20industrial%20product%20photography%20realistic%20editorial%20composition&width=1920&height=1200&seq=hero-magcover&orientation=landscape"
          alt="RMS rebar machinery"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Soft gradient at the bottom for legibility — restrained, not heavy. */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none"></div>
        {/* Tiny vignette top so the navbar reads against the photo */}
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>
        {/* Right-side darkening gradient — wide enough on xl for the tall masthead */}
        <div className="absolute inset-y-0 right-0 w-[min(100%,36rem)] xl:w-[min(100%,48rem)] bg-gradient-to-l from-black/85 via-black/40 to-transparent pointer-events-none"></div>

        {/* Vertical RMS mark — full-height flex centering, nudged up; padding matches hero copy */}
        <div className="hidden md:flex absolute inset-0 pointer-events-none items-center justify-end pr-6 md:pr-12 lg:pr-16">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-end gap-3 lg:gap-4 shrink-0 -translate-y-[clamp(2rem,7vh,5rem)]"
          >
            <span className="text-white/55 text-[10px] font-bold uppercase tracking-[0.5em] text-right">
              Vol. {spineVolume} · Est. {COMPANY.foundedYear}
            </span>
            <div className="relative">
              <span className="absolute inset-0 -m-10 bg-brand-red/25 blur-3xl pointer-events-none"></span>
              <img
                src="/rms-logo-vertical.png"
                alt="RMS · Rebar Machine Service"
                className="relative block h-[min(53vh,27rem)] md:h-[min(57vh,30rem)] lg:h-[min(62vh,35rem)] xl:h-[min(66vh,40rem)] max-h-[calc(100svh-9.5rem)] w-auto object-contain object-right mix-blend-screen drop-shadow-[0_20px_40px_rgba(0,0,0,0.55)]"
              />
            </div>
          </motion.div>
        </div>

        {/* Page indicator — left edge, vertical orientation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="hidden lg:flex absolute left-6 top-1/2 -translate-y-1/2 flex-col items-center gap-3"
        >
          <span className="font-mono text-white/40 text-[10px] font-bold tracking-[0.4em] [writing-mode:vertical-rl] rotate-180">
            01 — Cover
          </span>
          <span className="w-px h-16 bg-white/30"></span>
        </motion.div>

        {/* Text block — bottom-left magazine style, left-aligned at all breakpoints */}
        <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 lg:px-16 pb-28 md:pb-36">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex items-center gap-3 mb-6"
              >
                <span className="w-8 h-px bg-brand-red shrink-0"></span>
                <span className="text-white text-[11px] font-bold uppercase tracking-[0.4em]">
                  RMS · Rebar Machine Service · Since {COMPANY.foundedYear}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
                className="text-white font-black tracking-tightest leading-[0.95]"
                style={{
                  fontFamily: "'Inter', 'DM Sans', sans-serif",
                  fontSize: "clamp(2.5rem, 5.5vw, 5.25rem)",
                }}
              >
                Built for rebar.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.95 }}
                className="text-white/85 text-base md:text-lg leading-relaxed mt-6 max-w-xl"
              >
                Machines, parts, and hands-on service for the shops that fabricate rebar — trusted across North America since {COMPANY.foundedYear}.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.1 }}
                className="flex flex-col sm:flex-row gap-3 mt-9"
              >
                <Link
                  to="/machines"
                  className="group inline-flex items-center justify-center gap-3 pl-7 pr-3 h-12 bg-white text-ink font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-red hover:text-white transition-all duration-300 cursor-pointer"
                >
                  View Machines
                  <span className="w-9 h-9 flex items-center justify-center bg-brand-red text-white rounded-full transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white group-hover:text-brand-red">
                    <i className="ri-arrow-right-line text-base"></i>
                  </span>
                </Link>
                <a
                  href={COMPANY.phoneMachinesSalesTel}
                  className="group inline-flex items-center justify-center gap-3 px-7 h-12 border border-white/40 text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-white/10 hover:border-white transition-all duration-300 cursor-pointer"
                >
                  <i className="ri-phone-line text-base"></i>
                  {COMPANY.phoneMachinesSalesDisplay}
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 1.15, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 sm:mt-8"
              >
                <SchiltPartnerBadge context="hero" />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Cover-lines band — runs edge-to-edge along the bottom of the hero,
            magazine-cover style. Holds the credentials strip on the left and
            the Schilt partnership credit on the right. */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.25, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 bottom-0 h-16 md:h-[4.5rem] bg-black/55 backdrop-blur-md border-t border-white/15"
        >
          <div className="max-w-7xl mx-auto h-full px-6 md:px-12 lg:px-16 flex items-center justify-between gap-4">
            {/* Left — credentials strip with bullet separators */}
            <ul className="flex items-center gap-3 md:gap-5 overflow-hidden">
              {[
                { v: `Est. ${COMPANY.foundedYear}`, l: "Las Vegas, NV" },
                { v: "20+",            l: "Machines"         },
                { v: "500+",           l: "Parts in Stock"   },
              ].map((s, i, arr) => (
                <li key={s.l} className="flex items-center gap-3 md:gap-5 shrink-0">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-white text-sm md:text-base font-black tracking-tight leading-none"
                      style={{ fontFamily: "'Inter', sans-serif" }}
                    >
                      {s.v}
                    </span>
                    <span className="hidden md:inline text-white/55 text-[9px] font-bold uppercase tracking-[0.3em]">
                      {s.l}
                    </span>
                  </div>
                  {i < arr.length - 1 && <span className="w-px h-4 bg-white/20"></span>}
                </li>
              ))}
            </ul>

            {/* Right — Schilt partnership credit */}
            <Link
              to={SCHILT_PARTNER_ABOUT_ROUTE}
              className="hidden md:inline-flex shrink-0 items-center gap-3 group cursor-pointer"
            >
              <span className="w-8 h-px bg-brand-red transition-all duration-300 group-hover:w-12"></span>
              <span className="flex items-baseline gap-2">
                <span className="text-white/55 text-[9px] font-bold uppercase tracking-[0.4em]">
                  Authorized Partner
                </span>
                <span
                  className="text-white text-sm font-black tracking-tight"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Schilt Engineering
                </span>
              </span>
              <i className="ri-arrow-right-line text-white/55 text-sm transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5"></i>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
