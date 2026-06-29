/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Work Sans', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'system-ui', 'sans-serif'],
        'serif-display': ['Fraunces', 'Georgia', 'serif'],
      },
      borderRadius: {
        xl: '0.875rem',
      },
      colors: {
        /* Primary — warm terracotta / orange */
        primary: {
          DEFAULT: 'hsl(15 65% 45%)',
          50: 'hsl(15 65% 95%)',
          100: 'hsl(15 65% 90%)',
          200: 'hsl(15 65% 80%)',
          300: 'hsl(15 65% 70%)',
          400: 'hsl(15 65% 58%)',
          500: 'hsl(15 65% 50%)',
          600: 'hsl(15 65% 45%)',
          700: 'hsl(15 65% 38%)',
          800: 'hsl(15 65% 30%)',
          900: 'hsl(15 65% 22%)',
          foreground: 'hsl(39 38% 97%)',
        },

        /* Accent — teal */
        accent: {
          DEFAULT: 'hsl(168 35% 35%)',
          50: 'hsl(168 35% 92%)',
          100: 'hsl(168 35% 85%)',
          200: 'hsl(168 35% 72%)',
          300: 'hsl(168 35% 58%)',
          400: 'hsl(168 35% 45%)',
          500: 'hsl(168 35% 40%)',
          600: 'hsl(168 35% 35%)',
          700: 'hsl(168 35% 28%)',
          800: 'hsl(168 35% 22%)',
          900: 'hsl(168 35% 16%)',
          foreground: 'hsl(39 38% 97%)',
        },

        /* Backgrounds */
        background: 'hsl(39 38% 96%)',
        foreground: 'hsl(24 22% 14%)',
        card: 'hsl(36 35% 99%)',
        'card-foreground': 'hsl(24 22% 14%)',
        popover: 'hsl(36 35% 99%)',
        'popover-foreground': 'hsl(24 22% 14%)',

        /* Secondary — warm grey */
        secondary: {
          DEFAULT: 'hsl(34 30% 90%)',
          foreground: 'hsl(24 22% 14%)',
        },

        /* Muted */
        muted: {
          DEFAULT: 'hsl(34 25% 92%)',
          foreground: 'hsl(24 12% 38%)',
        },

        /* Destructive */
        destructive: {
          DEFAULT: 'hsl(0 72% 45%)',
          foreground: 'hsl(39 38% 97%)',
        },

        /* Surface & popover */
        surface: 'hsl(36 35% 99%)',
        'surface-foreground': 'hsl(24 22% 14%)',
        popover: 'hsl(36 35% 99%)',
        'popover-foreground': 'hsl(24 22% 14%)',

        /* Border & Input names (used via borderColor.extend below) */
        border: 'hsl(30 20% 84%)',
        input: 'hsl(30 20% 88%)',

        /* Ring */
        ring: 'hsl(15 65% 45%)',

        /* Charts */
        chart: {
          1: 'hsl(15 65% 45%)',
          2: 'hsl(168 35% 35%)',
          3: 'hsl(35 80% 55%)',
          4: 'hsl(24 30% 28%)',
          5: 'hsl(50 60% 60%)',
        },
      },
    },
  },
  plugins: [],
};
