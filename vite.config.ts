import { defineConfig } from 'vite'
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT ? +process.env.PORT : 8000;

export default defineConfig({
  server: {
    open: true,
    port: PORT,
  },
})