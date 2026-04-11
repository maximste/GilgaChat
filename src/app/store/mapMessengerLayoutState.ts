import { APP_PATHS, appHref } from "@/shared/config/routes";
import type { ApiChat } from "@/shared/lib/api/types";
import type { Indexed , LinkProps } from "@/shared/lib/types";
import type { MessengerLayoutProps } from "@/widgets/messengerLayout";
import type { GroupItem, SidebarCurrentUser } from "@/widgets/sidebar";

const DEFAULT_SIDEBAR_USER: SidebarCurrentUser = {
  firstName: "Alex",
  lastName: "Morgan",
  status: "Playing games",
};

type UserSlice = {
  sidebar?: SidebarCurrentUser;
};

type SessionSlice = {
  authenticated?: boolean;
};

type ChatsSlice = {
  list?: ApiChat[];
};

const guestTopLinks: LinkProps[] = [
  {
    href: appHref(APP_PATHS.login),
    text: "Sign in",
    className: "messenger-sidebar__top-link",
  },
  {
    href: appHref(APP_PATHS.signUp),
    text: "Sign up",
    className: "messenger-sidebar__top-link",
  },
];

const authedTopLinks: LinkProps[] = [
  {
    href: appHref(APP_PATHS.settings),
    text: "Profile",
    className: "messenger-sidebar__top-link",
  },
];

function mapChatsToGroups(chats: ApiChat[]): GroupItem[] {
  return chats.map((c) => ({
    chatId: String(c.id),
    name: c.title,
    preview: c.last_message?.content ?? "",
    iconClass: "fa-comments",
  }));
}

export type MessengerLayoutStoreSlice = Pick<
  MessengerLayoutProps,
  "currentUser" | "directMessages" | "groups" | "topLinks"
>;

export function mapMessengerLayoutState(
  state: Indexed,
): MessengerLayoutStoreSlice {
  const user = state.user as UserSlice | undefined;
  const session = state.session as SessionSlice | undefined;
  const chats = state.chats as ChatsSlice | undefined;
  const authed = !!session?.authenticated;

  return {
    currentUser: user?.sidebar ?? DEFAULT_SIDEBAR_USER,
    topLinks: authed ? authedTopLinks : guestTopLinks,
    directMessages: [],
    groups: mapChatsToGroups(chats?.list ?? []),
  };
}
