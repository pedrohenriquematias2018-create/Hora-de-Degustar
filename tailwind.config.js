/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#55122a",
        "primary-light": "#571e0b",
        muted: "#ffffff",
      },
    },
  },
  plugins: [],
};
