/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'purple-brutal': '#7f00ff',
        'pink-brutal': '#ff00ff',
        'yellow-brutal': '#ffd500',
      },
    },
  },
  plugins: [],
}