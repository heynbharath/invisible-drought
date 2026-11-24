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
        drought: {
          bg: "#0B100E",
          secondary: "#121A16",
          surface: "#18221C",
          surfaceHover: "#202D25",
          border: "#28382F",
          borderLight: "#384E42",
          text: "#F0F0E8",
          textMuted: "#A6B1A8",
          textDim: "#6C7970",
          vegetation: "#8BAF72",
          vegetationLight: "#A8CE8E",
          water: "#6D9EBA",
          waterLight: "#8EC1DD",
          soil: "#C69B65",
          soilLight: "#E0B783",
          alert: "#C56E63",
          alertLight: "#DD877C",
          highlight: "#E6D5AC",
        },
      },
      fontFamily: {
        serif: ["Newsreader", "Charter", "Georgia", "Cambria", "serif"],
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      boxShadow: {
        "editorial": "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
        "subtle": "0 2px 10px rgba(0, 0, 0, 0.4)",
        "glow-green": "0 0 25px rgba(139, 175, 114, 0.15)",
        "glow-blue": "0 0 25px rgba(109, 158, 186, 0.15)",
        "glow-amber": "0 0 25px rgba(198, 155, 101, 0.15)",
        "glow-alert": "0 0 25px rgba(197, 110, 99, 0.15)",
      },
    },
  },
  plugins: [],
};
export default config;
