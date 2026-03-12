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
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-bg))',
          foreground: 'hsl(var(--sidebar-fg))',
          border: 'hsl(var(--sidebar-border))',
          active: 'hsl(var(--sidebar-active))',
          'active-fg': 'hsl(var(--sidebar-active-fg))',
          hover: 'hsl(var(--sidebar-hover))',
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
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'spin-slow': 'spin 8s linear infinite',
        'rain': 'rain 1.5s linear infinite',
        'snow': 'snow 6s linear infinite',
        'float': 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wind': 'wind 3s ease-in-out infinite',
        'lightning': 'lightning 8s ease-in-out infinite',
        'tooltip-in': 'tooltip-in 0.2s ease-out',
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': {
            'background-position': '0% 50%',
          },
          '50%': {
            'background-position': '100% 50%',
          },
        },
        'rain': {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(100px)', opacity: '0' },
        },
        'snow': {
          '0%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(5px, 15px)' },
          '50%': { transform: 'translate(-5px, 30px)' },
          '75%': { transform: 'translate(5px, 45px)' },
          '100%': { transform: 'translate(0, 60px)', opacity: '0' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
        'wind': {
          '0%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
          '100%': { transform: 'translateX(0)' },
        },
        'lightning': {
          '0%, 91%, 93%, 95%, 100%': { opacity: '0' },
          '92%, 94%, 96%': { opacity: '1' },
        },
        'tooltip-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
