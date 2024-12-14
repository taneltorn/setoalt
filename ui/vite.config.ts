/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  plugins: [react()],
  envDir: '../',
  base: process.env.VITE_PATH_PREFIX || "/"
})
