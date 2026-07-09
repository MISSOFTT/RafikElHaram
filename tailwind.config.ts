import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#202833",
        graphite: "#343a40",
        muted: "#65717d",
        brand: {
          orange: "#d79536",
          gold: "#b98b43",
          teal: "#0b6b70",
          navy: "#0d2035",
          cream: "#fff8ec"
        }
      },
      boxShadow: {
        soft: "0 18px 60px rgba(20, 30, 43, 0.10)",
        card: "0 12px 40px rgba(22, 32, 45, 0.08)"
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Arial", "sans-serif"]
      }
    }
  },
  plugins: []
};

export default config;
