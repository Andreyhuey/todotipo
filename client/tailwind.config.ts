import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1.25rem', md: '2rem', lg: '2.5rem' },
      screens: { '2xl': '1320px' },
    },
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-display)', 'Georgia', 'serif'],
        body: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Brand palette
        ink: {
          DEFAULT: '#18201B',
          soft: '#2A332D',
        },
        forest: {
          50: '#EEF3EF',
          100: '#D6E2D9',
          200: '#AFC5B4',
          300: '#7FA087',
          400: '#557C5F',
          500: '#3B6046',
          600: '#2D4B36',
          700: '#243C2C',
          800: '#1C2F23',
          900: '#14221A',
        },
        oak: {
          50: '#FBF6EF',
          100: '#F3E7D5',
          200: '#E6CDA9',
          300: '#D5AE7A',
          400: '#C39155',
          500: '#A8743F',
          600: '#8C5D33',
          700: '#6F482A',
          800: '#553823',
          900: '#3E291B',
        },
        linen: {
          DEFAULT: '#F6F2EA',
          100: '#FBF9F5',
          200: '#F6F2EA',
          300: '#EDE6D9',
          400: '#DFD5C3',
        },
        stone: {
          50: '#FAFAF9',
          100: '#F4F3F1',
          200: '#E6E4E0',
          300: '#D3D0CA',
          400: '#A9A49B',
          500: '#7C776E',
          600: '#5E5A53',
          700: '#46433E',
          800: '#2F2D2A',
          900: '#1C1B19',
        },
        // shadcn/ui semantic tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xs: '2px',
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(24 32 27 / 0.05)',
        soft: '0 10px 40px -12px rgb(24 32 27 / 0.18)',
        lift: '0 24px 60px -20px rgb(24 32 27 / 0.35)',
      },
      letterSpacing: {
        eyebrow: '0.18em',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'ken-burns': {
          from: { transform: 'scale(1.08)' },
          to: { transform: 'scale(1)' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'overlay-in': { from: { opacity: '0' }, to: { opacity: '1' } },
        'content-in': {
          from: { opacity: '0', transform: 'translate(-50%, -48%) scale(0.97)' },
          to: { opacity: '1', transform: 'translate(-50%, -50%) scale(1)' },
        },
        progress: { from: { width: '0%' }, to: { width: '100%' } },
        'sheet-in': {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ken-burns': 'ken-burns 7s ease-out both',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'overlay-in': 'overlay-in 0.2s ease-out',
        'content-in': 'content-in 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        progress: 'progress 6s linear forwards',
        'sheet-in': 'sheet-in 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
