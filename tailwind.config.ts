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
        politico: {
          red: "#d32f2f",
          darkRed: "#b71c1c",
          black: "#111111",
          darkGray: "#333333",
          midGray: "#666666",
          lightGray: "#f4f4f4",
          border: "#e2e2e2",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
        sans: ["Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
