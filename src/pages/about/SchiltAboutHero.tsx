import { Link } from "react-router-dom";
import { SCHILT } from "@/data/company";
import SchiltWordmark from "@/components/feature/SchiltWordmark";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";

/** Schilt block — brand palette: royal blue, bright yellow, charcoal, olive & rust accents. */
const A = {
  gold: "#FBEA02",
  goldBright: "#FBEA02",
  inkOnGold: "#282727",
  gradFrom: "#1560B2",
  gradVia: "#0f4a8a",
  gradTo: "#0a2f5c",
  gradDeepFrom: "#0f4a8a",
  gradDeepTo: "#282727",
  panel: "rgba(40, 39, 39, 0.76)",
  olive: "#B0A51D",
  rust: "#8F3317",
} as const;

const schiltProducts = [
  { id: "dbs3-60n", parent: "automation", label: "DBS3-60N Double Bending Line" },
  { id: "pile-cage-machines", parent: "automation", label: "SLP Pile Cage Machines" },
  { id: "sbr60", parent: "rms-radius", label: "SBR Radius Bender (Schilt SBR60)" },
];

/** Gold bar ≈ 40% of logo height at each breakpoint (logo uses the same scale ladder). */
const LOGO_BAR_HEIGHT =
  "h-[2.6rem] sm:h-[3.35rem] md:h-[4.55rem] lg:h-[5.35rem] xl:h-[5.95rem]";

type SchiltAboutHeroProps = {
  className?: string;
};

export default function SchiltAboutHero({ className = "" }: SchiltAboutHeroProps) {
  return (
    <section id="schilt-partner" className={`relative scroll-mt-24 ${className}`}>
      <div className="overflow-hidden rounded-t-2xl md:rounded-t-[1.75rem]">
        {/* Full-width white band — partner label + logo */}
        <div className="border-b border-[rgba(21,96,178,0.14)] bg-[#F9FAF9]">
          <div className="mx-auto max-w-7xl px-6 pb-1 pt-3 md:px-10 md:pt-4 lg:px-12">
            <Reveal>
              <div className="flex flex-wrap items-center gap-2.5 border-b border-[rgba(21,96,178,0.1)] pb-2.5 leading-snug">
                <span
                  className="rounded-md px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.2em]"
                  style={{ backgroundColor: A.rust, color: "#F9FAF9" }}
                >
                  Partner
                </span>
                <span className="max-w-[65ch] text-[11px] font-semibold uppercase leading-snug tracking-[0.14em] text-[#282727]">
                  Schilt Engineering · North America
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-1.5 inline-flex items-center gap-2 leading-none sm:mt-2 sm:gap-3 [&_img]:block">
                <span
                  className={`hidden w-1 shrink-0 rounded-full sm:block ${LOGO_BAR_HEIGHT}`}
                  style={{ backgroundColor: A.gold }}
                  aria-hidden
                />
                <SchiltWordmark
                  elevateOnBlue={false}
                  className="h-[min(6.5rem,46vw)] w-auto max-w-full object-left object-contain sm:h-[min(8.5rem,40vw)] md:h-[11.5rem] lg:h-[13.5rem] xl:h-[15rem]"
                />
              </div>
            </Reveal>
          </div>
        </div>

        <div
          className="relative overflow-hidden px-6 py-14 md:px-10 md:py-16 lg:px-12"
          style={{
            background: `linear-gradient(135deg, ${A.gradFrom} 0%, ${A.gradVia} 48%, ${A.gradTo} 100%)`,
          }}
        >
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 85% 55% at 90% -5%, rgba(251,234,2,0.11), transparent 52%)",
            }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_0%_100%,rgba(0,0,0,0.2),transparent_48%)]"
            aria-hidden
          />

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[1fr_min(360px,100%)] lg:items-start lg:gap-12">
            <Reveal delay={0.07}>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.42em]" style={{ color: A.goldBright }}>
                  Who we are
                </p>
                <h2
                  className="mt-3 max-w-3xl text-[clamp(1.5rem,3vw,2.4rem)] font-black uppercase leading-[1.06] tracking-tight text-white"
                  style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
                >
                  <span style={{ color: A.goldBright }}>Leading</span>
                  <span className="text-white"> innovation</span>
                  <span className="mt-2 block text-sm font-semibold normal-case tracking-normal text-white/90 md:text-base">
                    In the automation of rebar processing
                  </span>
                </h2>

                <div
                  className="mt-6 rounded-xl bg-black/22 px-5 py-4 ring-1 ring-white/10 md:px-6 md:py-5"
                  style={{ borderLeftWidth: 4, borderLeftColor: A.gold }}
                >
                  <p className="text-[11px] font-black uppercase tracking-[0.2em]" style={{ color: A.goldBright }}>
                    Core business
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-white md:text-[0.9375rem]">
                    {SCHILT.specialty}
                  </p>
                </div>

                <div className="mt-6 max-w-2xl space-y-4 text-sm md:text-[0.9375rem]">
                  <p className="font-medium leading-[1.65] text-white">
                    RMS is Schilt&apos;s authorized North American partner—sales, installation, genuine parts, and
                    field support in one call.
                  </p>
                  <p className="leading-[1.65] text-white/90">{SCHILT.about}</p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.09}>
              <div className="flex flex-col gap-4">
                <aside
                  className="rounded-xl border-2 p-5 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-sm md:p-6"
                  style={{ borderColor: A.olive, backgroundColor: A.panel }}
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.35em]" style={{ color: A.goldBright }}>
                    Known for
                  </p>
                  <p className="mt-3 text-sm font-semibold leading-relaxed text-white">{SCHILT.knownFor}</p>
                  <p className="mt-3 border-t border-white/15 pt-3 text-xs leading-relaxed text-white/80">
                    {SCHILT.market}
                  </p>
                </aside>
                <aside className="rounded-xl border border-white/18 bg-white/[0.06] p-5 md:p-6">
                  <div className="flex items-start gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg"
                      style={{ backgroundColor: A.gold, color: A.inkOnGold }}
                    >
                      <i className="ri-building-4-line" aria-hidden />
                    </span>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-white/75">Facility</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/92">{SCHILT.facility}</p>
                      <p className="mt-2 text-xs leading-relaxed text-white/75">{SCHILT.locationBlurb}</p>
                    </div>
                  </div>
                </aside>
                <a
                  href={SCHILT.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SCHILT.shortName} website (opens in new tab)`}
                  className="group relative flex w-full items-center justify-between gap-4 overflow-hidden rounded-xl border border-white/18 border-l-4 px-5 py-4 shadow-[0_12px_36px_rgba(7,20,45,0.38)] ring-1 ring-white/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-px hover:border-white/[0.22] hover:shadow-[0_16px_44px_rgba(7,20,45,0.48)] hover:ring-white/[0.14]"
                  style={{
                    borderLeftColor: A.gold,
                    background: `linear-gradient(122deg, rgba(251,234,2,0.09) 0%, rgba(21,96,178,0.13) 32%, rgba(255,255,255,0.045) 56%, rgba(15,30,55,0.35) 100%)`,
                  }}
                >
                  <span
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_80%_at_0%_50%,rgba(251,234,2,0.14),transparent_58%)] opacity-90"
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#1560B2]/[0.12] via-transparent to-black/25"
                    aria-hidden
                  />
                  <span
                    className="pointer-events-none absolute inset-x-5 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    aria-hidden
                  />
                  <div className="relative min-w-0 flex-1 text-left">
                    <p
                      className="text-[10px] font-black uppercase tracking-[0.32em] drop-shadow-[0_1px_8px_rgba(0,0,0,0.35)]"
                      style={{ color: A.goldBright }}
                    >
                      Schilt · Netherlands
                    </p>
                    <p className="mt-1.5 truncate text-sm font-semibold leading-snug text-white drop-shadow-sm">
                      {SCHILT.websiteHost}
                    </p>
                    <p className="mt-0.5 text-[11px] font-medium leading-snug text-white/52 transition-colors duration-300 group-hover:text-white/68">
                      Open in new tab
                    </p>
                  </div>
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/24 bg-white/[0.04] text-white shadow-[0_4px_16px_rgba(0,0,0,0.28)] transition-all duration-300 group-hover:border-[#FBEA02] group-hover:bg-[#FBEA02] group-hover:text-[#282727] group-hover:shadow-[0_6px_22px_rgba(251,234,2,0.28)]">
                    <i className="ri-arrow-right-up-line text-lg transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px" aria-hidden />
                  </span>
                </a>
              </div>
            </Reveal>
            </div>
          </div>
        </div>
      </div>

      <div
        id="schilt-lines"
        className="relative border-t-4 px-6 py-12 md:px-10 md:py-14 lg:px-12"
        style={{
          borderTopColor: A.gold,
          background: `linear-gradient(180deg, ${A.gradDeepFrom} 0%, ${A.gradDeepTo} 100%)`,
        }}
      >
        <div className="pointer-events-none absolute right-6 top-10 hidden text-8xl font-black uppercase leading-none text-white/[0.04] md:block">
          Lines
        </div>
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <p className="text-[10px] font-black uppercase tracking-[0.4em]" style={{ color: A.goldBright }}>
                Equipment
              </p>
              <h3
                className="mt-1 text-2xl font-black uppercase tracking-tight text-white md:text-3xl"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Schilt lines we represent
              </h3>
            </Reveal>
            <Reveal delay={0.05}>
              <div
                className="flex h-14 min-w-[5.5rem] shrink-0 items-center justify-center rounded-lg border-2 px-4 text-center"
                style={{ borderColor: A.olive, backgroundColor: "rgba(251, 234, 2, 0.12)" }}
              >
                <div>
                  <p className="text-2xl font-black leading-none" style={{ color: A.goldBright }}>
                    {schiltProducts.length}
                  </p>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-white/78">lines</p>
                </div>
              </div>
            </Reveal>
          </div>

          <Stagger
            stagger={0.05}
            className="mt-8 overflow-hidden rounded-xl border-2 border-white/14 bg-[rgba(40,39,39,0.5)]"
          >
            {schiltProducts.map((p, i) => (
              <RevealItem key={p.id}>
                <Link
                  to={`/machines/${p.parent}/${p.id}`}
                  className="group flex items-center gap-4 border-b border-white/10 px-4 py-4 transition-all last:border-b-0 hover:bg-[#FBEA02] hover:pl-5 md:px-6 md:py-5"
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-sm font-black shadow-md transition-colors group-hover:bg-[#282727] group-hover:text-[#FBEA02]"
                    style={{
                      backgroundColor: A.gold,
                      color: A.inkOnGold,
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 text-sm font-bold text-white transition-colors group-hover:text-[#282727] md:text-base">
                    {p.label}
                  </span>
                  <i
                    className="ri-arrow-right-up-line shrink-0 text-xl text-[#FBEA02] transition-transform group-hover:translate-x-0.5 group-hover:text-[#282727]"
                  />
                </Link>
              </RevealItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
