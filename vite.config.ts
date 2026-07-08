import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "tailwindcss";
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/functions": {
        target: "https://useejgiprosrfiabgukn.supabase.co",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/functions/, "/functions/v1"),
      },
    },
  },
})
