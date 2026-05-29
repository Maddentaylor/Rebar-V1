import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "@/components/motion/Magnetic";
import { usePartsCart } from "@/context/PartsCartContext";
import { useQuoteModal } from "@/context/QuoteModalContext";
import { COMPANY } from "@/data/company";

const navLinks = [
  { label: "Home",     path: "/"         },
  { label: "Machines", path: "/machines" },
  { label: "Parts",    path: "/parts"    },
  { label: "About",    path: "/about"    },
  { label: "Contact",  path: "/contact"  },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  // Home gets a transparent navbar so the magazine-cover photo bleeds to
  // the top edge. The bar fills in on scroll, and stays solid on every
  // other route where the page background is light.
  const isHome = location.pathname === "/";
  const solid = scrolled || !isHome;
  const { itemCount, openCart } = usePartsCart();
  const { openQuoteModal } = useQuoteModal();

  return (
    <motion.header
      initial={{ y: -28, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-500 ${
        solid
          ? "bg-canvas/85 backdrop-blur-xl border-b border-canvas-edge/70 shadow-nav"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between pt-4 pb-3 md:pt-5 md:pb-5">
        {/* Logo — nudged down to align optically with nav link cap height (e.g. Home) */}
        <Link
          to="/"
          className="flex items-center gap-3 cursor-pointer group shrink-0 relative top-0 md:top-2"
        >
          <span className="flex items-center justify-center transition-all duration-300">
            <img
              src="/rms-logo.png"
              alt="RMS Rebar Machine Service"
              className={`h-24 sm:h-28 md:h-32 w-auto max-w-[min(100%,42rem)] object-contain object-left transition-transform duration-300 group-hover:scale-[1.04] ${
                solid ? "" : "drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]"
              }`}
            />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 text-[13px] font-bold tracking-[0.18em] uppercase whitespace-nowrap cursor-pointer transition-colors ${
                  active
                    ? solid ? "text-ink" : "text-white"
                    : solid
                      ? "text-ink-muted hover:text-ink"
                      : "text-white/85 hover:text-white"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 -z-[1] rounded-full bg-brand-red/10 border border-brand-red/30"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
                <span className="relative">{link.label}</span>
                {active && (
                  <motion.span
                    layoutId="nav-active-dot"
                    className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-red"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={openCart}
            aria-label={`Parts cart, ${itemCount} items`}
            className={`relative ml-1 mr-1 inline-flex items-center justify-center w-11 h-11 rounded-full border transition-colors cursor-pointer ${
              solid
                ? "border-canvas-edge bg-canvas-raised text-ink hover:border-brand-red/40"
                : "border-white/25 bg-white/5 text-white hover:bg-white/10"
            }`}
          >
            <i className="ri-shopping-cart-2-line text-lg" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1.125rem] h-[1.125rem] px-1 rounded-full bg-brand-red text-white text-[9px] font-black flex items-center justify-center leading-none">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <Magnetic strength={0.35} range={14} className="ml-1">
            <button
              type="button"
              onClick={openQuoteModal}
              className="group inline-flex items-center gap-2 pl-5 pr-4 h-11 bg-ink text-white text-[12px] font-bold uppercase tracking-[0.18em] rounded-full hover:bg-brand-red transition-colors duration-300 cursor-pointer border-0"
            >
              Get a Quote
              <span className="relative w-7 h-7 flex items-center justify-center bg-brand-red rounded-full text-white transition-transform duration-300 group-hover:bg-white group-hover:text-brand-red">
                <i className="ri-arrow-right-up-line text-sm"></i>
              </span>
            </button>
          </Magnetic>
        </nav>

        <div className="flex items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={openCart}
            aria-label={`Parts cart, ${itemCount} items`}
            className={`relative w-10 h-10 flex items-center justify-center rounded-full border cursor-pointer ${
              solid
                ? "border-canvas-edge text-ink bg-canvas-raised"
                : "border-white/25 text-white"
            }`}
          >
            <i className="ri-shopping-cart-2-line text-xl" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[1rem] h-[1rem] px-0.5 rounded-full bg-brand-red text-white text-[8px] font-black flex items-center justify-center">
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </button>

          <button
            className={`w-10 h-10 flex items-center justify-center cursor-pointer ${solid ? "text-ink" : "text-white"}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <i className={`text-2xl ${menuOpen ? "ri-close-line" : "ri-menu-line"}`}></i>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence initial={false}>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-canvas border-t border-canvas-edge overflow-hidden"
          >
            <div className="px-6 py-5 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-bold uppercase tracking-[0.18em] cursor-pointer ${
                    location.pathname === link.path ? "text-brand-red" : "text-ink-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <a href={COMPANY.phoneMachinesSalesTel} className="inline-flex items-center gap-2 text-sm text-ink-muted">
                <i className="ri-phone-fill text-brand-red"></i>
                {COMPANY.phoneMachinesSalesDisplay}
              </a>
              <button
                type="button"
                onClick={() => {
                  openQuoteModal();
                  setMenuOpen(false);
                }}
                className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3 bg-ink text-white text-sm font-bold uppercase tracking-[0.18em] rounded-full cursor-pointer border-0 w-full"
              >
                Get a Quote
                <i className="ri-arrow-right-up-line"></i>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
