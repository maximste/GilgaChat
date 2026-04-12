import type { MessengerCreateDeps } from "./types";
import { CreateDmModal } from "./ui/CreateDmModal";
import { CreateGroupModal } from "./ui/CreateGroupModal";
import { MessengerFab } from "./ui/MessengerFab";

function ensureModalsRoot(layoutRoot: HTMLElement): HTMLElement {
  let el = layoutRoot.querySelector<HTMLElement>("[data-messenger-modals]");

  if (!el) {
    el = document.createElement("div");
    el.dataset.messengerModals = "";
    el.className = "messenger-modals";
    layoutRoot.appendChild(el);
  }

  return el;
}

export type SetupMessengerCreateUiOptions = MessengerCreateDeps & {
  selectChat: (chatId: string) => void;
};

/**
 * FAB «+», меню Create DM / Create Group, модалки на Block.
 * Зависимости от API передаются со страницы (`@/app` не импортируется).
 */
export function setupMessengerCreateUi(
  layoutRoot: HTMLElement,
  options: SetupMessengerCreateUiOptions,
): void {
  const sidebar = layoutRoot.querySelector(".messenger-sidebar");

  if (!(sidebar instanceof HTMLElement)) {
    return;
  }

  if (sidebar.querySelector("[data-messenger-fab-host]")) {
    return;
  }

  const modalsRoot = ensureModalsRoot(layoutRoot);

  const fab = new MessengerFab({
    onOpenDm: () => {
      const modal = new CreateDmModal({
        searchUsersByLogin: options.searchUsersByLogin,
        openDmWithUser: options.openDmWithUser,
        onDone: (chatId) => {
          options.selectChat(String(chatId));
        },
      });

      modal.mount(modalsRoot);
    },
    onOpenGroup: () => {
      const modal = new CreateGroupModal({
        searchUsersByLogin: options.searchUsersByLogin,
        createGroupWithMembers: options.createGroupWithMembers,
        getProfileFromStore: options.getProfileFromStore,
        onDone: (chatId) => {
          options.selectChat(String(chatId));
        },
      });

      modal.mount(modalsRoot);
    },
  });

  const userPanel = sidebar.querySelector(".messenger-sidebar__user");

  if (userPanel) {
    sidebar.insertBefore(fab.element()!, userPanel);
  } else {
    sidebar.appendChild(fab.element()!);
  }
}
