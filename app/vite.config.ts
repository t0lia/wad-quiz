import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/wad-quiz/',
  plugins: [react()],
  // When deploying to GitHub Pages under a branch-name subfolder,
  // set the VITE_BASE env var (e.g. "/repo/branch-name/").
  base: process.env.VITE_BASE ?? '/',
})
