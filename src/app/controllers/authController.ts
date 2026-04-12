import { APP_PATHS } from "@/shared/config/routes";
import { ApiError, authApi } from "@/shared/lib/api";
import type {
  ApiUser,
  SignInRequest,
  SignUpRequest,
} from "@/shared/lib/api/types";
import type { Router } from "@/shared/lib/router";
import { store } from "@/shared/lib/store";

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
  if (!(e instanceof ApiError) || e.status !== 400) {
    return false;
  }

  const reason = e.reason?.trim().toLowerCase() ?? "";

  return (
    reason === "user already in system" || reason.includes("already in system")
  );
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
export async function initAuthSession(): Promise<void> {
  setSession({ initialized: false, authenticated: false });

  try {
    const user = await authApi.getUser();

    applyLoggedInUser(user);
    await chatsController.loadChats();
  } catch (e) {
    if (e instanceof ApiError && (e.status === 401 || e.status === 400)) {
      store.setState("user", { profile: null, sidebar: undefined });
      store.setState("chats.list", []);
      store.setState("chats.kindById", {});
      store.setState("messenger", { searchFilter: "" });
      setSession({ authenticated: false });
    } else {
      console.error("[auth]", e);
    }
  } finally {
    setSession({ initialized: true });
  }
}

export async function signIn(
  data: SignInRequest,
  router: Router,
): Promise<void> {
  try {
    await authApi.signIn(data);
  } catch (e) {
    if (!isSessionAlreadyActiveError(e)) {
      throw e;
    }
  }

  await finalizeLogin(router);
}

export async function signUp(
  data: SignUpRequest,
  router: Router,
): Promise<void> {
  await authApi.signUp(data);
  await finalizeLogin(router);
}

export async function logout(router: Router): Promise<void> {
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
  store.setState("chats.kindById", {});
  store.setState("messenger", { searchFilter: "" });
  store.setState("session", { initialized: true, authenticated: false });
  router.go(APP_PATHS.login);

  if (!serverLogoutOk) {
    window.alert(
      "Could not log out on the server. If sign-in then says you are already logged in, refresh the page.",
    );
  }
}

export function isAuthInitialized(): boolean {
  return !!(store.getState().session as SessionSlice | undefined)?.initialized;
}

export function isAuthenticated(): boolean {
  return !!(store.getState().session as SessionSlice | undefined)
    ?.authenticated;
}
