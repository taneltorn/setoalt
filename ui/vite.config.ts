/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const base = new URL(process.env.VITE_PUBLIC_URL || '/', 'http://localhost').pathname;

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 5173
  },
  plugins: [react()],
  envDir: '../',
  base: base || '/',
})
