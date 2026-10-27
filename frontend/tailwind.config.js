/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#020617",
        midnight: "#040a1a",
        graphite: "#0a1226",
        panel: "#0f1930",
        line: "rgba(255,255,255,0.08)",
        cool: "#8d98ad",
        electric: "#2f6bff",
        violet: "#7c5cff",
      },
      fontFamily: {
        sans: ["'Exo 2'", "sans-serif"],
        exo: ["'Exo 2'", "sans-serif"],
        mono: ["'Exo 2'", "monospace"],
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(47,107,255,.35), 0 10px 40px -10px rgba(47,107,255,.35)",
      },
      keyframes: {
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        marqueerev: { from: { transform: "translateX(-50%)" }, to: { transform: "translateX(0)" } },
        spin: { to: { transform: "rotate(360deg)" } },
        spinrev: { to: { transform: "rotate(-360deg)" } },
        aurora1: { "0%,100%": { transform: "translate(0,0) scale(1)" }, "50%": { transform: "translate(8%,10%) scale(1.15)" } },
        aurora2: { "0%,100%": { transform: "translate(0,0) scale(1.1)" }, "50%": { transform: "translate(-10%,-6%) scale(0.95)" } },
        sheen: { "0%": { backgroundPosition: "200% 0" }, "100%": { backgroundPosition: "-200% 0" } },
      },
      animation: {
        float: "float 6s ease-in-out infinite", shimmer: "shimmer 1.6s infinite",
        marquee: "marquee 32s linear infinite", "marquee-rev": "marqueerev 32s linear infinite",
        "spin-slow": "spin 60s linear infinite", "spin-slower": "spin 90s linear infinite",
        "spinrev-slow": "spinrev 60s linear infinite", "spinrev-slower": "spinrev 90s linear infinite",
        aurora1: "aurora1 18s ease-in-out infinite", aurora2: "aurora2 22s ease-in-out infinite", sheen: "sheen 8s linear infinite",
      },
    },
  },
  plugins: [],
};
