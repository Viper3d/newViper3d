import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: process.env.PORT || 3000,  // Utiliza el puerto proporcionado por Railway o el puerto 3000 por defecto
    host: true  // Asegura que Vite escuche en el host 0.0.0.0 para ser accesible externamente
  }
})
