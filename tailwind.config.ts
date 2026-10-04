import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0b0d12',
          900: '#10131a',
          850: '#151923',
          800: '#1a1f2b',
          700: '#252b3a',
          600: '#343c50',
          500: '#4b556d',
          400: '#7c86a0',
          300: '#a9b1c6',
          200: '#d3d8e6',
          100: '#eef1f8',
        },
        gold: {
          300: '#f6dc9c',
          400: '#efc56a',
          500: '#e3a93b',
          600: '#b9832a',
        },
        tier: {
          t41: '#c084fc',
          t4: '#60a5fa',
          t3: '#2dd4bf',
          t2: '#a3a3a3',
        },
        good: '#4ade80',
        bad: '#f87171',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'serif'],
      },
      boxShadow: {
        card: '0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 8px 24px -12px rgb(0 0 0 / 0.6)',
      },
    },
  },
  plugins: [],
};

export default config;
