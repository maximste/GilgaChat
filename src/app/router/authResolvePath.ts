import { isAuthenticated, isAuthInitialized } from "@/app/controllers";
import { APP_PATHS } from "@/shared/config/routes";

const PUBLIC_PATHS = new Set<string>([APP_PATHS.login, APP_PATHS.signUp]);

/**
 * Гость: только `/` и `/sign-up`. Авторизованный: с `/` и `/sign-up` на мессенджер.
 */
export function authResolvePath(pathname: string): string {
  if (!isAuthInitialized()) {
    return pathname;
  }

  const authed = isAuthenticated();
  const isPublic = PUBLIC_PATHS.has(pathname);

  if (authed && isPublic) {
    return APP_PATHS.messenger;
  }

  if (!authed && !isPublic) {
    return APP_PATHS.login;
  }

  return pathname;
}
