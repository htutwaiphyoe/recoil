/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        xxs: "320px",
      },
    },
    colors: {
      blue: "#0749A2",
      white: "#fff",
      black: "#010101",
      red: "#E1341E",
      grey: {
        input: "#b0b0b0",
        light: "#e6e6e6",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    styled: true,
    themes: [
      {
        light: {
          ...require("daisyui/src/colors/themes")["[data-theme=light]"],
          primary: "#0749A2",
          error: "#E1341E",
          "base-100": "#ffffff",
        },
      },
    ],
  },
};
