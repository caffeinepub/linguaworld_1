import typography from "@tailwindcss/typography";
import containerQueries from "@tailwindcss/container-queries";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["index.html", "src/**/*.{js,ts,jsx,tsx,html,css}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ['"Bricolage Grotesque"', "sans-serif"],
        body: ['"Outfit"', "sans-serif"],
        accent: ['"Cabinet Grotesk"', "sans-serif"],
      },
      colors: {
        border: "oklch(var(--border))",
        input: "oklch(var(--input))",
        ring: "oklch(var(--ring) / <alpha-value>)",
        background: "oklch(var(--background))",
        foreground: "oklch(var(--foreground))",
        primary: {
          DEFAULT: "oklch(var(--primary) / <alpha-value>)",
          foreground: "oklch(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "oklch(var(--secondary) / <alpha-value>)",
          foreground: "oklch(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "oklch(var(--destructive) / <alpha-value>)",
          foreground: "oklch(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "oklch(var(--muted) / <alpha-value>)",
          foreground: "oklch(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "oklch(var(--accent) / <alpha-value>)",
          foreground: "oklch(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "oklch(var(--popover))",
          foreground: "oklch(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "oklch(var(--card))",
          foreground: "oklch(var(--card-foreground))",
        },
        chart: {
          1: "oklch(var(--chart-1))",
          2: "oklch(var(--chart-2))",
          3: "oklch(var(--chart-3))",
          4: "oklch(var(--chart-4))",
          5: "oklch(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "oklch(var(--sidebar))",
          foreground: "oklch(var(--sidebar-foreground))",
          primary: "oklch(var(--sidebar-primary))",
          "primary-foreground": "oklch(var(--sidebar-primary-foreground))",
          accent: "oklch(var(--sidebar-accent))",
          "accent-foreground": "oklch(var(--sidebar-accent-foreground))",
          border: "oklch(var(--sidebar-border))",
          ring: "oklch(var(--sidebar-ring))",
        },
        lingua: {
          green: "oklch(var(--lingua-green))",
          "green-light": "oklch(var(--lingua-green-light))",
          amber: "oklch(var(--lingua-amber))",
          "amber-light": "oklch(var(--lingua-amber-light))",
          gold: "oklch(var(--lingua-gold))",
          cream: "oklch(var(--lingua-cream))",
          ink: "oklch(var(--lingua-ink))",
          coral: "oklch(var(--lingua-coral))",
          sky: "oklch(var(--lingua-sky))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "1.5rem",
      },
      boxShadow: {
        xs: "0 1px 2px 0 oklch(0.18 0.04 260 / 5%)",
        sm: "0 2px 8px 0 oklch(0.18 0.04 260 / 8%)",
        md: "0 4px 16px 0 oklch(0.18 0.04 260 / 10%)",
        lg: "0 8px 32px 0 oklch(0.18 0.04 260 / 12%)",
        xl: "0 16px 48px 0 oklch(0.18 0.04 260 / 14%)",
        glow: "0 0 24px oklch(0.72 0.16 55 / 40%)",
        "glow-green": "0 0 24px oklch(0.35 0.12 152 / 30%)",
        card: "0 2px 8px oklch(0.18 0.04 260 / 6%), 0 1px 2px oklch(0.18 0.04 260 / 4%)",
        "card-hover": "0 8px 32px oklch(0.18 0.04 260 / 12%), 0 2px 8px oklch(0.18 0.04 260 / 6%)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "xp-pop": {
          "0%": { transform: "scale(0.5)", opacity: "0" },
          "60%": { transform: "scale(1.2)", opacity: "1" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "xp-pop": "xp-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        shimmer: "shimmer 2s linear infinite",
        "bounce-in": "bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [typography, containerQueries, animate],
};
