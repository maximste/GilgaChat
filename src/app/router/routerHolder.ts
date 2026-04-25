import type { Router } from "@/shared/lib/router";

let appRouterRef: Router | null = null;

function setAppRouter(router: Router): void {
  appRouterRef = router;
}

function getAppRouter(): Router {
  if (!appRouterRef) {
    throw new Error("Router is not initialized");
  }

  return appRouterRef;
}

export { getAppRouter, setAppRouter };
