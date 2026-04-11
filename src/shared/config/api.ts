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

/** URL для отображения файла по пути из поля `avatar` и т.п. (`GET /resources/{path}`). */
export function resourceFileUrl(resourcePath: string): string {
  const p = resourcePath.startsWith("/") ? resourcePath : `/${resourcePath}`;

  return `${API_HOST}${API_PATH_PREFIX}/resources${p}`;
}
