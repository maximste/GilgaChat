import type { Router } from "@/shared/lib/router";

let appRouterRef: Router | null = null;

export function setAppRouter(router: Router): void {
  appRouterRef = router;
}

export function getAppRouter(): Router {
  if (!appRouterRef) {
    throw new Error("Router is not initialized");
  }

  return appRouterRef;
}
