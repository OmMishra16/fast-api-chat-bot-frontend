import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  server: {
    proxy: mode === 'development' ? {
      '/api': {
        target: 'http://13.232.251.152',
        changeOrigin: true,
        secure: false,
      },
    } : undefined,
  },
})); 