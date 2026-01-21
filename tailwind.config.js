/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "#000000",
          secondary: "#010101",
          tertiary: "#08080a",
          elevated: "#0f0f12",
          surface: "#141417",
          hover: "#1a1a1e",
        },
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          450: "#7f88f7",
          500: "#6366f1",
          550: "#5a5eef",
          600: "#4f46e5",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.02)",
          DEFAULT: "rgba(255, 255, 255, 0.05)",
          medium: "rgba(255, 255, 255, 0.08)",
          strong: "rgba(255, 255, 255, 0.12)",
          accent: "rgba(99, 102, 241, 0.45)",
        },
      },
      borderRadius: {
        xs: "3px",
        sm: "5px",
        md: "7px",
        lg: "9px",
        xl: "11px",
        "2xl": "14px",
        "3xl": "18px",
        "4xl": "24px",
        "5xl": "28px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 40px rgba(99, 102, 241, 0.1)",
        "glow-strong": "0 0 80px rgba(99, 102, 241, 0.15)",
        "glow-ultra": "0 0 120px rgba(99, 102, 241, 0.20)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.03)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        "gradient-accent": "linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)",
        "gradient-subtle": "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
        "gradient-shine": "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
        "gradient-shine-strong": "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
        "gradient-glow-top": "radial-gradient(ellipse 150% 100% at 50% 0%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)",
      },
      letterSpacing: {
        tight: "-0.015em",
      },
      animation: {
        "aurora-pulse": "auroraShift 20s ease-in-out infinite",
        "float-slow": "floatSlow 7s ease-in-out infinite",
        "float-gentle": "floatGentle 5s ease-in-out infinite",
      },
      transitionDuration: {
        "180": "180ms",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
