import {
  ChatMembersDrawer,
  type ChatMembersDrawerServices,
} from "./ChatMembersDrawer";

/**
 * Открывает панель участников группового чата (drawer справа).
 */
function openChatGroupMembersDrawer(
  mountRoot: HTMLElement,
  services: ChatMembersDrawerServices,
): void {
  const drawer = new ChatMembersDrawer(services);

  drawer.mount(mountRoot);
}

export type { ChatMembersDrawerServices };
export { openChatGroupMembersDrawer };
