/**
 * "We Help With" tiles — `to` must match a route in src/router/config.tsx.
 */
export type WeHelpWithTopic = { icon: string; label: string; to?: string };

export const weHelpWithTopics: WeHelpWithTopic[] = [
  { icon: "ri-price-tag-3-line", label: "Machine Quotes", to: "/machines" },
  { icon: "ri-tools-line", label: "Parts Orders", to: "/parts" },
  { icon: "ri-settings-3-line", label: "Service & Repair", to: "/about" },
  { icon: "ri-customer-service-2-line", label: "Technical Support", to: "/contact" },
];
