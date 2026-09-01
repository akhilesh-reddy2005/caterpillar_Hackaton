/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        cat: {
          yellow: "#FFCD11",
          black: "#1A1A1A",
          gray: "#2B2B2B",
        },
      },
    },
  },
  plugins: [],
};
