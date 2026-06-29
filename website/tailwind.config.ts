import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        // Design tokens — indigo/blue accent on dark base
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "bg-darker": "hsl(var(--bg-darker))",
        "bg-dark": "hsl(var(--bg-dark))",
        "bg-light": "hsl(var(--bg-light))",
        "bg-lighter": "hsl(var(--bg-lighter))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        "border-muted": "hsl(var(--border-muted))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",

        // Custom Designer Accent Palette
        "accent-blue": "hsl(var(--accent-blue))",
        "accent-amber": "hsl(var(--accent-amber))",
        "accent-emerald": "hsl(var(--accent-emerald))",
        "accent-purple": "hsl(var(--accent-purple))",
        "accent-orange": "hsl(var(--accent-orange))",
        "accent-slate": "hsl(var(--accent-slate))",

        // Map Tailwind standards to our custom designer accents
        indigo: {
          50: "#FDFDFB",
          100: "#FAF9F3",
          200: "#F5F2E6",
          300: "#F0EBD8",
          400: "hsl(var(--accent-purple))", // primary cream accent fallback
          500: "hsl(var(--accent-purple))",
          600: "#DCD0B2",
          700: "#C3B694",
          800: "#AA9B76",
          900: "#918158",
        },
        violet: { 400: "hsl(var(--accent-purple))", 500: "hsl(var(--accent-purple))" },
        blue: { 400: "hsl(var(--accent-blue))", 500: "hsl(var(--accent-blue))" },
        emerald: { 400: "hsl(var(--accent-emerald))", 500: "hsl(var(--accent-emerald))" },
        orange: { 400: "hsl(var(--accent-orange))", 500: "hsl(var(--accent-orange))" },
        rose: { 400: "hsl(var(--accent-orange))", 500: "hsl(var(--accent-orange))" },
        yellow: { 400: "hsl(var(--accent-amber))", 500: "hsl(var(--accent-amber))" },
        cyan: { 400: "hsl(var(--accent-blue))", 500: "hsl(var(--accent-blue))" },
        fuchsia: { 400: "#F0EBD8", 500: "#F0EBD8" },
        sky: { 400: "hsl(var(--accent-blue))", 500: "hsl(var(--accent-blue))" },
        teal: { 400: "hsl(var(--accent-emerald))", 500: "hsl(var(--accent-emerald))" },
        amber: { 400: "hsl(var(--accent-amber))", 500: "hsl(var(--accent-amber))" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.7" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "hero-glow": "radial-gradient(ellipse 80% 50% at 50% -10%, hsl(48 42% 89% / 0.15), transparent)",
      },
    },
  },
  plugins: [],
};

export default config;
