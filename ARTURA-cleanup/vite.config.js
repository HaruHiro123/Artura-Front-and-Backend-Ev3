import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages uses /ARTURA/; local dev and other hosts use /.
  base: process.env.GITHUB_PAGES === 'true' ? '/ARTURA/' : '/',
  plugins: [
    react(),
    tailwindcss(),
  ],
})