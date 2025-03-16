/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const darkMode = "class";
export const theme = {
  extend: {
    colors: {
      primary: '#1d2f6f',
      secondary: '#8390fa',
      accent: '#fac748',
      background: '#f9e9ec',
      highlight: '#f88dad',
    },
  },
};
export const variants = {};
export const plugins = [];
