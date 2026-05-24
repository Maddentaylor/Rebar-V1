import { FormEvent, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { usePartsCart } from "@/context/PartsCartContext";

const FORKLIFT_HERO_IMG =
  "https://readdy.ai/api/search-image?query=professional%20photograph%20electric%20forklift%20in%20clean%20modern%20warehouse%20warm%20ambient%20light%20industrial%20logistics%20minimal%20composition%20high%20end%20editorial&width=960&height=520&seq=parts-cart-forklift&orientation=landscape";

function getQuoteSubmitUrl(): string {
  if (import.meta.env.DEV) {
    return "/api/send-parts-quote";
  }
  const base = (import.meta.env.VITE_QUOTE_API_URL ?? "").replace(/\/$/, "");
  return `${base}/api/send-parts-quote`;
}

export default function PartsCartDrawer() {
  const {
    lines,
    removeLine,
    setLineQuantity,
    clearCart,
    itemCount,
    isOpen,
    closeCart,
  } = usePartsCart();

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setSubmitError(null);
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (lines.length === 0) return;
    setSubmitting(true);
    setSubmitError(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const quotePayload = lines.map(({ part, quantity }) => ({
      id: part.id,
      name: part.name,
      partNumber: part.partNumber,
      category: part.category,
      quantity,
    }));

    const body = {
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      lines: quotePayload,
    };

    try {
      const res = await fetch(getQuoteSubmitUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(data.error || `Could not send (${res.status}). Try again or call us.`);
        return;
      }
      setSubmitted(true);
      clearCart();
    } catch {
      setSubmitError("Network error. Check your connection or try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetDrawer = () => {
    setSubmitted(false);
    closeCart();
  };

  useEffect(() => {
    if (typeof document === "undefined") return;
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="parts-cart-title"
          data-lenis-prevent
          className="fixed z-[100] inset-0 w-full h-dvh max-h-dvh min-h-0 flex flex-col overflow-hidden bg-canvas overscroll-contain touch-pan-y"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Header — full width, stays under the notch / status bar */}
          <div className="relative shrink-0 overflow-hidden border-b border-canvas-edge pt-[env(safe-area-inset-top,0px)]">
            <div className="absolute inset-0">
              <img
                src={FORKLIFT_HERO_IMG}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-ink-deep via-ink-deep/92 to-ink-deep/75" />
            </div>
            <div className="relative flex items-start sm:items-center justify-between gap-4 px-4 sm:px-6 py-4 min-h-[4.5rem] sm:min-h-[5.25rem]">
              <div className="min-w-0 pt-1 sm:pt-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-7 h-px bg-brand-red shrink-0" />
                  <span className="text-brand-glow text-[10px] font-bold uppercase tracking-[0.35em] truncate">
                    Your order
                  </span>
                </div>
                <h2
                  id="parts-cart-title"
                  className="text-white font-black tracking-tightest leading-tight text-xl sm:text-2xl"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  Parts quote cart
                </h2>
                <p className="text-white/60 text-xs mt-1 hidden sm:block max-w-xl">
                  Review everything in one place — still on this page; close when you&apos;re done.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {lines.length > 0 && (
                  <p className="text-white/90 text-xs font-bold tabular-nums hidden min-[420px]:block sm:text-sm">
                    {itemCount} pc · {lines.length} line{lines.length !== 1 ? "s" : ""}
                  </p>
                )}
                <button
                  type="button"
                  onClick={closeCart}
                  className="w-11 h-11 flex items-center justify-center rounded-full bg-black/40 hover:bg-black/55 text-white border border-white/20 transition-colors cursor-pointer"
                  aria-label="Close cart"
                >
                  <i className="ri-close-line text-2xl" />
                </button>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 flex items-center justify-center bg-brand-red/10 rounded-full mb-4">
                <i className="ri-check-line text-brand-red text-3xl" />
              </div>
              <h3 className="text-ink text-xl font-black mb-2 tracking-tight">Quote request sent</h3>
              <p className="text-ink-muted text-sm max-w-xs leading-relaxed mb-6">
                Thanks — our parts team will reach out with pricing and availability.
              </p>
              <button
                type="button"
                onClick={resetDrawer}
                className="h-11 px-6 rounded-full bg-ink text-white text-xs font-bold uppercase tracking-[0.18em] hover:bg-brand-red transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row">
              {/* Line items — uses most of the viewport; multi-column grid on wide screens */}
              <div className="flex-1 min-h-0 overflow-y-auto overscroll-y-contain [-webkit-overflow-scrolling:touch] border-b lg:border-b-0 lg:border-r border-canvas-edge">
                <div className="px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-canvas-edge/80 bg-canvas sticky top-0 z-[1]">
                  <p className="text-ink text-sm font-bold">
                    {itemCount} piece{itemCount !== 1 ? "s" : ""}
                    <span className="text-ink-subtle font-normal">
                      {" "}
                      · {lines.length} line{lines.length !== 1 ? "s" : ""}
                    </span>
                  </p>
                  {lines.length > 0 && (
                    <button
                      type="button"
                      onClick={() => clearCart()}
                      className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-subtle hover:text-brand-red transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {lines.length === 0 ? (
                  <div className="px-5 py-16 text-center max-w-md mx-auto">
                    <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-canvas-raised border border-canvas-edge flex items-center justify-center">
                      <i className="ri-shopping-cart-line text-2xl text-ink-subtle" />
                    </div>
                    <p className="text-ink-muted text-sm leading-relaxed">
                      Your cart is empty. Browse the{" "}
                      <Link
                        to="/parts"
                        onClick={closeCart}
                        className="text-brand-red font-bold hover:underline cursor-pointer"
                      >
                        parts catalog
                      </Link>{" "}
                      and use &quot;Add to cart&quot; on any item.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 sm:p-6">
                    <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4">
                      {lines.map(({ part, quantity }) => (
                        <li
                          key={part.id}
                          className="rounded-2xl border border-canvas-edge bg-canvas-raised p-3 sm:p-4 flex gap-3 shadow-sm"
                        >
                          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-canvas border border-canvas-edge shrink-0 overflow-hidden flex items-center justify-center p-1">
                            <img
                              src={part.image}
                              alt=""
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1 flex flex-col">
                            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red mb-0.5 truncate">
                              {part.category}
                            </p>
                            <p className="text-ink text-sm font-bold leading-snug line-clamp-2">{part.name}</p>
                            <p className="text-ink-subtle text-[11px] font-mono mt-0.5 truncate"># {part.partNumber}</p>
                            <div className="flex items-center gap-2 mt-auto pt-3 flex-wrap">
                              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-ink-subtle">Qty</span>
                              <div className="inline-flex items-center rounded-full border border-canvas-edge bg-canvas overflow-hidden">
                                <button
                                  type="button"
                                  className="w-8 h-8 flex items-center justify-center text-ink hover:bg-canvas-sunken cursor-pointer disabled:opacity-40"
                                  onClick={() => setLineQuantity(part.id, quantity - 1)}
                                  aria-label="Decrease quantity"
                                >
                                  <i className="ri-subtract-line" />
                                </button>
                                <span className="w-8 text-center text-sm font-bold tabular-nums">{quantity}</span>
                                <button
                                  type="button"
                                  className="w-8 h-8 flex items-center justify-center text-ink hover:bg-canvas-sunken cursor-pointer"
                                  onClick={() => setLineQuantity(part.id, quantity + 1)}
                                  aria-label="Increase quantity"
                                >
                                  <i className="ri-add-line" />
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeLine(part.id)}
                                className="ml-auto text-[10px] font-bold uppercase tracking-[0.15em] text-ink-subtle hover:text-brand-red cursor-pointer"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quote form — own scroll on smaller / short viewports */}
              {lines.length > 0 && (
                <aside className="w-full lg:w-[min(26rem,42vw)] xl:w-[28rem] shrink-0 min-h-0 max-h-[48vh] lg:max-h-none overflow-y-auto overscroll-y-contain bg-canvas-raised/90 px-4 sm:px-6 pt-8 sm:pt-10 lg:pt-12 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t lg:border-t-0 border-canvas-edge lg:shadow-none">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-ink-subtle mb-3">
                    Your details — we&apos;ll reply with a quote
                  </p>
                  <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-subtle mb-1 block">
                          First name *
                        </label>
                        <input
                          name="first_name"
                          required
                          autoComplete="given-name"
                          className="w-full h-10 bg-canvas border border-canvas-edge rounded-xl px-3 text-ink text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-subtle mb-1 block">
                          Last name *
                        </label>
                        <input
                          name="last_name"
                          required
                          autoComplete="family-name"
                          className="w-full h-10 bg-canvas border border-canvas-edge rounded-xl px-3 text-ink text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-subtle mb-1 block">
                        Email *
                      </label>
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="w-full h-10 bg-canvas border border-canvas-edge rounded-xl px-3 text-ink text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-subtle mb-1 block">
                        Phone
                      </label>
                      <input
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        className="w-full h-10 bg-canvas border border-canvas-edge rounded-xl px-3 text-ink text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-ink-subtle mb-1 block">
                        Company name
                      </label>
                      <input
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className="w-full h-10 bg-canvas border border-canvas-edge rounded-xl px-3 text-ink text-sm focus:outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/15"
                      />
                    </div>
                    {submitError && (
                      <p
                        className="text-[13px] text-brand-red font-medium leading-snug bg-brand-red/10 border border-brand-red/25 rounded-xl px-3 py-2.5"
                        role="alert"
                      >
                        {submitError}
                      </p>
                    )}
                    <button
                      type="submit"
                      disabled={submitting || lines.length === 0}
                      className="group mt-1 w-full h-12 bg-brand-red text-white font-bold uppercase tracking-[0.16em] text-[11px] rounded-full hover:bg-brand-glow hover:shadow-ember transition-all disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {submitting ? "Sending…" : "Submit quote request"}
                      {!submitting && <i className="ri-truck-line text-lg group-hover:translate-x-0.5 transition-transform" />}
                    </button>
                  </form>
                </aside>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
