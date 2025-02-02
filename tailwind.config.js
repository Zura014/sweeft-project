/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    screens: {
      xs: "420px",
      sm: "576px",
      md: "768px",
      lg: "1080px",
      xl: "1280px",
      xxl: "1440px",
    },
    extend: {
      fontFamily: {
        primaryFont: ["Inter", "sans-serif"],
      },
      colors: {
        borderC: "#c3c6d4",
      },
    },
  },
  plugins: [],
};
