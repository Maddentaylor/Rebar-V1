import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/feature/Navbar";
import Footer from "@/components/feature/Footer";
import Reveal from "@/components/motion/Reveal";
import { MachineCardMedia } from "@/components/machines/MachineCardMedia";
import {
  parts,
  machineTypeOptions,
  partsTypeOptions,
  partCategories,
  type PartItem,
} from "@/mocks/parts";
import { IndustrialFilterSelect } from "./IndustrialFilterSelect";
import CatalogQuoteAddControls from "@/components/parts/CatalogQuoteAddControls";
import { useCustomParts } from "@/lib/customParts";

export default function PartsPage() {
  const customParts = useCustomParts();
  const allParts: PartItem[] = [...customParts, ...parts];
  const [selectedMachineType, setSelectedMachineType] = useState<string>("");
  const [selectedPartsType, setSelectedPartsType] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [photoPreview, setPhotoPreview] = useState<PartItem | null>(null);

  useEffect(() => {
    if (!photoPreview) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPhotoPreview(null);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [photoPreview]);

  const availablePartsTypes = partsTypeOptions.filter(
    (pt) => pt.machineTypeId === selectedMachineType
  );

  const availableCategories: string[] = selectedPartsType
    ? Array.from(
        new Set([
          ...(partCategories[selectedPartsType] ?? []),
          ...customParts
            .filter((p) => p.partsTypeId === selectedPartsType)
            .map((p) => p.category),
        ])
      )
    : [];

  const filteredParts = allParts.filter((p) => {
    if (!selectedPartsType) return false;
    if (p.partsTypeId !== selectedPartsType) return false;
    if (selectedCategory && p.category !== selectedCategory) return false;
    return true;
  });

  const handleMachineTypeChange = (val: string) => {
    setSelectedMachineType(val);
    setSelectedPartsType("");
    setSelectedCategory("");
  };

  const handlePartsTypeChange = (val: string) => {
    setSelectedPartsType(val);
    setSelectedCategory("");
  };

  const machineTypeLabel = machineTypeOptions.find((m) => m.id === selectedMachineType)?.label ?? "";
  const partsTypeLabel = partsTypeOptions.find((p) => p.id === selectedPartsType)?.label ?? "";

  const step1Done = !!selectedMachineType;
  const step2Done = !!selectedPartsType;

  return (
    <div className="bg-canvas min-h-screen">
      <Navbar />

      {/* Light editorial header */}
      <section className="relative pt-36 md:pt-44 pb-16 px-6 overflow-hidden bg-warm-fade">
        <div className="pointer-events-none absolute -top-24 -left-24 w-[640px] h-[640px] ambient-glow opacity-60"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Keeps vertical rhythm formerly provided by breadcrumb row + margin */}
          <div className="h-4 mb-6 max-md:h-3" aria-hidden />

          <Reveal delay={0}>
            <div className="inline-flex items-center gap-3 mb-5">
              <span className="w-8 h-px bg-brand-red"></span>
              <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">Genuine RMS Parts</span>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <h1
              className="text-ink font-black tracking-tightest leading-[0.95]"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
            >
              Parts <span className="text-grad-ember">catalog.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="w-20 h-1 bg-brand-red mt-6"></div>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="text-ink-muted text-base md:text-lg max-w-xl mt-6">
              Genuine replacement parts for every machine in the RMS lineup. Most orders ship within 24 hours from our Las Vegas warehouse. Add parts to your cart, then submit one quote with everything you need.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Filter Section — heavy industrial control strip (high z-index so open menus aren’t covered by the grid section below or sibling selects) */}
      <section className="relative z-30 bg-canvas border-y border-canvas-edge py-12 px-6 overflow-visible">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35] bg-[linear-gradient(180deg,transparent_0%,rgba(14,15,18,0.04)_50%,transparent_100%)]"
          aria-hidden
        />
        <div className="relative z-[1] mx-auto max-w-7xl">
          <Reveal>
            <div className="flex items-center gap-3 mb-8 flex-wrap">
              {[
                { n: 1, label: "Machine Type", done: step1Done },
                { n: 2, label: "Parts Type",   done: step2Done },
                { n: 3, label: "Category",     done: !!selectedCategory },
              ].map((s, i, arr) => (
                <div key={s.n} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-colors ${
                    s.done
                      ? "bg-brand-red border-brand-red text-white shadow-ember"
                      : i === 0 || arr[i - 1].done
                        ? "bg-canvas-raised border-canvas-edge text-ink"
                        : "bg-canvas-raised border-canvas-edge text-ink-subtle"
                  }`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      s.done ? "bg-white/20" : "bg-canvas-edge"
                    }`}>
                      {s.done ? <i className="ri-check-line"></i> : s.n}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.25em]">{s.label}</span>
                  </div>
                  {i < arr.length - 1 && (
                    <span className={`w-8 h-px ${s.done ? "bg-brand-red" : "bg-canvas-edge"}`}></span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                {
                  title: "Machine Type",
                  value: selectedMachineType,
                  onChange: handleMachineTypeChange,
                  disabled: false,
                  options: [{ id: "", label: "Select Machine Type..." }, ...machineTypeOptions.map((o) => ({ id: o.id, label: o.label }))],
                },
                {
                  title: "Machine Parts Type",
                  value: selectedPartsType,
                  onChange: handlePartsTypeChange,
                  disabled: !selectedMachineType,
                  options: [{ id: "", label: "Select Machine Parts Type..." }, ...availablePartsTypes.map((o) => ({ id: o.id, label: o.label }))],
                },
                {
                  title: "Part Category",
                  value: selectedCategory,
                  onChange: setSelectedCategory,
                  disabled: !selectedPartsType,
                  options: [{ id: "", label: "All Categories" }, ...availableCategories.map((c) => ({ id: c, label: c }))],
                },
              ].map((f) => (
                <IndustrialFilterSelect
                  key={f.title}
                  label={f.title}
                  value={f.value}
                  onChange={f.onChange}
                  disabled={f.disabled}
                  options={f.options}
                />
              ))}
            </div>
          </Reveal>

          {selectedPartsType && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center gap-2 flex-wrap"
            >
              <span className="text-ink-subtle text-[10px] uppercase tracking-[0.3em]">Showing</span>
              <span className="inline-flex items-center gap-1 bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full">{machineTypeLabel}</span>
              <i className="ri-arrow-right-s-line text-ink-subtle"></i>
              <span className="inline-flex items-center gap-1 bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full">{partsTypeLabel}</span>
              {selectedCategory && (
                <>
                  <i className="ri-arrow-right-s-line text-ink-subtle"></i>
                  <span className="inline-flex items-center gap-1 bg-brand-red/10 text-brand-red text-xs font-bold px-3 py-1 rounded-full">{selectedCategory}</span>
                </>
              )}
              <span className="text-ink-subtle text-xs ml-2">— {filteredParts.length} part{filteredParts.length !== 1 ? "s" : ""} found</span>
            </motion.div>
          )}
        </div>
      </section>

      {/* Parts Grid — below filters in stacking order so dropdowns aren’t clipped by this layer */}
      <section className="relative z-10 border-t border-canvas-edge bg-gradient-to-b from-canvas via-white to-[#f3f3f2] pb-16 pt-12 md:pb-24 md:pt-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-90 bg-[radial-gradient(ellipse_70%_45%_at_50%_-8%,rgba(211,47,47,0.07)_0%,transparent_55%),radial-gradient(ellipse_50%_40%_at_100%_70%,rgba(26,26,31,0.04)_0%,transparent_50%)]"
          aria-hidden
        />
        <div className="relative z-[1] mx-auto max-w-7xl px-6 pb-10">
        {!selectedMachineType && (
          <Reveal>
            <div className="text-center py-24">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-brand-red/10 rounded-full">
                <i className="ri-settings-3-line text-brand-red text-3xl"></i>
              </div>
              <h3 className="text-ink text-2xl font-black mb-2 tracking-tight">Select a Machine Type</h3>
              <p className="text-ink-muted text-sm max-w-md mx-auto leading-relaxed">
                Use the filters above to browse genuine RMS replacement parts by machine type, model, and category.
              </p>
            </div>
          </Reveal>
        )}

        {selectedMachineType && !selectedPartsType && (
          <Reveal>
            <div className="text-center py-24">
              <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-brand-red/10 rounded-full">
                <i className="ri-filter-3-line text-brand-red text-3xl"></i>
              </div>
              <h3 className="text-ink text-2xl font-black mb-2 tracking-tight">Select a Parts Type</h3>
              <p className="text-ink-muted text-sm max-w-md mx-auto leading-relaxed">
                Choose a specific machine model from the &quot;Machine Parts Type&quot; dropdown to see available parts.
              </p>
            </div>
          </Reveal>
        )}

        {selectedPartsType && filteredParts.length === 0 && (
          <div className="text-center py-24">
            <p className="text-ink-subtle text-lg">No parts found for this selection.</p>
          </div>
        )}

        {filteredParts.length > 0 && (
          <div className="mx-auto flex max-w-5xl flex-col gap-6 lg:max-w-[68rem] lg:gap-8">
            {filteredParts.map((part) => (
              <article
                key={part.id}
                className="group/card overflow-hidden rounded-2xl border border-canvas-edge bg-white shadow-[0_4px_36px_-14px_rgba(26,26,31,0.13)] transition-[border-color,box-shadow] duration-300 hover:border-brand-red/40 hover:shadow-[0_14px_40px_-16px_rgba(26,26,31,0.18)]"
              >
                <div className="flex flex-col md:flex-row md:items-stretch">
                  {/* Photo column — left */}
                  <button
                    type="button"
                    onClick={() => setPhotoPreview(part)}
                    className="relative isolate block min-h-[13.5rem] w-full shrink-0 cursor-zoom-in text-left outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2 focus-visible:ring-offset-white sm:min-h-[15rem] md:h-auto md:min-h-0 md:w-[280px] md:self-stretch md:border-r md:border-canvas-edge lg:w-[300px]"
                    aria-label={`Open large photo — ${part.name}`}
                  >
                    <MachineCardMedia
                      src={part.image}
                      alt={part.name}
                      className="h-full min-h-[13.5rem] w-full sm:min-h-[15rem] md:min-h-full"
                    >
                      <div className="pointer-events-none absolute left-3 top-3 z-30 inline-flex items-center gap-2 rounded-full border border-black/[0.07] bg-white/93 px-2.5 py-1 shadow-sm backdrop-blur-sm">
                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#2e7d32]" aria-hidden></span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-ink">In Stock</span>
                      </div>
                      <div className="pointer-events-none absolute bottom-3 left-3 right-3 z-30 flex justify-center opacity-95 transition-opacity md:opacity-0 md:group-hover/card:opacity-100">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-deep/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.26em] text-white shadow-lg backdrop-blur-sm">
                          <i className="ri-zoom-in-line text-sm" aria-hidden></i>
                          Larger photo
                        </span>
                      </div>
                    </MachineCardMedia>
                  </button>

                  {/* Details — right */}
                  <div className="flex min-w-0 flex-1 flex-col justify-between gap-5 bg-gradient-to-br from-canvas via-white to-[#faf9f7] p-6 sm:p-8">
                    <div className="space-y-4">
                      <div>
                        <p className="text-brand-red text-[10px] font-bold uppercase tracking-[0.28em]">{part.category}</p>
                        <h3
                          className="mt-3 text-xl font-black leading-snug tracking-tight text-ink sm:text-[1.35rem]"
                          style={{ fontFamily: "'Inter', sans-serif" }}
                        >
                          {part.name}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-canvas-edge/70 py-4">
                        <span className="inline-flex max-w-full items-center gap-2 rounded-xl border border-canvas-edge bg-canvas px-3 py-1.5 font-mono text-[11px] font-bold text-ink sm:text-xs">
                          <span className="text-ink-subtle text-[10px] font-bold uppercase tracking-[0.2em]">
                            Part #
                          </span>
                          <span className="tabular-nums tracking-tight">{part.partNumber}</span>
                        </span>
                      </div>

                      <p className="text-sm leading-relaxed text-ink-muted sm:text-[15px] sm:leading-[1.6] lg:max-w-[48ch]">
                        {part.description || "Genuine RMS replacement — add items to your cart and submit one quote."}
                      </p>
                    </div>

                    <div className="border-t border-canvas-edge/80 pt-5">
                      <CatalogQuoteAddControls part={part} />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </div>
      </section>

      <AnimatePresence>
        {photoPreview && (
          <motion.div
            key={photoPreview.id}
            role="dialog"
            aria-modal="true"
            aria-labelledby="part-photo-dialog-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
          >
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              aria-label="Close photo viewer"
              className="absolute inset-0 bg-[rgba(17,18,22,0.9)] backdrop-blur-md"
              onClick={() => setPhotoPreview(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 10 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-[1] mx-auto flex w-full max-w-[min(1040px,100%)] flex-col rounded-2xl border border-black/10 bg-[#f8f8f6] p-5 shadow-[0_28px_90px_-24px_rgba(0,0,0,0.55)] sm:p-8"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-canvas-edge bg-white text-xl text-ink transition hover:border-brand-red/40 hover:text-brand-red sm:right-6 sm:top-6 sm:h-11 sm:w-11"
                onClick={() => setPhotoPreview(null)}
                aria-label="Close"
              >
                <i className="ri-close-line" aria-hidden />
              </button>

              <header className="pr-14">
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-red">{photoPreview.category}</p>
                <h2 id="part-photo-dialog-title" className="mt-2 text-xl font-black leading-snug tracking-tight text-ink">
                  {photoPreview.name}
                </h2>
                <p className="mt-1 font-mono text-sm text-ink-muted">Part # {photoPreview.partNumber}</p>
              </header>

              <div className="mt-6 flex max-h-[min(76vh,820px)] min-h-[240px] items-center justify-center overflow-auto rounded-xl border border-canvas-edge bg-gradient-to-b from-white via-[#fafbfc] to-[#e4e6ec] p-6 sm:p-10">
                <img
                  src={photoPreview.image}
                  alt={photoPreview.name}
                  className="max-h-[min(70vh,780px)] w-auto max-w-full object-contain [filter:drop-shadow(0_20px_42px_rgba(0,0,0,0.14))]"
                />
              </div>

              {photoPreview.description && (
                <p className="mt-6 text-center text-sm leading-relaxed text-ink-muted">{photoPreview.description}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
