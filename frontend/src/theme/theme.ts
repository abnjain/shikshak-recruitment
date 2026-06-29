/**
 * Shikshak Recruitment — Design Tokens
 * Shared between tailwind.config.js and other JS/TS files.
 * Source: https://edu-jobs-portal-1.preview.emergentagent.com/
 */
const theme = {
  colors: {
    primary: {
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
    },
    accent: {
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
    },
    surface: {
      DEFAULT: 'hsl(39 38% 96%)',
      card: 'hsl(36 35% 99%)',
      foreground: 'hsl(24 22% 14%)',
      muted: 'hsl(34 25% 92%)',
      'muted-foreground': 'hsl(24 12% 38%)',
    },
    border: {
      DEFAULT: 'hsl(30 20% 84%)',
      input: 'hsl(30 20% 88%)',
    },
    destructive: {
      DEFAULT: 'hsl(0 72% 45%)',
      foreground: 'hsl(39 38% 97%)',
    },
  },
  fontFamily: {
    sans: ['Work Sans', 'system-ui', 'sans-serif'],
    display: ['Outfit', 'system-ui', 'sans-serif'],
    'serif-display': ['Fraunces', 'Georgia', 'serif'],
  },
  borderRadius: {
    xl: '0.875rem',
  },
};

export default theme;
