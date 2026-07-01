import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Production build is served from https://snake-master.com/Daily/,
// but local dev still runs from the root (/).
// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Daily/' : '/',
  plugins: [react()],
}))
