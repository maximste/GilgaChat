/** Хост API без завершающего слэша. */
export const API_HOST = (
  import.meta.env.VITE_API_HOST ?? "https://ya-praktikum.tech"
).replace(/\/$/, "");

/** Префикс версии API (со слэшем в начале). */
export const API_PATH_PREFIX = "/api/v2";

export function apiAbsolutePath(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;

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
