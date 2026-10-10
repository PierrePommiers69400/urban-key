import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Le site est servi par GitHub Pages à la racine de son domaine, urbankey.fr
 * (déclaré dans public/CNAME).
 */
const BASE = '/'

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react()],
})
