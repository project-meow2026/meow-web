import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        meow: {
          bg: "#FFFFFF",
          surface: "#FBFBFA",
          card: "#F6F5F2",
          cardHover: "#EFECE6",
          dark: "#111111",
          charcoal: "#1C1C1C",
          muted: "#686868",
          subtle: "#8E8E8E",
          border: "#E7E5E0",
          borderLight: "#F0EFEA",
          sand: "#D8C7B5",
          sandLight: "#F4EFEA",
          terracotta: "#8B5A3C",
          green: "#25D366", // WhatsApp brand green
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "serif"],
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
      },
      aspectRatio: {
        "shoe": "4 / 5",
        "wide": "16 / 9",
        "banner": "21 / 9",
      },
      keyframes: {
        "draw-stroke": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float-layer": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        "draw-stroke": "draw-stroke 2.5s ease-in-out forwards",
        "fade-in-up": "fade-in-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "float-layer": "float-layer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
