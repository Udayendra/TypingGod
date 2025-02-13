import { color } from "framer-motion";
import { s } from "framer-motion/client";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        backgroundcolor: "rgba(var(--backgroundcolor))",
        textcolor: "rgba(var(--textcolor))",
        backgroundcolor2: "rgba(var(--backgroundcolor2))",
        redcolor: "rgba(var(--redcolor))",
        graycolor: "rgba(var(--graycolor))",
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        openSans: ['Open Sans', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-in-out",
        sunrise: "sunrise .5s ease-in-out",
        sunset: "sunset .5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        sunrise: {
          "0%": {
            opacity: "0",
            transform: " rotate(-180deg)",
          },
          "100%": {
            opacity: "1",
            transform: " rotate(0deg)",
          },
        },
        sunset: {
          "0%": {
            opacity: "1",
            transform: " rotate(0deg)",
          },
          "100%": {
            opacity: "0",
            transform: " rotate(180deg)",
          },
        },
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
