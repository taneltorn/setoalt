/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/setonoot/',
  server: {
    host: true,
    port: 5173
  },
  plugins: [react()],
  envDir: '../',
})
