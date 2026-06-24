import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Signature accent — vermilion coral used for "breaking" + likes
        accent: {
          DEFAULT: "#FF5436",
          soft: "#FF7A63",
          ink: "#B5301B",
        },
        paper: "#FAFAF7",
        ink: "#0A0A0B",
        surface: {
          light: "#FFFFFF",
          dark: "#16161A",
          darker: "#101013",
        },
      },
      fontFamily: {
        sans: [
          "Pretendard Variable",
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "Roboto",
          "Helvetica Neue",
          "Segoe UI",
          "Apple SD Gothic Neo",
          "Noto Sans KR",
          "Malgun Gothic",
          "sans-serif",
        ],
      },
      boxShadow: {
        card: "0 10px 40px -12px rgba(0,0,0,0.45)",
        glow: "0 0 0 4px rgba(255,84,54,0.15)",
      },
      keyframes: {
        "pop": {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.35)" },
          "100%": { transform: "scale(1)" },
        },
        "rise": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "shimmer": {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        pop: "pop 0.4s ease-out",
        rise: "rise 0.4s ease-out both",
        shimmer: "shimmer 1.4s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
