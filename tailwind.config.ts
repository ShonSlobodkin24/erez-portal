import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: {
    cream: "#FAF8F6", rose: { DEFAULT: "#C97A7E", dark: "#B86B6F" },
    olive: { DEFAULT: "#556B2F", light: "#6B7B4C" } } } },
  plugins: [],
} satisfies Config;
