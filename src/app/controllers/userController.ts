import { ApiError, userApi } from "@/shared/lib/api";
import type {
  ApiUser,
  ChangePasswordRequest,
  UserProfileRequest,
} from "@/shared/lib/api/types";
import { store } from "@/shared/lib/store";

import { apiUserToSidebar } from "./mapUserToSidebar";

function applyUser(user: ApiUser): void {
  store.setState("user.profile", user);
  store.setState("user.sidebar", apiUserToSidebar(user));
}

async function updateProfile(data: UserProfileRequest): Promise<void> {
  const user = await userApi.updateProfile(data);

  applyUser(user);
}

async function changePassword(data: ChangePasswordRequest): Promise<void> {
  await userApi.changePassword(data);
}

async function uploadAvatar(file: File): Promise<void> {
  const form = new FormData();

  form.append("avatar", file, file.name);
  const user = await userApi.uploadAvatar(form);

  applyUser(user);
}

async function searchUsersByLogin(login: string): Promise<ApiUser[]> {
  return userApi.searchByLogin({ login });
}

function getProfileFromStore(): ApiUser | null {
  return (
    (
      store.getState().user as
        | {
            profile?: ApiUser | null;
          }
        | undefined
    )?.profile ?? null
  );
}

function isApiError(e: unknown): e is ApiError {
  return e instanceof ApiError;
}

export {
  changePassword,
  getProfileFromStore,
  isApiError,
  searchUsersByLogin,
  updateProfile,
  uploadAvatar,
};
