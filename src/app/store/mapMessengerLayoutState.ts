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

type MessengerSlice = {
  searchFilter?: string;
};

function mapChatsToGroups(chats: ApiChat[]): GroupItem[] {
  return chats.map((c) => ({
    chatId: String(c.id),
    name: c.title,
    preview: c.last_message?.content ?? "",
    iconClass: "fa-comments",
    avatarUrl: c.avatar ? resourceFileUrl(c.avatar) : undefined,
  }));
}

function filterByQuery(groups: GroupItem[], q: string): GroupItem[] {
  const s = q.trim().toLowerCase();

  if (!s) {
    return groups;
  }

  return groups.filter(
    (g) =>
      g.name.toLowerCase().includes(s) || g.preview.toLowerCase().includes(s),
  );
}

function filterDms(items: DirectMessageItem[], q: string): DirectMessageItem[] {
  const s = q.trim().toLowerCase();

  if (!s) {
    return items;
  }

  return items.filter(
    (d) =>
      `${d.firstName} ${d.lastName}`.toLowerCase().includes(s) ||
      d.preview.toLowerCase().includes(s),
  );
}

export type MessengerLayoutStoreSlice = Pick<
  MessengerLayoutProps,
  | "currentUser"
  | "directMessages"
  | "groups"
  | "searchPlaceholder"
  | "searchAriaLabel"
>;

export function mapMessengerLayoutState(
  state: Indexed,
): MessengerLayoutStoreSlice {
  const user = state.user as UserSlice | undefined;
  const chats = state.chats as ChatsSlice | undefined;
  const messenger = state.messenger as MessengerSlice | undefined;
  const searchFilter = messenger?.searchFilter ?? "";
  const allGroups = mapChatsToGroups(chats?.list ?? []);

  return {
    currentUser: user?.sidebar ?? DEFAULT_SIDEBAR_USER,
    directMessages: filterDms([], searchFilter),
    groups: filterByQuery(allGroups, searchFilter),
    searchPlaceholder: "Find or start a conversation",
    searchAriaLabel: "Find or start a conversation",
  };
}
