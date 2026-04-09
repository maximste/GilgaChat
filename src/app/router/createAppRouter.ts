import { NotFoundPage } from "@/pages/notFound";
import { ProfileRoutePage } from "@/pages/profile";
import { ServerErrorPage } from "@/pages/serverError";
import { APP_PATHS } from "@/shared/config/routes";
import { Router } from "@/shared/lib/router";

import {
  AuthScreenBlock,
  MessengerRouteBlock,
  RegisterScreenBlock,
} from "./routeBlocks";

export function createAppRouter(): Router {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  const router = new Router("#app", {
    basePath,
    notFoundPath: APP_PATHS.notFound,
  });

  return router
    .use(APP_PATHS.login, AuthScreenBlock)
    .use(APP_PATHS.signUp, RegisterScreenBlock)
    .use(APP_PATHS.settings, ProfileRoutePage)
    .use(APP_PATHS.messenger, MessengerRouteBlock)
    .use(APP_PATHS.notFound, NotFoundPage)
    .use(APP_PATHS.serverError, ServerErrorPage);
}
