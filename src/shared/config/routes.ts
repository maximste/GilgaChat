/** Публичные пути приложения (без префикса `import.meta.env.BASE_URL`). */
const APP_PATHS = {
  /** Страница входа */
  login: "/",
  /** Регистрация */
  signUp: "/sign-up",
  /** Настройки профиля */
  settings: "/settings",
  /** Чат */
  messenger: "/messenger",
  notFound: "/404",
  serverError: "/500",
} as const;

type AppPath = (typeof APP_PATHS)[keyof typeof APP_PATHS];

/**
 * Полный `href` для `<a>` (учитывает `base` из Vite).
 * Внутренние пути — как в `APP_PATHS`.
 */
function appHref(internalPath: string): string {
  const base = import.meta.env.BASE_URL;
  let p = internalPath.trim();

  if (p === "" || p === "/") {
    return base.endsWith("/") ? base : `${base}/`;
  }
  if (!p.startsWith("/")) {
    p = `/${p}`;
  }
  const baseNoSlash = base.replace(/\/$/, "");

  if (!baseNoSlash) {
    return p;
  }

  return `${baseNoSlash}${p}`;
}

export { APP_PATHS, appHref, type AppPath };
