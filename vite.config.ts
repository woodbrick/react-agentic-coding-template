import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssrManifest: true,
    rollupOptions: {
      input: {
        main: "./index.html",
        "ssr-client": "./src/ssr/entry-client.tsx",
      },
    },
  },
  ssr: {
    noExternal: ["react", "react-dom", "react-router"],
  },
})
