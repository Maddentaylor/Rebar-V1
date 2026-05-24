/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warm, refined neutrals with a single elevated dark accent.
        canvas: {
          DEFAULT: "#fcfcfb",   // page background — near-white (less muddy taupe)
          raised:  "#ffffff",   // cards, panels — clean lift off the canvas
          sunken:  "#f3f2ef",   // inset blocks
          edge:    "#e6e5e1",   // hairline borders — slightly softer contrast
        },
        ink: {
          DEFAULT: "#1a1a1f",   // primary text
          muted:   "#6b6b75",   // secondary text
          subtle:  "#a3a3ad",   // tertiary text
          deep:    "#0e0f12",   // refined dark surface
        },
        // Brand red — kept tight, with hover/pressed siblings.
        brand: {
          red:    "#D32F2F",
          glow:   "#E94855",
          ruby:   "#b71c1c",
          ember:  "#8B1414",
          // Legacy aliases (prior revamp left some bg-brand-ink references).
          ink:    "#0e0f12",
          steel:  "#1a1a1f",
          graphite: "#21262e",
          ash:    "#9aa1ad",
        },
        // A whisper of warm steel — used for tertiary chips so it isn't all
        // red and gray.
        steelblue: {
          50:  "#f3f5f7",
          100: "#e6eaef",
          400: "#7a8694",
          500: "#5b6471",
          600: "#454c57",
        },
        /**
         * Official partner / Schilt palette — yellow, royal blue, neutrals, accents.
         * Use for About partnership block and Schilt UI; rest of site keeps RMS red.
         */
        partner: {
          yellow: "#FBEA02",
          blue: "#1560B2",
          "blue-deep": "#0f4a8a",
          canvas: "#F9FAF9",
          charcoal: "#282727",
          gray: "#555454",
          olive: "#B0A51D",
          neutral: "#AEAEAE",
          rust: "#8F3317",
        },
        /** Schilt UI tokens — aligned with partner palette */
        schilt: {
          blue: "#1560B2",
          "blue-deep": "#0f4a8a",
          yellow: "#FBEA02",
          "yellow-bright": "#fcf35a",
        },
      },
      fontFamily: {
        display: ["'Inter'", "'DM Sans'", "sans-serif"],
        condensed: ["'Barlow Condensed'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      boxShadow: {
        // Layered, soft shadows. Used for elevated cards and floating glass.
        soft:    "0 1px 0 rgba(15,18,24,0.04), 0 8px 24px -16px rgba(15,18,24,0.16)",
        card:    "0 2px 0 rgba(15,18,24,0.04), 0 18px 40px -20px rgba(15,18,24,0.22)",
        float:   "0 2px 0 rgba(15,18,24,0.05), 0 30px 60px -30px rgba(15,18,24,0.32)",
        ember:   "0 8px 28px -8px rgba(211,47,47,0.42)",
        glow:    "0 12px 48px -16px rgba(233,72,85,0.55)",
        nav:     "0 1px 0 rgba(15,18,24,0.05), 0 8px 24px -16px rgba(15,18,24,0.18)",
      },
      backgroundImage: {
        "ember-radial":     "radial-gradient(60% 60% at 100% 0%, rgba(211,47,47,0.18) 0%, rgba(211,47,47,0) 60%)",
        "diagonal-stripes": "repeating-linear-gradient(135deg, rgba(255,255,255,0.04) 0 1px, transparent 1px 14px)",
        "warm-fade":        "linear-gradient(180deg, #fcfcfb 0%, #f7f7f5 100%)",
        "dark-fade":        "linear-gradient(180deg, #0e0f12 0%, #1a1a1f 100%)",
        "noise":            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.45 0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.55'/></svg>\")",
      },
      animation: {
        "kenburns":  "kenburns 22s ease-out infinite alternate",
        "shimmer":   "shimmer 2.4s linear infinite",
        "float":     "float 7s ease-in-out infinite",
        "scrollcue": "scrollcue 2.2s ease-in-out infinite",
        "blob":      "blob 22s ease-in-out infinite",
      },
      keyframes: {
        kenburns: {
          "0%":   { transform: "scale(1.02)" },
          "100%": { transform: "scale(1.10)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-8px)" },
        },
        scrollcue: {
          "0%":   { transform: "translateY(0)",    opacity: "0.2" },
          "30%":  { opacity: "1" },
          "100%": { transform: "translateY(10px)", opacity: "0" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0,0) scale(1)" },
          "33%":      { transform: "translate(20px,-30px) scale(1.05)" },
          "66%":      { transform: "translate(-25px,15px) scale(0.97)" },
        },
      },
    },
  },
  plugins: [],
};
