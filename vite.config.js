import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

/**
 * Le site est servi par GitHub Pages sous /urban-key/. Le jour où un nom de
 * domaine (urbankey.fr) y est branché, repasser BASE à "/" et remplacer
 * SITE_URL dans index.html, public/robots.txt et public/sitemap.xml.
 */
const BASE = '/urban-key/'

// https://vite.dev/config/
export default defineConfig({
  base: BASE,
  plugins: [react()],
})
