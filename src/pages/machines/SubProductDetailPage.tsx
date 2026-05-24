import { useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import { machines } from "@/mocks/machines";
import type { CapacityTable, Machine, SubProduct } from "@/mocks/machines";
import { SCHILT_PARTNER_ABOUT_ROUTE } from "@/data/company";
import { parts } from "@/mocks/parts";
import type { PartItem } from "@/mocks/parts";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import SubProductImageGallery from "@/components/machines/SubProductImageGallery";

function PartsTableSection({ partsList, machineName }: { partsList: PartItem[]; machineName: string }) {
  if (partsList.length === 0) return null;

  const grouped = partsList.reduce<Record<string, PartItem[]>>((acc, part) => {
    const cat = part.category || "General";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(part);
    return acc;
  }, {});

  const categories = Object.keys(grouped).sort();

  return (
    <div className="mt-16">
      <Reveal>
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-brand-red"></span>
          <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
            Parts &amp; Accessories · {partsList.length}
          </span>
        </div>
      </Reveal>

      <div className="flex flex-col gap-10">
        {categories.map((cat) => (
          <Reveal key={cat}>
            <div>
              <p className="text-ink text-sm font-black uppercase tracking-[0.25em] mb-3">{cat}</p>
              <div className="overflow-x-auto rounded-2xl border border-canvas-edge shadow-card bg-canvas-raised">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-ink-deep">
                      <th className="px-4 py-3 text-left font-bold uppercase tracking-[0.25em] text-[10px] text-white/40 w-24">Image</th>
                      <th className="px-4 py-3 text-left font-bold uppercase tracking-[0.25em] text-[10px] text-brand-red">Part #</th>
                      <th className="px-4 py-3 text-left font-bold uppercase tracking-[0.25em] text-[10px] text-white/40">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grouped[cat].map((part, ri) => (
                      <tr key={part.id} className={ri % 2 === 0 ? "bg-canvas-raised" : "bg-canvas/60"}>
                        <td className="px-4 py-3">
                          <div className="w-16 h-16 bg-canvas border border-canvas-edge rounded-md overflow-hidden flex items-center justify-center">
                            <img src={part.image} alt={part.name} className="w-full h-full object-contain" />
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className="text-brand-red text-xs font-bold font-mono whitespace-nowrap">{part.partNumber}</span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-ink text-sm font-semibold">{part.name}</span>
                            {part.description && (
                              <span className="text-ink-muted text-xs leading-relaxed">{part.description}</span>
                            )}
                            <span className="text-ink-subtle text-[10px] mt-0.5 uppercase tracking-[0.2em]">{machineName}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-3">
        <Link
          to="/parts"
          className="inline-flex items-center gap-2 text-brand-red text-[11px] font-bold uppercase tracking-[0.3em] hover:text-brand-glow transition-colors cursor-pointer group"
        >
          <span>View Full Parts Catalog</span>
          <i className="ri-arrow-right-line text-sm transition-transform duration-300 group-hover:translate-x-0.5"></i>
        </Link>
      </div>
    </div>
  );
}

function ProductYoutubeEmbed({ videoId, label }: { videoId: string; label: string }) {
  const title = `${label} — product overview video`;
  return (
    <div className="mb-16">
      <Reveal>
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-brand-red"></span>
          <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Watch overview</span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="overflow-hidden rounded-2xl border border-canvas-edge shadow-card bg-ink-deep">
          <div className="relative aspect-video w-full">
            <iframe
              src={`https://www.youtube.com/embed/${encodeURIComponent(videoId)}?rel=0`}
              className="absolute inset-0 h-full w-full"
              title={title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function CapacityTableSection({ table }: { table: CapacityTable }) {
  return (
    <div className="mt-16">
      <Reveal>
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="w-8 h-px bg-brand-red"></span>
          <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Machine Capacity</span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <div className="overflow-x-auto rounded-2xl border border-canvas-edge shadow-card bg-canvas-raised">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-ink-deep">
                {table.headers.map((h, i) => (
                  <th
                    key={i}
                    className={`px-5 py-3.5 text-left font-bold uppercase tracking-[0.25em] text-[10px] ${i === 0 ? "text-white/40" : "text-brand-red"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-canvas-raised" : "bg-canvas/60"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-5 py-3.5 text-xs leading-relaxed ${ci === 0 ? "font-bold text-ink uppercase tracking-[0.2em] whitespace-nowrap" : "text-ink-muted"}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </div>
  );
}

/** Shared main column for sub-products — reused so gallery layouts can wrap hero + body in one catalog backdrop. */
function SubProductDetailMainBody({
  machine,
  sub,
  galleryMode,
  relatedParts,
}: {
  machine: Machine;
  sub: SubProduct;
  galleryMode: boolean;
  relatedParts: PartItem[];
}) {
  return (
    <div
      className={`relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 md:px-10 lg:grid-cols-3 lg:gap-14 lg:px-14 ${galleryMode ? "py-14 md:py-16" : "gap-14 py-20"}`}
    >
      <div className="space-y-12 md:space-y-16 lg:col-span-2">
        {!galleryMode ? (
          <Reveal>
            <p className="max-w-2xl text-base leading-relaxed text-ink-muted md:text-lg">{sub.shortDesc}</p>
          </Reveal>
        ) : null}

        {sub.youtubeVideoId ? <ProductYoutubeEmbed videoId={sub.youtubeVideoId} label={sub.name} /> : null}

        {/* Features */}
        <div className="mb-16">
          <Reveal>
            <div className="inline-flex items-center gap-3 mb-7">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Key Features</span>
            </div>
          </Reveal>
          <Stagger stagger={0.05} className="flex flex-col">
            {sub.features.map((f, i) => (
              <RevealItem
                key={i}
                className={`flex items-start gap-5 py-5 ${i < sub.features.length - 1 ? "border-b border-canvas-edge" : ""}`}
              >
                <span className="font-mono text-brand-red text-xs font-bold mt-1 shrink-0 w-7">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-ink text-sm md:text-[15px] leading-relaxed">{f}</span>
              </RevealItem>
            ))}
          </Stagger>
        </div>

        {/* Specifications */}
        {sub.specifications.length > 0 && (
          <div className="mb-16">
            <Reveal>
              <div className="inline-flex items-center gap-3 mb-7">
                <span className="w-8 h-px bg-brand-red"></span>
                <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Specifications</span>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-2xl overflow-hidden border border-canvas-edge shadow-card bg-canvas-raised">
                {sub.specifications.map((spec, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-8 px-6 py-4 ${i % 2 === 0 ? "bg-canvas-raised" : "bg-canvas/60"} ${i < sub.specifications.length - 1 ? "border-b border-canvas-edge" : ""}`}
                  >
                    <span className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.25em] shrink-0 w-44 pt-0.5">
                      {spec.label}
                    </span>
                    <span className="text-ink text-sm font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        )}

        {sub.capacityTable && <CapacityTableSection table={sub.capacityTable} />}

        {relatedParts.length > 0 && (
          <PartsTableSection partsList={relatedParts} machineName={machine.name} />
        )}
      </div>

      {/* Sidebar — compact when gallery headline already sells the model */}
      <div className="flex flex-col gap-4 lg:sticky lg:top-32 lg:self-start">
        {galleryMode ? (
          <>
            <Reveal>
              <div className="rounded-2xl border border-canvas-edge bg-white p-6 shadow-soft">
                <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.3em] text-ink-subtle">Explore</p>
                <div className="flex flex-col gap-3">
                  <Link
                    to={`/machines/${machine.id}`}
                    className="flex items-center justify-between gap-2 rounded-xl border border-canvas-edge bg-canvas px-4 py-3 text-sm font-semibold text-ink transition-colors hover:border-brand-red/25 hover:bg-canvas-raised"
                  >
                    <span className="flex items-center gap-2 truncate">
                      <i className="ri-layout-grid-line text-brand-red shrink-0" aria-hidden />
                      <span className="truncate">{machine.name}</span>
                    </span>
                    <i className="ri-arrow-right-s-line text-ink-subtle shrink-0" aria-hidden />
                  </Link>
                  <Link
                    to="/contact"
                    className="flex items-center justify-between gap-2 rounded-xl border border-transparent bg-brand-red px-4 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-sm transition hover:bg-brand-glow"
                  >
                    Contact sales
                    <i className="ri-arrow-right-line shrink-0" aria-hidden />
                  </Link>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-canvas-edge bg-canvas-raised/80 px-6 py-5">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-ink-subtle">Spare parts</p>
                <Link
                  to="/parts"
                  className="group flex items-center gap-2 text-sm font-bold text-brand-red transition-colors hover:text-brand-glow"
                >
                  Open parts catalog
                  <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </div>
            </Reveal>
            {sub.schilt ? (
              <Reveal delay={0.08}>
                <Link
                  to={SCHILT_PARTNER_ABOUT_ROUTE}
                  className="flex items-center gap-3 rounded-2xl border border-canvas-edge bg-ink-deep px-5 py-4 text-left transition hover:border-white/10"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red shadow-ember">
                    <i className="ri-award-fill text-lg text-white" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-[10px] font-bold uppercase tracking-[0.28em] text-white/45">Schilt × RMS</span>
                    <span className="mt-0.5 block text-sm font-bold text-white">Partnership &amp; support</span>
                  </span>
                  <i className="ri-arrow-right-s-line ml-auto text-white/50" aria-hidden />
                </Link>
              </Reveal>
            ) : null}
          </>
        ) : (
          <>
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-canvas-edge bg-canvas-raised shadow-card">
                <div className="bg-ink-deep px-6 py-5">
                  <Link
                    to={`/machines/${machine.id}`}
                    className="mb-2 flex cursor-pointer items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-white/50 transition-colors hover:text-white"
                  >
                    <i className="ri-arrow-left-line text-sm"></i>
                    <span>{machine.name}</span>
                  </Link>
                  <p className="text-xl font-black leading-tight tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {sub.name}
                  </p>
                </div>
                <div className="flex flex-col gap-2 bg-canvas-raised px-6 py-5">
                  <Link
                    to="/contact"
                    className="group inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-brand-red text-[12px] font-bold uppercase tracking-[0.18em] text-white transition-all hover:bg-brand-glow hover:shadow-glow whitespace-nowrap"
                  >
                    Contact Us
                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5"></i>
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="rounded-2xl border border-canvas-edge bg-canvas px-6 py-5">
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-ink-subtle">Need parts?</p>
                <Link
                  to="/parts"
                  className="group flex cursor-pointer items-center gap-2 text-sm font-bold text-brand-red transition-colors hover:text-brand-glow"
                >
                  <span>Browse Parts Catalog</span>
                  <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5"></i>
                </Link>
              </div>
            </Reveal>

            {sub.schilt ? (
              <Reveal delay={0.1}>
                <div className="relative overflow-hidden rounded-2xl bg-ink-deep px-6 py-7">
                  <div className="pointer-events-none absolute inset-0 bg-ember-radial"></div>

                  <div className="relative mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-brand-red shadow-ember">
                      <i className="ri-award-fill text-base text-white"></i>
                    </div>
                    <div>
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">Authorized Partner</p>
                      <p className="text-base font-black tracking-tight text-white" style={{ fontFamily: "'Inter', sans-serif" }}>
                        Engineered by Schilt
                      </p>
                    </div>
                  </div>
                  <p className="relative mb-4 text-xs leading-relaxed text-white/65">
                    Designed and built by Schilt Engineering of the Netherlands. Sold, installed, and serviced across North America by RMS.
                  </p>
                  <Link
                    to={SCHILT_PARTNER_ABOUT_ROUTE}
                    className="group relative inline-flex cursor-pointer items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-red transition-colors hover:text-brand-glow"
                  >
                    <span>About the partnership</span>
                    <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5"></i>
                  </Link>
                </div>
              </Reveal>
            ) : null}
          </>
        )}
      </div>
    </div>
  );
}

export default function SubProductDetailPage() {
  const { id, subId } = useParams<{ id: string; subId: string }>();
  const machine = machines.find((m) => m.id === id);
  const sub = machine?.subProducts?.find((s) => s.id === subId);
  const subIndex = machine?.subProducts?.findIndex((s) => s.id === subId) ?? 0;

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1.05, 1.18]);
  const heroFg = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);

  const relatedParts = sub?.partsTypeId
    ? parts.filter((p) => p.partsTypeId === sub.partsTypeId)
    : [];

  if (!machine || !sub) {
    return (
      <div className="bg-canvas min-h-screen flex items-center justify-center">
        <Navbar />
        <div className="text-center">
          <h1 className="text-ink text-4xl font-black mb-4">Product Not Found</h1>
          <Link to="/machines" className="text-brand-red hover:underline cursor-pointer">Back to Machines</Link>
        </div>
      </div>
    );
  }

  const industrialCover = sub.heroPreset === "industrial-automation";
  const filteredGallery = sub.imageGallery?.filter(Boolean) ?? [];
  /** RMS Controller lineup: same catalog hero (gallery left + summary card right) whether there is one photo or several */
  let heroGalleryImages: string[] = [];
  if (filteredGallery.length >= 2) {
    heroGalleryImages = filteredGallery;
  } else if (machine.id === "rms-controller") {
    if (filteredGallery.length === 1) {
      heroGalleryImages = filteredGallery;
    } else if (sub.image) {
      heroGalleryImages = [sub.image];
    }
  }
  const galleryMode = heroGalleryImages.length > 0;
  /** Full-bleed photo hero (`object-cover`) would crop PNG cut-outs — honor `coverObjectFit: "contain"` from data. */
  const cinematicContain = sub.coverObjectFit === "contain" && !galleryMode && !industrialCover;
  /** Wide / close-up product shots: overscale + taller strip so framing runs past the viewport edges. */
  const cinematicBleed = sub.coverObjectFit === "bleed" && !galleryMode && !industrialCover;
  const heroSpecChips = industrialCover ? sub.specifications.slice(0, 3) : [];
  const hi = industrialCover;
  /** Industrial + cinematic `contain`: light hero field — title row needs ink styling. */
  const heroInkUi = industrialCover || cinematicContain;

  return (
    <div className="bg-canvas min-h-screen overflow-x-hidden">
      <Navbar />

      {galleryMode ? (
        <div className="relative overflow-hidden bg-gradient-to-b from-canvas via-white to-[#f3f3f2]">
          <div className="pointer-events-none absolute right-0 top-0 h-[420px] w-[420px] translate-x-1/4 -translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(211,47,47,0.06)_0%,transparent_70%)] blur-2xl" aria-hidden />
          <div className="pointer-events-none absolute bottom-0 left-0 h-[380px] w-[380px] -translate-x-1/3 translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(26,28,32,0.035)_0%,transparent_68%)] blur-2xl" aria-hidden />

          <section className="relative border-b border-canvas-edge/50">
            <div ref={heroRef} className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-32 lg:px-14">
              {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
              <div className="h-4 mb-6 max-md:h-3" aria-hidden />

              <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-x-12 lg:gap-y-16 xl:gap-x-14">
                <div className="min-w-0 lg:col-span-6 xl:col-span-6">
                  <SubProductImageGallery
                    images={heroGalleryImages}
                    productName={sub.name}
                    presentation={sub.galleryPresentation ?? "default"}
                    leadImageSrc={
                      sub.galleryLanding === "first"
                        ? (heroGalleryImages[0] ?? sub.image)
                        : sub.image
                    }
                    hideIntroLine
                  />
                </div>

                <aside className="min-w-0 rounded-3xl border border-canvas-edge/80 bg-white p-6 shadow-[0_24px_56px_-36px_rgba(26,26,31,0.28)] sm:p-8 lg:sticky lg:top-[6.5rem] lg:col-span-6 lg:self-start xl:col-span-6 xl:p-10">
                  <Reveal delay={0.04}>
                    <div className="mb-7 flex flex-wrap items-center gap-2">
                      <span className="inline-flex max-w-full items-center gap-2 break-words rounded-full bg-brand-red/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-brand-red ring-1 ring-brand-red/15 sm:tracking-[0.26em]">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-red shadow-sm" aria-hidden />
                        <span className="min-w-0 leading-snug">{machine.name}</span>
                      </span>
                      <span className="shrink-0 tabular-nums text-[11px] font-bold uppercase tracking-[0.18em] text-ink-subtle">
                        {String(subIndex + 1).padStart(2, "0")}
                        {" \u2022 "}
                        {String((machine.subProducts ?? []).length).padStart(2, "0")}
                      </span>
                    </div>

                    <h1
                      className="break-words font-black leading-[1.08] tracking-tightest text-ink"
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: "clamp(1.75rem, 3.35vw + 0.85rem, 2.875rem)",
                      }}
                    >
                      {sub.name}
                    </h1>
                    <div className="mt-5 h-1 w-[4.75rem] rounded-full bg-brand-red shadow-sm shadow-brand-red/25" />

                    <p className="mt-7 break-words text-[15px] leading-[1.75] text-ink-muted md:text-base">{sub.shortDesc}</p>

                    {sub.specifications.length > 0 ? (
                      <ul className="mt-10 divide-y divide-canvas-edge rounded-2xl border border-canvas-edge bg-white/85 backdrop-blur-[2px] overflow-hidden">
                        {sub.specifications.slice(0, 6).map((spec) => (
                          <li key={spec.label} className="flex flex-col gap-1 px-4 py-4 md:px-5">
                            <span className="break-words text-[9px] font-black uppercase leading-relaxed tracking-[0.24em] text-brand-red md:tracking-[0.28em]">
                              {spec.label}
                            </span>
                            <span className="break-words text-[13px] font-semibold leading-relaxed text-ink md:text-sm">
                              {spec.value}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {sub.schilt ? (
                      <Link
                        to={SCHILT_PARTNER_ABOUT_ROUTE}
                        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-canvas-edge bg-white px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.24em] text-ink shadow-sm transition hover:border-brand-red/30 hover:bg-canvas sm:justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <i className="ri-award-fill text-lg text-brand-red" aria-hidden />
                          Engineered by Schilt
                        </span>
                        <i className="ri-arrow-right-s-line text-brand-red opacity-80" aria-hidden />
                      </Link>
                    ) : null}

                    <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                      <Magnetic strength={0.32}>
                        <Link
                          to="/contact"
                          className="group inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-3 rounded-full bg-brand-red px-7 text-[11px] font-bold uppercase tracking-[0.16em] text-white shadow-[0_16px_36px_-14px_rgba(211,47,47,0.55)] transition-all hover:bg-brand-glow hover:shadow-glow sm:flex-initial sm:min-w-[11rem]"
                        >
                          Request quote
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-red transition-transform group-hover:translate-x-0.5">
                            <i className="ri-arrow-right-line text-base" />
                          </span>
                        </Link>
                      </Magnetic>
                      <Link
                        to={`/machines/${machine.id}`}
                        className="inline-flex min-h-[3.25rem] flex-1 items-center justify-center gap-2 rounded-full border-2 border-canvas-edge bg-white px-6 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-colors hover:border-ink-muted sm:flex-initial"
                      >
                        <i className="ri-arrow-left-line text-base text-brand-red" aria-hidden />
                        Line overview
                      </Link>
                    </div>
                  </Reveal>
                </aside>
              </div>
            </div>
          </section>

          <SubProductDetailMainBody
            galleryMode={galleryMode}
            machine={machine}
            relatedParts={relatedParts}
            sub={sub}
          />
        </div>
      ) : (
        <>
          {/* Cinematic photo hero */}
          <div
            ref={heroRef}
            className={`relative w-full overflow-x-hidden overflow-y-hidden ${
              industrialCover
                ? "h-[600px] md:h-[748px] bg-[#d7d9de]"
                : cinematicBleed
                  ? "min-h-[min(92svh,960px)] h-[min(92svh,960px)] bg-black overflow-hidden"
                  : cinematicContain
                    ? "min-h-[420px] h-[min(78svh,800px)] bg-[#d7d9de]"
                    : "h-[600px] md:h-[748px] bg-[#12151a]"
            }`}
          >
        {industrialCover && (
          <>
            <div className="absolute inset-0 z-0 bg-[#d7d9de]" aria-hidden />
            <div
              className="absolute inset-0 z-0 bg-gradient-to-b from-[#eef0f5] via-[#e1e4ea] to-[#c9cdd6]"
              aria-hidden
            />
            <div
              className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_72%_at_50%_-8%,rgba(255,255,255,0.75)_0%,transparent_56%)]"
              aria-hidden
            />
            {/* Bottom wash only, *behind* the PNG — alpha shows studio above, type stays legible below */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[min(55%,460px)] bg-gradient-to-t from-[#1d2028]/88 via-[#1d2028]/28 to-transparent"
              aria-hidden
            />
          </>
        )}

        {cinematicContain && (
          <>
            <div className="absolute inset-0 z-0 bg-[#d7d9de]" aria-hidden />
            <div
              className="absolute inset-0 z-0 bg-gradient-to-b from-[#eef0f5] via-[#e1e4ea] to-[#c9cdd6]"
              aria-hidden
            />
            <div
              className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_100%_72%_at_50%_-8%,rgba(255,255,255,0.75)_0%,transparent_56%)]"
              aria-hidden
            />
          </>
        )}

        <motion.img
          src={sub.image}
          alt={sub.name}
          className={
            industrialCover
              ? "relative z-10 h-full w-full object-contain object-center px-3 py-6 will-change-transform md:px-8 md:py-10 [filter:drop-shadow(0_22px_44px_rgba(0,0,0,0.14))]"
              : cinematicBleed
                ? "pointer-events-none absolute left-1/2 top-[50%] z-10 max-w-none min-h-[118%] w-[min(132vw,2200px)] -translate-x-1/2 -translate-y-1/2 object-cover object-[center_46%] will-change-transform sm:w-[min(124vw,2000px)] md:object-[center_44%]"
                : cinematicContain
                  ? sub.containFlushX
                    ? "relative z-10 h-full w-full max-h-full object-contain object-center px-0 py-6 will-change-transform sm:py-8 md:py-11 [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.12))]"
                    : "relative z-10 h-full w-full max-h-full object-contain object-center px-3 py-6 will-change-transform sm:px-5 sm:py-8 md:px-7 md:py-11 [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.12))]"
                  : `h-full w-full object-cover will-change-transform animate-kenburns${sub.coverObjectPosition ? "" : " object-top"}`
          }
          style={{
            y: heroY,
            scale:
              cinematicContain || cinematicBleed
                ? 1
                : sub.coverCropZoom != null
                  ? sub.coverCropZoom
                  : heroScale,
            ...(sub.coverObjectPosition && !industrialCover && !cinematicBleed && !cinematicContain
              ? { objectPosition: sub.coverObjectPosition }
              : {}),
            ...(sub.coverCropZoom != null && !industrialCover && !cinematicBleed && !cinematicContain
              ? ({ transformOrigin: "center center" } as const)
              : {}),
          }}
        />

        {!industrialCover && !cinematicContain ? (
          <>
            <div
              className={
                "absolute inset-0 bg-gradient-to-r " +
                (cinematicBleed
                  ? "from-black/[0.78] via-black/38 to-transparent"
                  : "from-black/95 via-black/60 to-black/15")
              }
            ></div>
            <div
              className={
                "absolute inset-0 bg-gradient-to-t " +
                (cinematicBleed
                  ? "from-black/[0.84] via-black/38 to-transparent"
                  : "from-black/85 via-transparent to-black/20")
              }
            ></div>
          </>
        ) : null}

        {/* Mid-layer ambient glow */}
        {!industrialCover && !cinematicBleed && !cinematicContain && (
          <div className="pointer-events-none absolute top-[12%] right-[10%] h-[420px] w-[420px] animate-blob ambient-glow"></div>
        )}

        <motion.div
          className={`absolute inset-0 z-20 flex flex-col justify-end px-8 md:px-16 pb-16 max-w-7xl mx-auto left-0 right-0`}
          style={{ y: heroFg }}
        >
          {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          {industrialCover && heroSpecChips.length > 0 && (
            <Reveal delay={0}>
              <div
                className={`mb-6 flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-end sm:justify-between ${hi ? "border-canvas-edge" : "border-white/10"}`}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border text-brand-red shadow-sm ${hi ? "border-canvas-edge bg-white/95" : "border-white/14 bg-[rgba(211,47,47,0.12)] shadow-[0_0_24px_rgba(211,47,47,0.2)]"}`}
                    aria-hidden
                  >
                    <i className="ri-cpu-line text-xl"></i>
                  </span>
                  <div className="min-w-0">
                    <p className={`text-[9px] font-black uppercase tracking-[0.34em] ${hi ? "text-ink-subtle" : "text-white/42"}`}>
                      Production automation
                    </p>
                    <p className={`text-[11px] font-bold uppercase tracking-[0.18em] sm:tracking-[0.22em] ${hi ? "text-ink" : "text-white/88"}`}>
                      PLC line · Touch HMI · Twin bending heads
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {heroSpecChips.map((spec) => (
                    <div
                      key={spec.label}
                      className={`min-w-0 max-w-[18rem] rounded-lg border px-3 py-2 backdrop-blur-md ${hi ? "border-canvas-edge bg-canvas-raised/95" : "border-white/12 bg-black/50"}`}
                    >
                      <p className="text-[8px] font-black uppercase tracking-[0.26em] text-brand-red">{spec.label}</p>
                      <p
                        className={`mt-0.5 truncate text-[11px] font-medium leading-snug ${hi ? "text-ink" : "text-white/82"}`}
                        title={spec.value}
                      >
                        {spec.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          )}

          <div className="flex items-end justify-between gap-8 flex-wrap">
            <div className="max-w-3xl">
              <Reveal delay={0.05}>
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <span className="inline-flex items-center gap-2 text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-red"></span>
                    {machine.name}
                  </span>
                  <span className={heroInkUi ? "text-canvas-edge" : "text-white/20"}>·</span>
                  <span className={`text-[11px] uppercase tracking-[0.3em] ${heroInkUi ? "text-ink-subtle" : "text-white/45"}`}>
                    {String(subIndex + 1).padStart(2, "0")} / {String((machine.subProducts ?? []).length).padStart(2, "0")}
                  </span>
                  {sub.schilt && (
                    <>
                      <span className={heroInkUi ? "text-canvas-edge" : "text-white/20"}>·</span>
                      <Link
                        to={SCHILT_PARTNER_ABOUT_ROUTE}
                        className={
                          heroInkUi
                            ? "inline-flex items-center gap-1.5 rounded-full border border-canvas-edge bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-ink shadow-sm transition-colors cursor-pointer hover:bg-canvas"
                            : "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full glass-dark text-white/90 text-[10px] font-bold uppercase tracking-[0.25em] hover:bg-white/15 transition-colors cursor-pointer"
                        }
                      >
                        <i className="ri-award-fill text-brand-red"></i>
                        Engineered by Schilt · Serviced by RMS
                      </Link>
                    </>
                  )}
                </div>
              </Reveal>

              <Reveal delay={0.1}>
                <h1
                  className={
                    heroInkUi
                      ? "font-black leading-[0.95] tracking-tightest text-ink drop-shadow-[0_1px_0_rgba(255,255,255,0.4)]"
                      : "text-white font-black leading-[0.95] tracking-tightest"
                  }
                  style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.25rem, 5.5vw, 5rem)" }}
                >
                  {sub.name}
                </h1>
              </Reveal>
              <Reveal delay={0.15}>
                <div className="w-20 h-1 bg-brand-red mt-6"></div>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <Magnetic strength={0.35}>
                <Link
                  to="/contact"
                  className="group shrink-0 inline-flex items-center gap-3 pl-7 pr-3 h-14 bg-brand-red text-white font-bold uppercase tracking-[0.18em] text-[12px] rounded-full hover:bg-brand-glow hover:shadow-glow transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  Contact Us
                  <span className="w-9 h-9 flex items-center justify-center bg-white text-brand-red rounded-full transition-transform duration-300 group-hover:translate-x-0.5">
                    <i className="ri-arrow-right-line text-base"></i>
                  </span>
                </Link>
              </Magnetic>
            </Reveal>
          </div>
        </motion.div>
      </div>

          <SubProductDetailMainBody
            galleryMode={galleryMode}
            machine={machine}
            relatedParts={relatedParts}
            sub={sub}
          />
        </>
      )}

      <Footer />
    </div>
  );
}
