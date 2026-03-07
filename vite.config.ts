import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? +process.env.PORT : 3000;

export default defineConfig({
  base: '/',
  server: {
    open: true,
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
