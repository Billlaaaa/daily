import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served at the root of the subdomain https://daily.snake-master.com/,
// so the base path is just "/".
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})
