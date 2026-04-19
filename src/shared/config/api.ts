/** Префикс версии API (со слэшем в начале). */
export const API_PATH_PREFIX = "/api/v2";

/**
 * В `vite dev` по умолчанию HTTP идёт на тот же origin (`/api/v2/...`), Vite проксирует на Practicum.
 * Так cookie сессии привязаны к `localhost`, а не к стороннему домену — Safari и несколько браузеров
 * не конфликтуют из‑за third-party cookie. Отключить: `VITE_API_PROXY=0` в `.env`.
 */
export const isDevApiProxy =
  import.meta.env.DEV && import.meta.env.VITE_API_PROXY !== "0";

/** Хост API без завершающего слэша. В режиме dev-прокси — пусто (относительные URL к dev-серверу). */
export const API_HOST = (
  isDevApiProxy
    ? ""
    : (import.meta.env.VITE_API_HOST ?? "https://ya-praktikum.tech")
).replace(/\/$/, "");

export function apiAbsolutePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;

  if (isDevApiProxy) {
    return `${API_PATH_PREFIX}${p}`;
  }

  return `${API_HOST}${API_PATH_PREFIX}${p}`;
}

/**
 * URL картинки из поля `avatar` в ответах API.
 * Поддерживает: полный `https://…`, путь `/api/v2/resources/…`, относительный `/uuid/file.jpg`.
 */
export function resourceFileUrl(resourcePath: string): string {
  const s = resourcePath.trim();

  if (/^https?:\/\//i.test(s)) {
    return s;
  }

  const p = s.startsWith("/") ? s : `/${s}`;
  const resourcesBase = `${API_PATH_PREFIX}/resources`;

  if (p.startsWith(`${resourcesBase}/`) || p === resourcesBase) {
    return `${API_HOST}${p}`;
  }

  return `${API_HOST}${resourcesBase}${p}`;
}
