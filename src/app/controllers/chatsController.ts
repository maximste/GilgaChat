import { chatsApi } from "@/shared/lib/api";
import type {
  ApiChat,
  ChatsUsersRequest,
  CreateChatRequest,
  DeleteChatRequest,
} from "@/shared/lib/api/types";
import { store } from "@/shared/lib/store";

export const chatsController = {
  async loadChats(): Promise<void> {
    const list = await chatsApi.getList();

    store.setState("chats.list", list);
  },

  async createChat(data: CreateChatRequest): Promise<number> {
    const { id } = await chatsApi.create(data);

    await this.loadChats();

    return id;
  },

  async deleteChat(data: DeleteChatRequest): Promise<void> {
    await chatsApi.delete(data);
    await this.loadChats();
  },

  async addUsersToChat(data: ChatsUsersRequest): Promise<void> {
    await chatsApi.addUsers(data);
    await this.loadChats();
  },

  async removeUsersFromChat(data: ChatsUsersRequest): Promise<void> {
    await chatsApi.removeUsers(data);
    await this.loadChats();
  },

  getChatsFromStore(): ApiChat[] {
    return (
      (store.getState().chats as { list?: ApiChat[] } | undefined)?.list ?? []
    );
  },

  findChatById(id: number): ApiChat | undefined {
    return this.getChatsFromStore().find((c) => c.id === id);
  },
};
