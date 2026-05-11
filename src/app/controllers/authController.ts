import { APP_PATHS } from "@/shared/config/routes";
import { ApiError, authApi } from "@/shared/lib/api";
import type {
  ApiUser,
  SignInRequest,
  SignUpRequest,
} from "@/shared/lib/api/types";
import type { Router } from "@/shared/lib/router";
import { store } from "@/shared/lib/store";
import { HttpStatus } from "@/shared/lib/utils";
import { showErrorToast } from "@/shared/ui/toast";

import { chatsController } from "./chatsController";
import { apiUserToSidebar } from "./mapUserToSidebar";

type SessionSlice = {
  authenticated: boolean;
  initialized: boolean;
};

function setSession(patch: Partial<SessionSlice>): void {
  const session = (store.getState().session ?? {}) as SessionSlice;

  store.setState("session", { ...session, ...patch });
}

function applyLoggedInUser(user: ApiUser): void {
  store.setState("user.profile", user);
  store.setState("user.sidebar", apiUserToSidebar(user));
  setSession({ authenticated: true });
}

function isSessionAlreadyActiveError(e: unknown): boolean {
  if (!(e instanceof ApiError) || e.status !== HttpStatus.BadRequest) {
    return false;
  }
  const reason = e.reason?.trim().toLowerCase() ?? "";

  return (
    reason === "user already in system" || reason.includes("already in system")
  );
}

/**
 * Сброс сессии на API без throw. После нескольких неудачных регистраций/логинов
 * в cookie часто остаётся «битая» сессия — без этого следующие запросы снова падают.
 */
async function tryClearRemoteAuthSession(): Promise<void> {
  try {
    await authApi.logout();
  } catch {
    /* не мешаем потоку */
  }
}

async function finalizeLogin(router: Router): Promise<void> {
  const user = await authApi.getUser();

  applyLoggedInUser(user);
  await chatsController.loadChats();
  router.go(APP_PATHS.messenger);
}

/**
 * Проверка сессии по cookie при старте приложения.
 */
async function initAuthSession(): Promise<void> {
  setSession({ initialized: false, authenticated: false });
  try {
    const user = await authApi.getUser();

    applyLoggedInUser(user);
    await chatsController.loadChats();
  } catch (e) {
    if (
      e instanceof ApiError &&
      (e.status === HttpStatus.Unauthorized ||
        e.status === HttpStatus.BadRequest ||
        e.status === HttpStatus.Forbidden)
    ) {
      store.setState("user", { profile: null, sidebar: undefined });
      store.setState("chats.list", []);
      setSession({ authenticated: false });
      await tryClearRemoteAuthSession();
    } else {
      console.error("[auth]", e);
    }
  } finally {
    setSession({ initialized: true });
  }
}

async function signIn(data: SignInRequest, router: Router): Promise<void> {
  try {
    await authApi.signIn(data);
  } catch (e) {
    if (!isSessionAlreadyActiveError(e)) {
      throw e;
    }
  }
  await finalizeLogin(router);
}

async function signUp(data: SignUpRequest, router: Router): Promise<void> {
  await tryClearRemoteAuthSession();
  await authApi.signUp(data);
  try {
    await authApi.signIn({ login: data.login, password: data.password });
  } catch (e) {
    if (!isSessionAlreadyActiveError(e)) {
      throw e;
    }
  }
  await finalizeLogin(router);
}

async function logout(router: Router): Promise<void> {
  let serverLogoutOk = true;

  try {
    await authApi.logout();
  } catch (e) {
    serverLogoutOk = false;
    console.error(
      "[auth] Logout request failed; session cookies may still be active.",
      e,
    );
  }
  store.setState("user", { profile: null, sidebar: undefined });
  store.setState("chats.list", []);
  store.setState("session", { initialized: true, authenticated: false });
  router.go(APP_PATHS.login);
  if (!serverLogoutOk) {
    showErrorToast(
      "Could not log out on the server. If sign-in then says you are already logged in, refresh the page.",
    );
  }
}

function isAuthInitialized(): boolean {
  return !!(store.getState().session as SessionSlice | undefined)?.initialized;
}

function isAuthenticated(): boolean {
  return !!(store.getState().session as SessionSlice | undefined)
    ?.authenticated;
}

export {
  initAuthSession,
  isAuthenticated,
  isAuthInitialized,
  logout,
  signIn,
  signUp,
};
