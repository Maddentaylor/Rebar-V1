import { Link } from "react-router-dom";
import SchiltWordmark from "@/components/feature/SchiltWordmark";
import { SCHILT_PARTNER_ABOUT_ROUTE } from "@/data/company";

const SCHILT_SITE = "https://www.schiltbv.nl/";

const heroMarkClass =
  "shrink-0 w-auto max-w-[min(100%,34rem)] h-[4.5rem] sm:h-20 md:h-24 lg:h-28 xl:h-[7rem]";

const footerMarkClass =
  "shrink-0 w-auto max-w-[min(100%,34rem)] h-16 sm:h-[4.75rem] md:h-24 lg:h-[6.5rem]";

type SchiltPartnerBadgeProps = {
  context: "hero" | "footer";
  className?: string;
};

export default function SchiltPartnerBadge({ context, className = "" }: SchiltPartnerBadgeProps) {
  if (context === "footer") {
    return (
      <div
        className={`rounded-xl border border-white/10 bg-white/[0.04] backdrop-blur-sm shadow-soft px-3 sm:px-4 py-1.5 sm:py-2 ${className}`}
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <span
              className="hidden sm:block w-1 h-11 sm:h-14 md:h-16 shrink-0 rounded-full bg-gradient-to-b from-brand-red to-brand-ruby self-center"
              aria-hidden
            />
            <div className="min-w-0 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-white/45 sm:whitespace-nowrap shrink-0">
                Proud partner
              </p>
      <SchiltWordmark className={footerMarkClass} />
              <p className="text-white/60 text-xs sm:text-sm leading-snug lg:max-w-md xl:max-w-lg min-w-0">
                Authorized North American partner — precision rebar machinery and engineering from Schilt
                Engineering, Netherlands.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0 lg:border-l lg:border-white/10 lg:pl-5">
            <Link
              to={SCHILT_PARTNER_ABOUT_ROUTE}
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85 hover:border-brand-red/50 hover:bg-brand-red/10 hover:text-white transition-colors cursor-pointer"
            >
              Partnership
              <i className="ri-arrow-right-line text-sm" />
            </Link>
            <a
              href={SCHILT_SITE}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/85 hover:border-white/35 hover:text-white transition-colors cursor-pointer"
            >
              schiltbv.nl
              <i className="ri-external-link-line text-sm" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex w-fit max-w-full flex-row items-center gap-2 sm:gap-3 ${className}`}>
      <span className="sr-only">Proud partner of Schilt Engineering</span>
      <span
        className="hidden sm:block w-0.5 self-stretch min-h-[2.75rem] max-h-[6.5rem] shrink-0 rounded-full bg-gradient-to-b from-brand-red/40 via-brand-red to-brand-ruby/60"
        aria-hidden
      />
      <SchiltWordmark className={heroMarkClass} />
      <div className="flex shrink-0 flex-col gap-1 border-l border-white/20 pl-2.5 sm:pl-3">
        <a
          href={SCHILT_SITE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white cursor-pointer"
        >
          schiltbv.nl
          <i className="ri-external-link-line text-xs" />
        </a>
        <Link
          to={SCHILT_PARTNER_ABOUT_ROUTE}
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/65 transition-colors hover:text-white cursor-pointer"
        >
          Why we partner
          <i className="ri-arrow-right-line text-xs" />
        </Link>
      </div>
    </div>
  );
}
