import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";
import type {
  ApiChat,
  ChatsUsersRequest,
  CreateChatRequest,
  CreateChatResponse,
  DeleteChatRequest,
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
};
