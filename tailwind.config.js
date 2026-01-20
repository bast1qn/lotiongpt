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
          secondary: "#030304",
          tertiary: "#0a0a0b",
          elevated: "#111113",
          surface: "#171719",
        },
        accent: {
          50: "#eef2ff",
          100: "#e0e7ff",
          200: "#c7d2fe",
          300: "#a5b4fc",
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
        border: {
          subtle: "rgba(255, 255, 255, 0.03)",
          DEFAULT: "rgba(255, 255, 255, 0.06)",
          medium: "rgba(255, 255, 255, 0.1)",
          strong: "rgba(255, 255, 255, 0.15)",
        },
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "16px",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      boxShadow: {
        glow: "0 0 60px rgba(99, 102, 241, 0.12)",
        "glow-sm": "0 0 30px rgba(99, 102, 241, 0.08)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)",
        "gradient-subtle": "linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.02) 100%)",
      },
    },
  },
  plugins: [],
};
