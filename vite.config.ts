import { copyFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Connect, type Plugin } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PORT = process.env.PORT ? +process.env.PORT : 3000;

/** Последний сегмент пути похож на статический файл (не переписываем на index.html). */
const STATIC_FILE_RE = /\.[a-z0-9]{1,12}$/i;

/**
 * Сохранение маршрута при F5 и прямом заходе по URL (History API + pathname).
 *
 * - **Dev / preview:** переписываем запрос на `index.html`, если путь под base не указывает на файл.
 * - **GitHub Pages:** нет rewrite на сервере; при запросе вроде `/GilgaChat/messenger` хостинг
 *   отдаёт тот же HTML через `404.html` (копия `index.html`). Это не «ошибка приложения»,
 *   а единственный способ отдать оболочку SPA для глубокого пути; дальше Router читает pathname.
 */
function spaReloadSupportPlugin(): Plugin {
  let viteBase = '/';

  return {
    name: 'spa-reload-support',
    configResolved(config) {
      viteBase = config.base;
    },
    configureServer(server) {
      server.middlewares.use(createSpaFallbackMiddleware(viteBase));
    },
    configurePreviewServer(server) {
      server.middlewares.use(createSpaFallbackMiddleware(viteBase));
    },
    closeBundle() {
      const indexHtml = path.resolve(__dirname, 'dist', 'index.html');
      const notFoundHtml = path.resolve(__dirname, 'dist', '404.html');

      if (existsSync(indexHtml)) {
        copyFileSync(indexHtml, notFoundHtml);
      }
    },
  };
}

function createSpaFallbackMiddleware(baseRaw: string): Connect.NextHandleFunction {
  const baseNoSlash = baseRaw.replace(/\/$/, '');

  return (req, _res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      next();

      return;
    }

    const raw = req.url;

    if (!raw) {
      next();

      return;
    }

    const [pathname, query] = raw.split('?');
    const qs = query ? `?${query}` : '';

    if (baseNoSlash && !pathname.startsWith(`${baseNoSlash}/`) && pathname !== baseNoSlash) {
      next();

      return;
    }

    const afterBase = baseNoSlash
      ? pathname.slice(baseNoSlash.length) || '/'
      : pathname;

    if (
      afterBase === '/' ||
      afterBase === '' ||
      afterBase.startsWith('/@') ||
      afterBase.startsWith('/node_modules/') ||
      afterBase.startsWith('/src/')
    ) {
      next();

      return;
    }

    const segments = afterBase.split('/').filter(Boolean);
    const last = segments[segments.length - 1] ?? '';

    if (STATIC_FILE_RE.test(last)) {
      next();

      return;
    }

    const indexPath = baseNoSlash ? `${baseNoSlash}/index.html` : '/index.html';

    req.url = `${indexPath}${qs}`;
    next();
  };
}

export default defineConfig({
  base: process.env.BASE_PATH || '/',
  plugins: [spaReloadSupportPlugin()],
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
      input: 'index.html',
      output: {
        hashCharacters: 'base36',
      },
    },
    outDir: 'dist',
  },
  assetsInclude: ['**/*.hbs'],
})
