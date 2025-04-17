import tailwindTypography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [tailwindTypography()],
};

export default config;
