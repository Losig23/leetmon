import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  worker: { format: 'es' },
  // Pre-bundle the worker's deps so the first Run doesn't trigger a dev-server reload.
  optimizeDeps: { include: ['sucrase'] },
  build: { chunkSizeWarningLimit: 1500 },
})
