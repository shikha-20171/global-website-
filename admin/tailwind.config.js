/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#ffffff",
        midnight: "#f8fafc",
        graphite: "#ffffff",
        panel: "#f1f5f9",
        line: "#e2e8f0",
        cool: "#475569",
        electric: "#2563eb",
        violet: "#7c3aed",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "'Segoe UI'", "Roboto", "sans-serif"],
        exo: ["'Exo 2'", "sans-serif"],
      },
    },
  },
  plugins: [],
};
