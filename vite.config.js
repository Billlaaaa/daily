import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production build is served from https://snake-master.com/daily/,
// but local dev still runs from the root (/).
// The base MUST match the GitHub Pages repo name (repo "daily" -> "/daily/").
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/daily/' : '/',
  plugins: [react()],
}))
