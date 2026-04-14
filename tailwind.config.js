/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        "brand-red": "oklch(0.77 0.18 186.55)",
      },
    },
  },
  plugins: [],
};
