/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          purple: "#704EFD",
          cyan: "#2CB7FF",
          gray: "#F3F4FF",
        },
        secondary: {
          navy: "#091E42",
          light: "#CBE8FF",
          lavender: "#DFD5FF",
        },
        school: {
          adultos: "#432D86",
          infantojuvenil: "#0272AA",
          organizacional: "#B20000",
          neurodesarrollo: "#00770E",
          forense: "#CC6A00",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
