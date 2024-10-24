import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Listen on all addresses
    port: 5173,
    strictPort: true,
    hmr: {
      clientPort: 443, // Force HMR through HTTPS
      host: process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co'
    }
  },
  preview: {
    host: true,
    port: 5173,
    strictPort: true
  }
});