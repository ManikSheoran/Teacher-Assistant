/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: '#1d2f6f',
        secondary: '#8390fa',
        accent: '#fac748',
        background: '#f9e9ec',
        highlight: '#f88dad',
      },
    },
  },
  variants: {},
  plugins: [],
};
