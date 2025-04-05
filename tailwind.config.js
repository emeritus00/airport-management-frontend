/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"], // Ensure all JS/JSX files are included
  theme: {
    extend: {
      colors: {
        primary: "#1E3A8A", // Dark Blue
        secondary: "#3B82F6", // Lighter Blue
      },
    },
  },
  plugins: [],
};
