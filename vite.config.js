import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import markdown from 'vite-plugin-markdown';

export default defineConfig({
  plugins: [
    react(),
    markdown({
      mode: ['html', 'toc'],
    })
  ],
  base: '/blog/',
  assetsInclude: ['**/*.md'],
  build: {
    outDir: 'dist',
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      }
    }
  },
  resolve: {
    alias: {
      buffer: 'buffer/',
      process: 'process/browser',
    }
  }
});