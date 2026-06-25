import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        debug: resolve(__dirname, 'debug.html'),
      },
    },
  },
  // When deploying to GitHub Pages under a branch-name subfolder,
  // set the VITE_BASE env var (e.g. "/repo/branch-name/").
  base: process.env.VITE_BASE ?? '/',
})
