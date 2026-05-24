import { Link } from "react-router-dom";
import Reveal, { Stagger, RevealItem } from "@/components/motion/Reveal";

const pillars = [
  {
    icon: "ri-tools-fill",
    title: "Machines",
    desc: "A full lineup of rebar bending, shearing, and forming equipment for shops of every size.",
    href: "/machines",
    cta: "View lineup",
  },
  {
    icon: "ri-stack-fill",
    title: "Parts",
    desc: "Hundreds of genuine replacement parts in stock, ready to ship from our Las Vegas warehouse.",
    href: "/parts",
    cta: "Shop catalog",
  },
  {
    icon: "ri-customer-service-2-fill",
    title: "Service & Support",
    desc: "Hands-on installation, training, and technical support from people who know the machines.",
    href: "/contact",
    cta: "Get in touch",
  },
];

// Quiet three-up strip that answers "what do you do?" immediately under
// the hero. No backgrounds, no shadows — just hairlines and clean type.
export default function Pillars() {
  return (
    <section className="relative bg-canvas border-y border-canvas-edge">
      <div className="max-w-7xl mx-auto px-6 md:px-10 pt-12 md:pt-14 pb-14 md:pb-16">
        <Reveal>
          <div className="inline-flex items-center gap-3 mb-10 md:mb-12">
            <span className="w-8 h-px bg-brand-red"></span>
            <span className="text-brand-red text-[11px] font-bold uppercase tracking-[0.4em]">
              What We Do
            </span>
          </div>
        </Reveal>

        <Stagger
          stagger={0.08}
          amount={0.2}
          className="grid grid-cols-1 md:grid-cols-3 md:divide-x md:divide-canvas-edge"
        >
          {pillars.map((p, i) => (
            <RevealItem
              key={p.title}
              className={`py-7 md:py-2 ${i === 0 ? "md:pr-10" : i === pillars.length - 1 ? "md:pl-10" : "md:px-10"}`}
            >
              <div className="w-11 h-11 flex items-center justify-center bg-brand-red/10 rounded-xl mb-5">
                <i className={`${p.icon} text-brand-red text-lg`}></i>
              </div>
              <h3
                className="text-ink text-2xl md:text-3xl font-black tracking-tight mb-3"
                style={{ fontFamily: "'Inter', 'DM Sans', sans-serif" }}
              >
                {p.title}
              </h3>
              <p className="text-ink-muted text-sm leading-relaxed mb-6 max-w-xs">{p.desc}</p>
              <Link
                to={p.href}
                className="inline-flex items-center gap-2 text-ink hover:text-brand-red text-[11px] font-bold uppercase tracking-[0.3em] transition-colors cursor-pointer group"
              >
                {p.cta}
                <i className="ri-arrow-right-line transition-transform duration-300 group-hover:translate-x-0.5"></i>
              </Link>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
