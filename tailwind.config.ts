import type { Config } from 'tailwindcss';
import colors from './tailwind-colors';

const config: Config = {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors,
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        'sm-md': { 'max': '1165px' }, // Custom screen size for 1025px or smaller
      },
    },
  },
  plugins: [],
};

export default config;
