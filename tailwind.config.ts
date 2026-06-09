import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
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
        sans: ["var(--font-sans-serif)"],
        serif: ["Playfair Display", "serif"],
        "dm-sans": ["var(--font-dm-sans)"],
        "pp-neue-corp-compact": ["var(--font-pp-neue-corp-compact)"],
        control: ["var(--font-dm-sans)"],
        "control-compressed": ["var(--font-pp-neue-corp-compact)"],
        "control-cursive": ["var(--font-pp-neue-corp-compact)"],
        "control-tnt": ["var(--font-sans-serif)"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        "concrete-canvas": "var(--color-concrete-canvas)",
        "cream-card": "var(--color-cream-card)",
        ink: "var(--color-ink)",
        "pure-black": "var(--color-pure-black)",
        "paper-white": "var(--color-paper-white)",
        "citra-orange": "var(--color-citra-orange)",
        "ion-violet": "var(--color-ion-violet)",
        "hazard-yellow": "var(--color-hazard-yellow)",
        /* New Pastel Colors from reference images */
        "pastel-sand": "var(--color-pastel-sand)",
        "pastel-sage": "var(--color-pastel-sage)",
        "pastel-rose": "var(--color-pastel-rose)",
        "pastel-peach": "var(--color-pastel-peach)",
        "pastel-lime": "var(--color-pastel-lime)",

        /* Legacy aliases mapping to Caldera */
        "sky-canvas": "var(--color-concrete-canvas)",
        "action-blue": "var(--color-citra-orange)",
        "action-green": "var(--color-pure-black)",
        "midnight-ink": "var(--color-ink)",
        "cloud-white": "var(--color-cream-card)",
        "charcoal-text": "var(--color-ink)",
        "haze-grey": "var(--color-concrete-canvas)",
        
        primary: {
          DEFAULT: "var(--color-citra-orange)",
          foreground: "var(--color-paper-white)",
        },
        secondary: {
          DEFAULT: "var(--color-cream-card)",
          foreground: "var(--color-ink)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "var(--color-concrete-canvas)",
          foreground: "var(--color-ink)",
        },
        accent: {
          DEFAULT: "var(--color-citra-orange)",
          foreground: "var(--color-paper-white)",
        },
        popover: {
          DEFAULT: "var(--color-cream-card)",
          foreground: "var(--color-ink)",
        },
        card: {
          DEFAULT: "var(--color-cream-card)",
          foreground: "var(--color-ink)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        tags: "var(--radius-tags)",
        cards: "var(--radius-cards)",
        pills: "var(--radius-pills)",
        inputs: "var(--radius-inputs)",
        buttons: "var(--radius-buttons)",
        links: "var(--radius-buttons)",
        images: "var(--radius-cards)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "15%": { transform: "scale(1.15)" },
          "30%": { transform: "scale(1)" },
          "45%": { transform: "scale(1.15)" },
          "60%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "heartbeat": "heartbeat 1.5s ease-in-out infinite",
        "noise-jitter": "noise-jitter 0.8s infinite",
        "float-slow": "float-slow 20s ease-in-out infinite",
        "pan-slow": "pan-slow 30s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
