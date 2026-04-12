import type { MessengerCreateDeps } from "./types";
import { CreateDmForm } from "./ui/forms/CreateDmForm";
import { CreateGroupForm } from "./ui/forms/CreateGroupForm";
import { MessengerFab } from "./ui/MessengerFab";
import { MessengerModalShell } from "./ui/MessengerModalShell";

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
 * FAB «+», меню Create DM / Create Group, модалки: shell + форма в body.
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
      const shell = new MessengerModalShell({
        title: "Create Direct Message",
        subtitle: "Select a user to start a conversation with.",
        modalClass: "messenger-modal--dm",
        primaryLabel: "Create DM",
      });

      const dmRef: { form: CreateDmForm | null } = { form: null };

      const closeDm = (): void => {
        dmRef.form?.destroy();
        shell.element()?.remove();
        shell.destroy();
      };

      dmRef.form = new CreateDmForm(
        {
          searchUsersByLogin: options.searchUsersByLogin,
          openDmWithUser: options.openDmWithUser,
          onDone: (chatId) => {
            options.selectChat(String(chatId));
          },
          closeModal: closeDm,
        },
        shell,
      );

      shell.setHandlers({
        onClose: closeDm,
        onSubmit: () => void dmRef.form!.submit(),
      });

      shell.mount(modalsRoot);
      shell.mountBody(dmRef.form.element()!);
    },
    onOpenGroup: () => {
      const shell = new MessengerModalShell({
        title: "Create Group",
        subtitle: "Set up a new group chat with multiple members.",
        modalClass: "messenger-modal--group",
        primaryLabel: "Create Group",
      });

      const groupRef: { form: CreateGroupForm | null } = { form: null };

      const closeGroup = (): void => {
        groupRef.form?.destroy();
        shell.element()?.remove();
        shell.destroy();
      };

      groupRef.form = new CreateGroupForm(
        {
          searchUsersByLogin: options.searchUsersByLogin,
          createGroupWithMembers: options.createGroupWithMembers,
          getProfileFromStore: options.getProfileFromStore,
          onDone: (chatId) => {
            options.selectChat(String(chatId));
          },
          closeModal: closeGroup,
        },
        shell,
      );

      shell.setHandlers({
        onClose: closeGroup,
        onSubmit: () => void groupRef.form!.submit(),
      });

      shell.mount(modalsRoot);
      shell.mountBody(groupRef.form.element()!);
    },
  });

  const userPanel = sidebar.querySelector(".messenger-sidebar__user");

  if (userPanel) {
    sidebar.insertBefore(fab.element()!, userPanel);
  } else {
    sidebar.appendChild(fab.element()!);
  }
}
