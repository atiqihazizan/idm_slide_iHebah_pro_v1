/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],

  theme: {
    extend: {
      backgroundImage: {
        // "thp-image": "url('./img/bg0.jpg')",
      },
      backgroundColor: {
        "thp-color": "#8dc73f",
      },
      colors: {
        thp: "#8dc73f",
        sidebar: "#05142a",
      },
      keyframes: {
        rotate3d: {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "50%": { transform: "rotateX(180deg) rotateY(180deg)" },
          "100%": { transform: "rotateX(360deg) rotateY(360deg)" },
        },
        spinGlobe: {
          "0%": { transform: "rotateY(0deg)" },
          "100%": { transform: "rotateY(360deg)" },
        },
        blink: {
          "0%": { opacity: 1 },
          "50%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
    animation: {
      rotate3d: "rotate3d 5s linear infinite",
      globe: "spinGlobe 10s linear infinite",
      blinking: "blink 2s infinite",
    },
  },
  plugins: [],
};
