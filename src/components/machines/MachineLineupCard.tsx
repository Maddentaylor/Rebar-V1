import { Link } from "react-router-dom";
import type { Machine } from "@/mocks/machines";
import { getMachineLineupHref, isExternalMachineLine, isSchiltMachineLine } from "@/mocks/machines";
import { SCHILT } from "@/data/company";
import { MachineCardMedia } from "@/components/machines/MachineCardMedia";
import Tilt from "@/components/motion/Tilt";

/** Fixed lineup dimensions — keep every card in the grid identical. */
export const LINEUP_MEDIA_HEIGHT = "h-[15rem]";
const LINEUP_BODY_MIN_H = "min-h-[10.25rem]";

type MachineLineupCardProps = {
  machine: Machine;
  index: number;
  total: number;
  /** Badge in media corner: `01` vs `01 / 12` */
  indexLabel?: "ordinal" | "fraction";
  tiltMax?: number;
  tiltLiftZ?: number;
};

export default function MachineLineupCard({
  machine,
  index,
  total,
  indexLabel = "ordinal",
  tiltMax = 6,
  tiltLiftZ = 16,
}: MachineLineupCardProps) {
  const subCount = machine.subProducts?.length ?? 0;
  const external = isExternalMachineLine(machine);
  const schiltLine = isSchiltMachineLine(machine);
  const machineHref = getMachineLineupHref(machine);
  const showSchiltEyebrow = schiltLine && !external;

  const cardBody = (
    <>
      <MachineCardMedia
        src={machine.image}
        alt={machine.name}
        className={`${LINEUP_MEDIA_HEIGHT} shrink-0 w-full`}
        lineCoverZoom={machine.lineCardCoverZoom}
        lineCoverObjectPosition={machine.lineCardCoverObjectPosition}
        variant={machine.lineCardVariant}
        lineCardLogoScale={machine.lineCardLogoScale}
      >
        <div className="absolute top-3 left-3 z-20 inline-flex items-center gap-2 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur-md ring-1 ring-white/12">
          <span className="h-1.5 w-1.5 rounded-full bg-brand-red"></span>
          <span
            className={
              indexLabel === "fraction"
                ? "font-mono text-[10px] font-bold tracking-[0.28em] text-white/90"
                : "text-[10px] font-bold uppercase tracking-[0.25em] text-white/92"
            }
          >
            {indexLabel === "fraction"
              ? `${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}`
              : String(index + 1).padStart(2, "0")}
          </span>
        </div>

        {subCount > 1 && (
          <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-white shadow-sm">
            <i className="ri-stack-line text-[11px]"></i>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{subCount} models</span>
          </div>
        )}

        {external && (
          <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-[#1e4a8c] px-2.5 py-1 text-white shadow-sm">
            <i className="ri-external-link-line text-[11px]"></i>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Schilt</span>
          </div>
        )}

        {showSchiltEyebrow && (
          <div className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-brand-red px-2.5 py-1 text-white shadow-sm">
            <i className="ri-award-fill text-[11px]"></i>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Schilt</span>
          </div>
        )}
      </MachineCardMedia>

      <div className={`flex flex-1 flex-col p-5 ${LINEUP_BODY_MIN_H}`}>
        <p
          className={`mb-1.5 min-h-[1.125rem] text-[10px] font-bold uppercase tracking-[0.22em] ${
            showSchiltEyebrow ? "text-[#1e4a8c]" : "invisible"
          }`}
          aria-hidden={!showSchiltEyebrow}
        >
          Engineered by Schilt
        </p>

        <h3
          className="mb-2 min-h-[3.25rem] line-clamp-2 text-xl font-black leading-tight tracking-tight text-ink"
          style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
        >
          {machine.name}
        </h3>

        <p className="mb-4 min-h-[2.75rem] flex-1 line-clamp-2 text-sm leading-relaxed text-ink-muted">
          {machine.shortDesc}
        </p>

        <div className="mt-auto flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-brand-red">
          <span>{external ? `Visit ${SCHILT.websiteHost}` : "View Details"}</span>
          <i
            className={`${external ? "ri-external-link-line" : "ri-arrow-right-line"} transition-transform duration-300 group-hover:translate-x-1`}
          ></i>
        </div>
      </div>

      <span className="absolute bottom-0 left-0 right-0 h-[3px] origin-left scale-x-0 bg-brand-red transition-transform duration-500 group-hover:scale-x-100"></span>
    </>
  );

  return (
    <Tilt
      max={tiltMax}
      liftZ={tiltLiftZ}
      glare
      className="group relative h-full cursor-pointer overflow-hidden rounded-2xl border border-canvas-edge/70 bg-white shadow-soft transition-shadow duration-300 hover:border-canvas-edge hover:shadow-card"
    >
      {external ? (
        <a href={machineHref} target="_blank" rel="noopener noreferrer" className="flex h-full flex-col">
          {cardBody}
        </a>
      ) : (
        <Link to={machineHref} className="flex h-full flex-col">
          {cardBody}
        </Link>
      )}
    </Tilt>
  );
}
