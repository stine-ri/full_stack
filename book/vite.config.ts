import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  // other vite config options
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
