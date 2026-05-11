import { apiPost, apiPut } from "./apiClient";
import type {
  ApiUser,
  ChangePasswordRequest,
  UserProfileRequest,
  UserSearchRequest,
} from "./types";

const userApi = {
  updateProfile(data: UserProfileRequest): Promise<ApiUser> {
    return apiPut<ApiUser>("/user/profile", data);
  },
  changePassword(data: ChangePasswordRequest): Promise<unknown> {
    return apiPut("/user/password", data);
  },
  uploadAvatar(formData: FormData): Promise<ApiUser> {
    return apiPut<ApiUser>("/user/profile/avatar", formData);
  },
  searchByLogin(data: UserSearchRequest): Promise<ApiUser[]> {
    return apiPost<ApiUser[]>("/user/search", data);
  },
};

export { userApi };
