import { ApiError, chatsApi } from "@/shared/lib/api";
import type {
  ApiChat,
  ApiUser,
  ChatsUsersRequest,
  CreateChatRequest,
  DeleteChatRequest,
} from "@/shared/lib/api/types";
import { store } from "@/shared/lib/store";

export type ChatKind = "dm" | "group";

type ChatsSlice = {
  list?: ApiChat[];
  kindById?: Record<number, ChatKind>;
};

function pruneChatKinds(
  list: ApiChat[],
  prev: Record<number, ChatKind> | undefined,
): Record<number, ChatKind> {
  const ids = new Set(list.map((c) => c.id));
  const next: Record<number, ChatKind> = {};

  if (!prev) {
    return next;
  }

  for (const key of Object.keys(prev)) {
    const id = Number(key);

    if (ids.has(id)) {
      next[id] = prev[id] as ChatKind;
    }
  }

  return next;
}

function markChatKind(chatId: number, kind: ChatKind): void {
  const slice = (store.getState().chats as ChatsSlice | undefined) ?? {};
  const kindById = { ...(slice.kindById ?? {}), [chatId]: kind };

  store.setState("chats.kindById", kindById);
}

export const chatsController = {
  async loadChats(): Promise<void> {
    const list = await chatsApi.getList();
    const prev = (store.getState().chats as ChatsSlice | undefined)?.kindById;
    const kindById = pruneChatKinds(list, prev);

    store.setState("chats.list", list);
    store.setState("chats.kindById", kindById);
  },

  chatHeaderShowsStatusDot(chatId: number): boolean {
    const kind = (store.getState().chats as ChatsSlice | undefined)?.kindById?.[
      chatId
    ];

    return kind !== "group";
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

  /**
   * Открыть DM с пользователем: сначала GET /chats/{userId}/common, иначе создать чат и добавить собеседника.
   */
  async openDmWithUser(peer: ApiUser): Promise<number> {
    try {
      const common = await chatsApi.getCommonChatWithUser(peer.id);

      if (Array.isArray(common) && common.length > 0) {
        const chatId = common[0].id;

        await this.loadChats();
        markChatKind(chatId, "dm");

        return chatId;
      }
    } catch (e) {
      if (!(e instanceof ApiError && e.status === 404)) {
        throw e;
      }
    }

    const title =
      peer.display_name?.trim() ||
      `${peer.first_name} ${peer.second_name}`.trim() ||
      peer.login;
    const { id } = await chatsApi.create({ title });

    await chatsApi.addUsers({ chatId: id, users: [peer.id] });
    await this.loadChats();
    markChatKind(id, "dm");

    return id;
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

    markChatKind(id, "group");

    return id;
  },
};
