import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages: base='/mitsumo_project/'
// Vercel: base='/'
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/mitsumo_project/' : '/',
})
