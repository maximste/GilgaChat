/** Нормализует сегмент пути приложения (ведущий `/`, корень как `/`). */
export function normalizeAppPath(pathname: string): string {
  const trimmed = pathname.trim();

  if (trimmed === "" || trimmed === "/") {
    return "/";
  }

  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
