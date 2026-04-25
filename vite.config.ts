import { copyFileSync, existsSync } from 'node:fs';
import type { IncomingMessage } from 'node:http';
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

    /**
    * Это middleware для SPA fallback в dev: 
    * для «неизвестных» путей он подменяет req.url на index.html, чтобы при прямом заходе 
    * на /messenger/... отдалась одностраничка, а не 404.
    * Цепочка такая: сначала проверяют пути, которые нельзя превращать в index.html. 
    * Для них вызывают next() и выходят — запрос идёт дальше по обычной цепочке
    * Vite (модули, HMR, статика, прокси).
    */
    if (
      afterBase === '/' ||
      afterBase === '' ||
      afterBase.startsWith('/@') ||
      afterBase.startsWith('/node_modules/') ||
      afterBase.startsWith('/src/') ||
      afterBase.startsWith('/api/') ||
      afterBase.startsWith('/ws/')
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

const PRACTICUM_ORIGIN = 'https://ya-praktikum.tech';

/**
 * Бэкенд отдаёт Set-Cookie с Domain=ya-praktikum.tech и Secure.
 * Запросы идут на http://localhost — без правки браузер не сохраняет cookie, getUser → 401.
 */
function rewritePracticumSetCookieHeaders(proxyRes: IncomingMessage): void {
  const raw = proxyRes.headers['set-cookie'];

  if (raw == null) {
    return;
  }

  const cookies = Array.isArray(raw) ? raw : [raw];

  proxyRes.headers['set-cookie'] = cookies.map((cookie) => {
    let c = cookie;

    c = c.replace(/;\s*Domain=[^;]*/gi, '');
    c = c.replace(/;\s*Secure\b/gi, '');
    c = c.replace(/;\s*SameSite=None\b/gi, '; SameSite=Lax');

    return c;
  });
}

function practicumApiProxy(): {
  target: string;
  changeOrigin: boolean;
  secure: boolean;
  configure(proxy: {
    on: (ev: string, fn: (res: IncomingMessage) => void) => void;
  }): void;
} {
  return {
    target: PRACTICUM_ORIGIN,
    changeOrigin: true,
    secure: true,
    configure(proxy) {
      proxy.on('proxyRes', (proxyRes) => {
        rewritePracticumSetCookieHeaders(proxyRes);
      });
    },
  };
}

function practicumWsProxy(): {
  target: string;
  changeOrigin: boolean;
  secure: boolean;
  ws: boolean;
} {
  return {
    target: PRACTICUM_ORIGIN,
    changeOrigin: true,
    secure: true,
    ws: true,
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
    proxy: {
      '/api': practicumApiProxy(),
      '/ws': practicumWsProxy(),
    },
  },
  preview: {
    port: PORT,
    proxy: {
      '/api': practicumApiProxy(),
      '/ws': practicumWsProxy(),
    },
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
