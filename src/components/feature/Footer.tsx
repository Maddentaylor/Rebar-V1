import { Link } from "react-router-dom";
import Magnetic from "@/components/motion/Magnetic";
import SchiltPartnerBadge from "@/components/feature/SchiltPartnerBadge";
import { COMPANY } from "@/data/company";

const quickLinks = [
  { label: "Home",     path: "/"         },
  { label: "Machines", path: "/machines" },
  { label: "Parts",    path: "/parts"    },
  { label: "About",    path: "/about"    },
  { label: "Contact",  path: "/contact"  },
];

const equipmentLinks = [
  { label: "RMS Double Bender", path: "/machines/automation/dbs3-60n" },
  { label: "RMS Bender",          path: "/machines/rms-bender"            },
  { label: "RMS Radius",          path: "/machines/rms-radius"            },
  { label: "RMS Spiral",          path: "/machines/rms-spiral"            },
  { label: "RMS Shearline",       path: "/machines/rms-shearline"         },
  { label: "RMS Shear",           path: "/machines/rms-shear"             },
  { label: "RMS Controller",      path: "/machines/rms-controller"        },
  { label: "RMS Lifting",         path: "/machines/rms-lifting"           },
  { label: "Pile Cage Machines",  path: "/machines/pile-cage/pile-cage-machines" },
];

export default function Footer() {
  return (
    <footer className="relative bg-ink-deep text-white overflow-hidden">
      {/* Animated red sheen along the top edge */}
      <div className="relative h-px w-full bg-white/10 overflow-hidden">
        <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-brand-red to-transparent sheen"></span>
      </div>

      {/* Soft red bloom in the upper-left, very subtle */}
      <div className="pointer-events-none absolute -top-40 -left-32 w-[560px] h-[560px] rounded-full bg-brand-red/[0.08] blur-3xl"></div>

      {/* Schilt partnership */}
      <div className="relative border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-7">
          <SchiltPartnerBadge context="footer" />
        </div>
      </div>

      {/* Body */}
      <div className="relative max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <img
              src="/rms-logo.png"
              alt="RMS"
              className="h-[4.375rem] w-auto object-contain mb-6"
            />
            <p className="text-white/55 text-sm leading-relaxed max-w-xs mb-7">
              Built for the job site. Engineered to last. RMS supplies, services, and supports the rebar machinery that keeps fab shops productive across North America.
            </p>
            <Magnetic>
              <a
                href={COMPANY.phoneMachinesSalesTel}
                className="group inline-flex items-center gap-3 px-4 h-11 rounded-full bg-white/5 border border-white/10 hover:border-brand-red/60 hover:bg-brand-red/10 transition-colors cursor-pointer"
              >
                <span className="w-7 h-7 flex items-center justify-center bg-brand-red rounded-full">
                  <i className="ri-phone-fill text-white text-xs"></i>
                </span>
                <span className="text-white text-sm font-bold tracking-tight">{COMPANY.phoneMachinesSalesDisplay}</span>
              </a>
            </Magnetic>
          </div>

          {/* Navigate */}
          <div className="md:col-span-2">
            <h4 className="text-white/45 text-[10px] font-bold uppercase tracking-[0.3em] mb-5">Navigate</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-white/70 hover:text-white text-sm transition-colors cursor-pointer inline-flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-red opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Equipment */}
          <div className="md:col-span-3">
            <h4 className="text-white/45 text-[10px] font-bold uppercase tracking-[0.3em] mb-5">Equipment</h4>
            <ul className="grid grid-cols-1 gap-3">
              {equipmentLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-white/70 hover:text-white text-sm transition-colors cursor-pointer">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className="md:col-span-3">
            <h4 className="text-white/45 text-[10px] font-bold uppercase tracking-[0.3em] mb-5">Connect</h4>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-md mt-0.5 shrink-0">
                  <i className="ri-mail-line text-brand-red text-base"></i>
                </span>
                <a href={`mailto:${COMPANY.email}`} className="text-white/75 hover:text-white text-sm transition-colors cursor-pointer">
                  {COMPANY.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-md mt-0.5 shrink-0">
                  <i className="ri-map-pin-line text-brand-red text-base"></i>
                </span>
                <span className="text-white/75 text-sm leading-relaxed">
                  {COMPANY.addressLines.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 flex items-center justify-center bg-white/5 border border-white/10 rounded-md mt-0.5 shrink-0">
                  <i className="ri-time-line text-brand-red text-base"></i>
                </span>
                <span className="text-white/75 text-sm leading-relaxed">
                  Mon – Fri · 7:00a – 5:00p PT<br />
                  <span className="text-white/40 text-xs">Saturday by appointment</span>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs">
            &copy; {new Date().getFullYear()} RMS Rebar Machine Service. All rights reserved.
          </p>
          <p className="text-white/30 text-[11px] uppercase tracking-[0.3em]">
            Built for the Job Site · Engineered to Last
          </p>
        </div>
      </div>
    </footer>
  );
}
