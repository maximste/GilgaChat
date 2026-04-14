/**
 * Нормализует внутренний путь приложения: ведущий `/`, корень как `/`,
 * регистр не влияет (`/Settings` и `/settings` — один маршрут).
 */
export function normalizeAppPath(pathname: string): string {
  const trimmed = pathname.trim().toLowerCase();

  if (trimmed === "" || trimmed === "/") {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
