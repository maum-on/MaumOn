/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kakaoGreen: "#9CD841",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-7deg)" },
          "50%": { transform: "rotate(7deg)" },
        },
      },
      animation: {
        wiggle: "wiggle 0.4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
