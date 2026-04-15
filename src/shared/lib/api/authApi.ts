import { apiGet, apiPost } from "./apiClient";
import type {
  ApiUser,
  SignInRequest,
  SignUpRequest,
  SignUpResponse,
} from "./types";

export const authApi = {
  signIn(data: SignInRequest): Promise<unknown> {
    return apiPost("/auth/signin", data);
  },

  signUp(data: SignUpRequest): Promise<SignUpResponse> {
    return apiPost<SignUpResponse>("/auth/signup", data);
  },

  logout(): Promise<unknown> {
    return apiPost("/auth/logout", {});
  },

  async getUser(): Promise<ApiUser> {
    const raw = await apiGet<unknown>("/auth/user");

    if (Array.isArray(raw)) {
      return raw[0] as ApiUser;
    }

    return raw as ApiUser;
  },
};
