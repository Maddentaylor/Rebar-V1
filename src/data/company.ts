/** Public-facing company facts — single source of truth for contact blocks. */

export const COMPANY = {
  legalName: "Rebar Machine Service",
  displayName: "RMS · Rebar Machine Service",
  shortName: "RMS",
  foundedYear: 1960,
  /** Rough headcount band for About / SEO-style copy */
  employeeRange: "11–50",
  addressLines: ["5935 Emerald Ave.", "Las Vegas, NV 89122"] as const,
  website: "https://www.rebarmachineservice.com",
  websiteHost: "rebarmachineservice.com",
  /**
   * Machine quotes, purchases, and order questions — use this everywhere we surface a voice line until a dedicated support number is finalized.
   */
  phoneMachinesSalesDisplay: "(760) 532-5150",
  phoneMachinesSalesTel: "tel:+17605325150",
  /** Post-sale technical support — add dedicated display + tel fields here when finalized. */

  email: "info@rebarmachineservice.com",
  /** Parts / quoting copy */
  warehouseCity: "Las Vegas",
} as const;

/** Marketing “years” stat: full calendar years since `COMPANY.foundedYear` (Las Vegas storefront / brand continuity). */
export function companyOperatingYears(asOf = new Date()): number {
  return Math.max(0, asOf.getFullYear() - COMPANY.foundedYear);
}

export const SCHILT = {
  legalName: "Schilt Engineering BV",
  shortName: "Schilt Engineering",
  addressLines: ["De Diamant 12", "NL-2872 ZZ Schoonhoven, Netherlands"] as const,
  phoneDisplay: "+31 (0)182 - 38 82 29",
  phoneTel: "tel:+31182388229",
  email: "sales@schiltbv.nl",
  website: "https://www.schiltbv.nl",
  websiteHost: "schiltbv.nl",
  linkedIn: "https://www.linkedin.com/company/schilt-engineering-b-v-/",
  locationBlurb:
    "Schoonhoven, Netherlands — on the river Lek, near the green heart of the Netherlands.",
  facility:
    "11,000+ sq meters — CNC milling and turning, laser cutting, sheet metal, welding, assembly and testing, warehouses.",
  specialty:
    "Mechanical engineering and machine manufacturing for the concrete steel processing sector.",
  knownFor:
    "Advanced automation, complete production lines, in-house components and control systems.",
  market: "Small, medium, and large steel companies worldwide.",
  about: `Schilt Engineering BV is a Netherlands-based manufacturer specializing in rebar and concrete steel processing machinery. All components are largely manufactured in-house at their 11,000+ sq meter facility. They are known for cutting-edge automation and full production line integration. Founded in the historic city of Schoonhoven, they have grown into a globally recognized name in the steel processing industry.`,
} as const;

/** In-app route for the Schilt partnership block (`id="schilt-partner"` on `/about`). */
export const SCHILT_PARTNER_ABOUT_ROUTE = "/about#schilt-partner" as const;
