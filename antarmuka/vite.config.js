import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Allow importing from konektor directory at the monorepo level
      '@konektor': '../konektor',
    },
  },
  server: {
    port: 5173,
    open: true,
  },
})
