import { normalizeAppPath } from "./path/normalizePath";
import { Route } from "./Route";

interface RouterOptions {
  /** Сегмент base без завершающего слэша, например из `import.meta.env.BASE_URL`. */
  basePath?: string;
  /** Внутренний путь страницы 404 при неизвестном URL. */
  notFoundPath?: string;
  /**
   * Перед выбором маршрута: можно вернуть другой внутренний путь (редирект).
   * Вызывается из `go` и при старте; не дублировать бесконечные редиректы.
   */
  resolvePath?: (pathname: string) => string;
}

class Router {
  private static __instance: Router | undefined;

  private readonly routes: Route[] = [];

  private readonly history = window.history;

  private _currentRoute: Route | null = null;

  /** Задаётся при первом `new Router()`; при повторном вызове конструктора возвращается синглтон. */
  private readonly _rootQuery!: string;

  private readonly basePath!: string;

  private readonly notFoundPath!: string;

  private readonly resolvePath?: (pathname: string) => string;

  constructor(rootQuery: string, options?: RouterOptions) {
    if (Router.__instance) {
      return Router.__instance;
    }
    this._rootQuery = rootQuery;
    this.basePath = (options?.basePath ?? "").replace(/\/$/, "");
    this.notFoundPath = options?.notFoundPath ?? "";
    this.resolvePath = options?.resolvePath;
    Router.__instance = this;
  }

  use(pathname: string, block: ConstructorParameters<typeof Route>[1]): this {
    const route = new Route(pathname, block, { rootQuery: this._rootQuery });

    this.routes.push(route);

    return this;
  }

  start(): void {
    window.onpopstate = () => {
      this._onRoute(this.getLocationRoutePath());
    };
    this._onRoute(this.getLocationRoutePath());
  }

  go(pathname: string): void {
    const internal = normalizeAppPath(pathname);
    const resolved = this.resolvePath?.(internal) ?? internal;
    const url = this.toHistoryURL(resolved);

    this.history.pushState({}, "", url);
    this._onRoute(resolved);
  }

  back(): void {
    this.history.back();
  }

  forward(): void {
    this.history.forward();
  }

  getRoute(pathname: string): Route | undefined {
    return this.routes.find((route) => route.match(pathname));
  }

  private getLocationRoutePath(): string {
    let path = window.location.pathname;

    if (this.basePath && path.startsWith(this.basePath)) {
      path = path.slice(this.basePath.length) || "/";
    }

    return normalizeAppPath(path);
  }

  private toHistoryURL(internalPath: string): string {
    if (!this.basePath) {
      return internalPath;
    }

    return `${this.basePath}${internalPath === "/" ? "" : internalPath}` || "/";
  }

  private _onRoute(pathname: string): void {
    const normalized = normalizeAppPath(pathname);
    const resolved = this.resolvePath?.(normalized) ?? normalized;

    if (resolved !== normalized) {
      const url = this.toHistoryURL(resolved);

      this.history.replaceState({}, "", url);
      this._onRoute(resolved);

      return;
    }
    const route =
      this.getRoute(normalized) ??
      (this.notFoundPath
        ? this.getRoute(normalizeAppPath(this.notFoundPath))
        : undefined);

    if (!route) {
      return;
    }
    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }
    this._currentRoute = route;
    route.render();
  }
}
export { Router, type RouterOptions };
