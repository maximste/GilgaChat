import { apiGet, apiPost, apiRequest } from "./apiClient";
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

  /**
   * Регистрация без cookie: иначе Safari/другой браузер может послать протухшую
   * сессию на ya-praktikum.tech и API ответит «Cookie is not valid».
   * Сессию после успешного ответа поднимает `signIn` в `authController.signUp`.
   */
  signUp(data: SignUpRequest): Promise<SignUpResponse> {
    return apiRequest<SignUpResponse>("/auth/signup", {
      method: "POST",
      data,
      withCredentials: false,
    });
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
