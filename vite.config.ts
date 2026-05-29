import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  preview: {
    allowedHosts: true,
  },
  build: {
    target: "es2020",
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 800,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            if (id.includes("three")) return "three"
            if (id.includes("framer-motion")) return "framer"
            if (id.includes("gsap") || id.includes("lenis")) return "anim"
            if (id.includes("react-router")) return "router"
            if (id.includes("react-icons")) return "icons"
            if (id.includes("react") || id.includes("scheduler")) return "react-vendor"
          }
        },
      },
    },
  },
})
