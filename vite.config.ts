import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? +process.env.PORT : 8000;

export default defineConfig({
  server: {
    open: true,
    port: PORT,
  },
  build: {
    rollupOptions: {
      input: 'index.html',
      output: {
        // Use lowercase hashes so asset URLs match filenames on case-sensitive servers (e.g. Netlify/Linux)
        hashCharacters: 'base36',
      },
    },
    outDir: 'dist',
  },
  assetsInclude: ['**/*.hbs'],
})
