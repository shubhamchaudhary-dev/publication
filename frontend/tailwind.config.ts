import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: { DEFAULT: '#0D7C66', 600: '#0D7C66', 700: '#0a6655' },
        'dark-blue': { DEFAULT: '#1A3C5E', 900: '#0D1B2E' },
        orange: { DEFAULT: '#E86C2C', 500: '#E86C2C' },
        'page-bg': { light: '#F8FAFC', dark: '#0A0F1C' },
        'card-bg': { light: '#FFFFFF', dark: '#111827' },
        'card-border': { light: '#E2E8F0', dark: '#1F2937' },
        'body-text': { light: '#0F172A', dark: '#F1F5F9' },
        'muted-text': { light: '#64748B', dark: '#94A3B8' },
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Times New Roman', 'Georgia', 'serif'],
        sans: ['Inter', 'Arial', 'Helvetica', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s linear infinite',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
