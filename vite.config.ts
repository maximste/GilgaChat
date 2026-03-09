import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT ? +process.env.PORT : 3000;

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, 'src')],
      },
    },
  },
  server: {
    open: true,
    port: PORT,
  },
  preview: {
    port: PORT,
  },
  build: {
    rollupOptions: {
      input: 'static/index.html',
      output: {
        hashCharacters: 'base36',
      },
    },
    outDir: 'dist',
  },
  assetsInclude: ['**/*.hbs'],
})
