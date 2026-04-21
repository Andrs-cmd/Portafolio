import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // ... resto de tu configuración (base, etc)
  server: {
    allowedHosts: true // Esto permite cualquier host en desarrollo
  },
  preview: {
    allowedHosts: true // Esto permite que Railway muestre la web sin bloquearla
  }
})