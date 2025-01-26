import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";

// https://vite.dev/config/
export default defineConfig({
  base: "./", // Set base untuk memastikan Electron boleh baca fail
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    outDir: "../IDM_slide_electron_pro/iHebah",
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: true,
    minify: "esbuild",
    rollupOptions: {
      output: {
        entryFileNames: "assets/iHebah-[hash].js",
        chunkFileNames: "assets/iHebah-[hash].js",
        assetFileNames: "assets/iHebah-[hash].[ext]",
      },
    },
  },
});
