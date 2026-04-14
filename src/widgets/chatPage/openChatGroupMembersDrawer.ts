import {
  ChatMembersDrawer,
  type ChatMembersDrawerServices,
} from "./ChatMembersDrawer";

export type { ChatMembersDrawerServices };

/**
 * Открывает панель участников группового чата (drawer справа).
 */
export function openChatGroupMembersDrawer(
  mountRoot: HTMLElement,
  services: ChatMembersDrawerServices,
): void {
  const drawer = new ChatMembersDrawer(services);

  drawer.mount(mountRoot);
}
