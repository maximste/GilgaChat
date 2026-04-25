import { ApiError, chatsApi } from "@/shared/lib/api";
import type {
  ApiChat,
  ApiChatMember,
  ChatsUsersRequest,
  CreateChatRequest,
  DeleteChatRequest,
  GetChatUsersQuery,
} from "@/shared/lib/api/types";
import { store } from "@/shared/lib/store";
import { HttpStatus } from "@/shared/lib/utils";

const chatsController = {
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
  async getChatUsers(
    chatId: number,
    query?: GetChatUsersQuery,
  ): Promise<ApiChatMember[]> {
    try {
      return await chatsApi.getChatUsers(chatId, query);
    } catch (e) {
      if (e instanceof ApiError && e.status === HttpStatus.NotFound) {
        return [];
      }
      throw e;
    }
  },
  getChatsFromStore(): ApiChat[] {
    return (
      (
        store.getState().chats as
          | {
              list?: ApiChat[];
            }
          | undefined
      )?.list ?? []
    );
  },
  findChatById(id: number): ApiChat | undefined {
    return this.getChatsFromStore().find((c) => c.id === id);
  },
  /** Группа: создать чат, добавить участников, опционально аватар */
  async createGroupWithMembers(options: {
    title: string;
    userIds: number[];
    avatarFile?: File | null;
  }): Promise<number> {
    const { title, userIds, avatarFile } = options;
    const { id } = await chatsApi.create({ title });

    if (userIds.length > 0) {
      await chatsApi.addUsers({ chatId: id, users: userIds });
    }
    let avatarFromUpload: string | null = null;

    if (avatarFile) {
      const fd = new FormData();

      fd.append("chatId", String(id));
      fd.append("avatar", avatarFile, avatarFile.name);
      const updated = await chatsApi.uploadChatAvatar(fd);

      avatarFromUpload = updated.avatar ?? null;
    }
    await this.loadChats();
    if (avatarFromUpload) {
      const list = this.getChatsFromStore();
      const idx = list.findIndex((c) => c.id === id);

      if (idx >= 0 && !list[idx]?.avatar) {
        const next = list.map((c, j) =>
          j === idx ? { ...c, avatar: avatarFromUpload } : c,
        );

        store.setState("chats.list", next);
      }
    }

    return id;
  },
};

export { chatsController };
