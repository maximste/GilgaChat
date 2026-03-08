import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? +process.env.PORT : 3000;

export default defineConfig({
  base: process.env.BASE_PATH || '/',
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
