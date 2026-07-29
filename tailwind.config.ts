import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{md,mdx}",
    "./mdx-components.tsx",
  ],
  theme: {
    extend: {
      colors: {
        // Identidad de la serie "Monetizá tu Influencia"
        tinta: "#1A1A2E",
        coral: {
          DEFAULT: "#FF6B5B",
          600: "#F0523F",
          50: "#FFF1EF",
        },
        crema: "#FBF9F6",
      },
      fontFamily: {
        // serif editorial para títulos, sans para UI (ver app/layout.tsx)
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        lectura: "42rem",
      },
    },
  },
  plugins: [],
};

export default config;
