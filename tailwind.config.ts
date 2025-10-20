import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 1. CHANGE 'class' to false to disable dark mode
  darkMode: false,
  theme: {
    extend: {
      colors: {
        // Your ZeroPay Palette
        'primary-dark': '#5d6579ff',   // Deep Navy (For dark bg, headers)
        'primary-light': '#FFFFFF',  // White
        'secondary': '#1E293B',      // Slate Gray (For cards, sidebars)
        'accent': '#10B981',         // Emerald Green (CTAs, success)
        'light-background': '#F8FAFC', // Off-white (For light mode bg)
        'text-dark-primary': '#FFFFFF',
        'text-dark-secondary': '#CBD5E1', // Lighter text on dark bg
        'text-light-primary': '#0F172A',
        'text-light-secondary': '#64748B',
        'status-error': '#EF4444',
        'status-warning': '#F59E0B',
        'status-success': '#22C55E',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem', // 16px
      },
      boxShadow: {
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;