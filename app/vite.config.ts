import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Pinning `target` explicitly (instead of relying on Vite's default
    // `"modules"`) ensures Vite/esbuild down-levels syntax that newer Chrome
    // supports but constrained Android 9 builds do not (e.g. ES2022 class
    // fields, top-level await). The matching `.browserslistrc` lists the
    // minimum environment we still want to support.
    target: 'es2019',
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
