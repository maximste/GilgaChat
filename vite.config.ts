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
  assetsInclude: ['**/*.hbs']
})
