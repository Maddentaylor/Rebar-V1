/**
 * “Request pricing” flow — UX distinct from `/contact`: modal, split‑panel rail,
 * form-first. Contact page stays phone-forward editorial routing.
 */

import { FormEvent, useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { COMPANY } from "@/data/company";

const INQUIRY_OPTIONS = [
  { value: "machinery", label: "New machinery or line expansion" },
  { value: "parts", label: "Replacement parts pricing" },
  { value: "service", label: "Service, repair, or training" },
  { value: "other", label: "Something else" },
] as const;

function getInquirySubmitUrl(): string {
  if (import.meta.env.DEV) {
    return "/api/send-quote-inquiry";
  }
  const base = (import.meta.env.VITE_QUOTE_API_URL ?? "").replace(/\/$/, "");
  return `${base}/api/send-quote-inquiry`;
}

export interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
}

export default function QuoteRequestModal({ open, onClose }: QuoteRequestModalProps) {
  const titleId = useId();
  const formId = useId();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (open) return;
    setSubmitted(false);
    setSubmitError(null);
    setSubmitting(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const lenis = typeof window !== "undefined" ? window.__lenis : undefined;
    lenis?.stop();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setSubmitError(null);

    const form = e.currentTarget;
    const fd = new FormData(form);
    const body = {
      first_name: String(fd.get("first_name") ?? "").trim(),
      last_name: String(fd.get("last_name") ?? "").trim(),
      email: String(fd.get("email") ?? "").trim(),
      phone: String(fd.get("phone") ?? "").trim(),
      company: String(fd.get("company") ?? "").trim(),
      inquiry_type: String(fd.get("inquiry_type") ?? "").trim(),
      message: String(fd.get("message") ?? "").trim(),
    };

    try {
      const res = await fetch(getInquirySubmitUrl(), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setSubmitError(data.error || `Something went wrong (${res.status}). Call us anytime.`);
        return;
      }
      setSubmitted(true);
      form.reset();
    } catch {
      setSubmitError(
        `We couldn't reach the quote endpoint from here. Call ${COMPANY.phoneMachinesSalesDisplay} — or email ${COMPANY.email}.`
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setSubmitError(null);
    onClose();
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          role="presentation"
          className="fixed inset-0 z-[110] flex items-end justify-center p-4 sm:p-6 sm:items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            type="button"
            aria-label="Close quote dialog"
            className="absolute inset-0 bg-ink-deep/76 backdrop-blur-[3px] cursor-pointer"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            className="relative z-[1] w-full max-w-[960px] max-h-[min(92dvh,860px)] flex flex-col overflow-hidden rounded-[1.35rem] border border-white/14 bg-canvas shadow-[0_44px_100px_-40px_rgba(0,0,0,0.55)]"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-canvas-edge shrink-0 bg-gradient-to-r from-brand-red/[0.08] via-transparent">
              <div className="min-w-0">
                <span className="block text-brand-red text-[10px] font-black uppercase tracking-[0.42em]">
                  RMS · Inquiry
                </span>
                <h2 id={titleId} className="text-ink text-lg sm:text-xl font-black tracking-tight leading-tight">
                  Request pricing / quote
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="shrink-0 w-11 h-11 rounded-full border border-canvas-edge bg-white/90 hover:bg-canvas shadow-sm grid place-items-center text-ink transition-colors cursor-pointer"
                aria-label="Close"
              >
                <i className="ri-close-line text-2xl" />
              </button>
            </div>

            {submitted ? (
              <div className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-10 py-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-brand-red/12 border border-brand-red/25 grid place-items-center mb-6">
                  <i className="ri-mail-send-fill text-brand-red text-3xl" />
                </div>
                <p className="text-ink text-2xl font-black tracking-tight mb-3">Quote request sent</p>
                <p className="text-ink-muted text-sm leading-relaxed max-w-sm mb-10">
                  Thanks — RMS will reply with next steps or call you for detail. Typical response within one business day.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    type="button"
                    onClick={resetAndClose}
                    className="h-11 px-8 rounded-full bg-ink text-white text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-red transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <a
                    href={COMPANY.phoneMachinesSalesTel}
                    className="h-11 px-8 rounded-full border-2 border-canvas-edge bg-white inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-ink hover:border-brand-red/40 cursor-pointer"
                  >
                    <i className="ri-phone-fill text-brand-red text-lg" aria-hidden />
                    Call RMS
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex-1 grid grid-cols-1 md:grid-cols-[minmax(200px,32%)_1fr] min-h-0 divide-y md:divide-y-0 md:divide-x divide-canvas-edge overflow-hidden">
                <aside className="bg-ink-deep text-white shrink-0 p-6 sm:p-8 md:overflow-y-auto overscroll-contain">
                  <div className="h-1 w-full max-w-[5rem] bg-brand-red mb-6 rounded-full shadow-[0_0_24px_rgba(211,47,47,0.55)]" />
                  <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-white/50 mb-2">Brief form</p>
                  <p className="text-lg font-black leading-snug mb-6 tracking-tightest" style={{ fontFamily: "'Inter',sans-serif" }}>
                    Tell us what you&apos;re pricing — machinery, spare parts, service, or a mix.
                  </p>
                  <ul className="space-y-3 text-[13px] text-white/70 leading-snug mb-10">
                    <li className="flex gap-2">
                      <i className="ri-checkbox-circle-fill text-brand-red shrink-0 mt-0.5 text-base" aria-hidden />
                      For part SKUs you already know, stack them in the cart — consolidated quotes ride through the same team.
                    </li>
                    <li className="flex gap-2">
                      <i className="ri-checkbox-circle-fill text-brand-red shrink-0 mt-0.5 text-base" aria-hidden />
                      Prefer conversation? RMS answers calls — live, not outsourced.
                    </li>
                  </ul>
                  <a
                    href={COMPANY.phoneMachinesSalesTel}
                    className="inline-flex w-full md:w-auto items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/12 border border-white/18 hover:bg-white/18 transition-colors text-[11px] font-bold uppercase tracking-[0.22em]"
                  >
                    <i className="ri-phone-fill text-brand-red text-lg" aria-hidden />
                    {COMPANY.phoneMachinesSalesDisplay}
                  </a>
                  <Link
                    to="/contact"
                    onClick={onClose}
                    className="mt-6 block text-center md:text-left text-[11px] font-bold uppercase tracking-[0.2em] text-white/42 hover:text-white/72 transition-colors"
                  >
                    Open full Contact page →
                  </Link>
                </aside>

                <div className="relative flex flex-1 flex-col min-h-0">
                  <form
                    id={formId}
                    onSubmit={handleSubmit}
                    className="flex-1 flex flex-col min-h-0 overflow-y-auto overscroll-contain px-6 sm:px-10 py-7 gap-4 pb-28"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`${formId}-fn`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                          First name *
                        </label>
                        <input
                          id={`${formId}-fn`}
                          name="first_name"
                          required
                          autoComplete="given-name"
                          className="w-full h-10 rounded-xl border border-canvas-edge bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                        />
                      </div>
                      <div>
                        <label htmlFor={`${formId}-ln`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                          Last name *
                        </label>
                        <input
                          id={`${formId}-ln`}
                          name="last_name"
                          required
                          autoComplete="family-name"
                          className="w-full h-10 rounded-xl border border-canvas-edge bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label htmlFor={`${formId}-em`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                          Email *
                        </label>
                        <input
                          id={`${formId}-em`}
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          className="w-full h-10 rounded-xl border border-canvas-edge bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                        />
                      </div>
                      <div>
                        <label htmlFor={`${formId}-ph`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                          Phone
                        </label>
                        <input
                          id={`${formId}-ph`}
                          name="phone"
                          type="tel"
                          autoComplete="tel"
                          className="w-full h-10 rounded-xl border border-canvas-edge bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor={`${formId}-co`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                        Company name
                      </label>
                      <input
                        id={`${formId}-co`}
                        name="company"
                        type="text"
                        autoComplete="organization"
                        className="w-full h-10 rounded-xl border border-canvas-edge bg-white px-3 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                      />
                    </div>
                    <div>
                      <label htmlFor={`${formId}-ty`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle mb-1.5">
                        You&apos;re looking for… *
                      </label>
                      <div className="relative">
                        <select
                          id={`${formId}-ty`}
                          name="inquiry_type"
                          required
                          defaultValue=""
                          className="w-full appearance-none h-11 rounded-xl border border-canvas-edge bg-white pl-3 pr-10 text-sm outline-none cursor-pointer focus:border-brand-red focus:ring-2 focus:ring-brand-red/18"
                        >
                          <option value="" disabled>
                            Choose one…
                          </option>
                          {INQUIRY_OPTIONS.map((o) => (
                            <option key={o.value} value={o.value}>
                              {o.label}
                            </option>
                          ))}
                        </select>
                        <i className="ri-arrow-down-s-line pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted text-lg" aria-hidden />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-1 min-h-[140px]">
                      <label htmlFor={`${formId}-msg`} className="block text-[9px] font-bold uppercase tracking-[0.22em] text-ink-subtle">
                        Project details *
                      </label>
                      <textarea
                        id={`${formId}-msg`}
                        name="message"
                        required
                        rows={5}
                        placeholder="Machine line, capacities, timelines, quantities, PO requirements…"
                        className="w-full flex-1 min-h-[120px] resize-y rounded-xl border border-canvas-edge bg-white px-3 py-2 text-sm outline-none focus:border-brand-red focus:ring-2 focus:ring-brand-red/18 leading-relaxed"
                      />
                    </div>

                    {submitError ? (
                      <p className="text-[13px] text-brand-red font-medium leading-snug bg-brand-red/10 border border-brand-red/28 rounded-xl px-3 py-2.5" role="alert">
                        {submitError}
                      </p>
                    ) : null}
                  </form>

                  <div className="shrink-0 border-t border-canvas-edge bg-canvas-raised/90 px-6 sm:px-10 py-4 flex flex-col sm:flex-row sm:justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="h-11 order-3 sm:order-1 px-6 rounded-full border border-canvas-edge bg-white text-[11px] font-bold uppercase tracking-[0.2em] text-ink-muted hover:text-ink transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      form={formId}
                      disabled={submitting}
                      className="h-11 order-1 sm:order-2 min-w-[12rem] rounded-full bg-brand-red text-white text-[11px] font-bold uppercase tracking-[0.16em] shadow-[0_16px_36px_-14px_rgba(211,47,47,0.55)] hover:bg-brand-glow disabled:opacity-55 transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                    >
                      {submitting ? "Sending…" : "Submit quote inquiry"}
                      {!submitting && <i className="ri-send-plane-2-fill text-lg" aria-hidden />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
