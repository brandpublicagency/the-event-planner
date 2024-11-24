import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "transparent",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: 'hsl(var(--secondary))',
          100: 'hsl(var(--muted))',
          200: 'hsl(var(--border))',
          300: 'hsl(var(--input))',
          400: 'hsl(var(--muted-foreground))',
          500: 'hsl(var(--primary))',
          600: 'hsl(var(--primary))',
          700: 'hsl(var(--primary))',
          800: 'hsl(var(--primary))',
          900: 'hsl(var(--primary))',
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "7px",
        md: "7px",
        sm: "7px",
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter var', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', '1rem'],
        sm: ['0.8125rem', '1.25rem'],
        base: ['0.875rem', '1.5rem'],
        lg: ['1rem', '1.75rem'],
        xl: ['1.125rem', '1.75rem'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;