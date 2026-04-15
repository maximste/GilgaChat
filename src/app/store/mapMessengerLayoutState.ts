import { resourceFileUrl } from "@/shared/config/api";
import type { ApiChat } from "@/shared/lib/api/types";
import type { Indexed } from "@/shared/lib/types";
import type { MessengerLayoutProps } from "@/widgets/messengerLayout";
import type {
  DirectMessageItem,
  GroupItem,
  SidebarCurrentUser,
} from "@/widgets/sidebar";

const DEFAULT_SIDEBAR_USER: SidebarCurrentUser = {
  firstName: "Alex",
  lastName: "Morgan",
  status: "Playing games",
};

type UserSlice = {
  sidebar?: SidebarCurrentUser;
};

type ChatsSlice = {
  list?: ApiChat[];
};

function mapChatsToGroups(chats: ApiChat[]): GroupItem[] {
  return chats.map((c) => ({
    chatId: String(c.id),
    name: c.title,
    preview: c.last_message?.content ?? "",
    iconClass: "fa-comments",
    avatarUrl: c.avatar?.trim() ? resourceFileUrl(c.avatar.trim()) : undefined,
  }));
}

export type MessengerLayoutStoreSlice = Pick<
  MessengerLayoutProps,
  "currentUser" | "directMessages" | "groups"
>;

export function mapMessengerLayoutState(
  state: Indexed,
): MessengerLayoutStoreSlice {
  const user = state.user as UserSlice | undefined;
  const chats = state.chats as ChatsSlice | undefined;

  return {
    currentUser: user?.sidebar ?? DEFAULT_SIDEBAR_USER,
    directMessages: [] satisfies DirectMessageItem[],
    groups: mapChatsToGroups(chats?.list ?? []),
  };
}
