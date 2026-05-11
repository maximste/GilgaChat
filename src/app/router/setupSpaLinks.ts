import { normalizeAppPath, type Router } from "@/shared/lib/router";

/**
 * Внутренние `<a>` того же origin ведут через `router.go` без полной перезагрузки.
 */
function setupSpaLinks(router: Router, basePath: string): void {
  const normalizedBase = basePath.replace(/\/$/, "");

  document.body.addEventListener("click", (event: MouseEvent) => {
    if (event.defaultPrevented) {
      return;
    }
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    const anchor = (event.target as HTMLElement).closest("a[href]");

    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }
    if (anchor.target && anchor.target !== "_self") {
      return;
    }
    if (anchor.hasAttribute("download")) {
      return;
    }
    const url = new URL(anchor.href, window.location.origin);

    if (url.origin !== window.location.origin) {
      return;
    }
    let path = url.pathname;

    if (normalizedBase && path.startsWith(normalizedBase)) {
      path = path.slice(normalizedBase.length) || "/";
    }
    const routePath = normalizeAppPath(path);

    event.preventDefault();
    router.go(routePath);
  });
}

export { setupSpaLinks };
