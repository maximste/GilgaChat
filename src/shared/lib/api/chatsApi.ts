import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";
import type {
  ApiChat,
  ApiChatMember,
  ChatsUsersRequest,
  CreateChatRequest,
  CreateChatResponse,
  DeleteChatRequest,
  GetChatUsersQuery,
} from "./types";

export type GetChatsQuery = {
  offset?: number;
  limit?: number;
  title?: string;
};

export const chatsApi = {
  getList(query?: GetChatsQuery): Promise<ApiChat[]> {
    return apiGet<ApiChat[]>("/chats", query);
  },

  create(data: CreateChatRequest): Promise<CreateChatResponse> {
    return apiPost<CreateChatResponse>("/chats", data);
  },

  delete(data: DeleteChatRequest): Promise<unknown> {
    return apiDelete("/chats", data);
  },

  addUsers(data: ChatsUsersRequest): Promise<unknown> {
    return apiPut("/chats/users", data);
  },

  removeUsers(data: ChatsUsersRequest): Promise<unknown> {
    return apiDelete("/chats/users", data);
  },

  async getChatUsers(
    chatId: number,
    query?: GetChatUsersQuery,
  ): Promise<ApiChatMember[]> {
    const raw = await apiGet<unknown>(`/chats/${chatId}/users`, query);

    if (Array.isArray(raw)) {
      return raw as ApiChatMember[];
    }

    if (
      raw &&
      typeof raw === "object" &&
      "users" in raw &&
      Array.isArray((raw as { users: unknown }).users)
    ) {
      return (raw as { users: ApiChatMember[] }).users;
    }

    return [];
  },

  /**
   * Общий чат с пользователем `userId` (двусторонний). Path-параметр — id другого пользователя.
   */
  getCommonChatWithUser(userId: number): Promise<ApiChat[]> {
    return apiGet<ApiChat[]>(`/chats/${userId}/common`);
  },

  uploadChatAvatar(formData: FormData): Promise<ApiChat> {
    return apiPut<ApiChat>("/chats/avatar", formData);
  },
};
