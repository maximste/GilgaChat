import type { ApiChatMember, ApiUser } from "@/shared/lib/api/types";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import { showConfirmDialog } from "@/shared/ui/confirmDialog";
import { showErrorToast } from "@/shared/ui/toast";
import { userDisplayName } from "@/widgets/messengerCreate/lib/userDisplayName";
import { GroupMemberPicker } from "@/widgets/messengerCreate/ui/pickers/GroupMemberPicker";

import template from "./ChatMembersDrawer.hbs?raw";

import "./chatMembersDrawer.scss";
import "./chatMembersPanel.scss";

type ChatMembersDrawerServices = {
  chatId: number;
  searchUsersByLogin: (login: string) => Promise<unknown>;
  getProfileFromStore: () => ApiUser | null;
  getChatUsers: (chatId: number) => Promise<ApiChatMember[]>;
  addUsersToChat: (chatId: number, userIds: number[]) => Promise<void>;
  removeUsersFromChat: (chatId: number, userIds: number[]) => Promise<void>;
};

type ChatMembersDrawerProps = BlockOwnProps;

/**
 * Выезжающая панель справа: участники группы, поиск и добавление.
 */
class ChatMembersDrawer extends Block<ChatMembersDrawerProps> {
  protected template = template;

  private readonly services: ChatMembersDrawerServices;

  private members: ApiChatMember[] = [];

  private picker?: GroupMemberPicker;

  private pickerReleased = false;

  private isClosing = false;

  private teardownDone = false;

  constructor(services: ChatMembersDrawerServices) {
    super({} as ChatMembersDrawerProps);
    this.services = services;
  }

  protected componentDidMount(): void {
    const addBtn = this.refs.addBtn as HTMLButtonElement | undefined;
    const pickerHost = this.refs.pickerMount as HTMLElement | undefined;
    const listHost = this.refs.listHost as HTMLElement | undefined;
    const picker = new GroupMemberPicker({
      searchUsersByLogin: this.services.searchUsersByLogin,
      getProfileFromStore: this.services.getProfileFromStore,
      getExcludeUserIds: () => this.members.map((m) => m.id),
      onSelectionChange: () => {
        if (addBtn) {
          addBtn.disabled = picker.getSelectedUserIds().length === 0;
        }
      },
    });

    this.picker = picker;
    const pickerEl = picker.element();

    if (pickerHost && pickerEl) {
      pickerHost.appendChild(pickerEl);
    }
    document.addEventListener("keydown", this.onDocumentKeydown);
    if (listHost) {
      listHost.addEventListener("click", this.onListClick);
    }
    if (addBtn) {
      addBtn.addEventListener("click", this.onAddClick);
    }
    const backdrop = this.refs.backdrop as HTMLElement | undefined;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop?.classList.add("chat-members-drawer-backdrop--open");
      });
    });
    void this.loadMembers();
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onDocumentKeydown);
    const listHost = this.refs.listHost as HTMLElement | undefined;

    listHost?.removeEventListener("click", this.onListClick);
    const addBtn = this.refs.addBtn as HTMLButtonElement | undefined;

    addBtn?.removeEventListener("click", this.onAddClick);
    this.releasePicker();
  }

  private readonly onDocumentKeydown = (e: KeyboardEvent): void => {
    if (e.key !== "Escape") {
      return;
    }
    if (document.querySelector(".confirm-dialog-backdrop")) {
      return;
    }
    e.stopPropagation();
    this.beginClose();
  };

  private renderMemberList(): void {
    const listHost = this.refs.listHost as HTMLElement | undefined;

    if (!listHost) {
      return;
    }
    listHost.replaceChildren();
    if (this.members.length === 0) {
      const empty = document.createElement("p");

      empty.className = "chat-members-panel__empty";
      empty.textContent =
        "Список участников пуст или не удалось загрузить с сервера. Добавьте людей через поиск выше.";
      listHost.appendChild(empty);

      return;
    }
    for (const u of this.members) {
      const li = document.createElement("li");

      li.className = "chat-members-panel__row";
      const name = document.createElement("span");

      name.appendChild(document.createTextNode(userDisplayName(u)));
      const loginSpan = document.createElement("span");

      loginSpan.className = "chat-members-panel__login";
      loginSpan.textContent = ` @${u.login}`;
      name.appendChild(loginSpan);
      const removeBtn = document.createElement("button");

      removeBtn.type = "button";
      removeBtn.className = "chat-members-panel__remove-btn";
      removeBtn.textContent = "Удалить";
      removeBtn.dataset.userId = String(u.id);
      li.appendChild(name);
      li.appendChild(removeBtn);
      listHost.appendChild(li);
    }
  }

  private async loadMembers(): Promise<void> {
    try {
      this.members = await this.services.getChatUsers(this.services.chatId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      showErrorToast(msg);
      this.members = [];
    }
    this.renderMemberList();
    this.picker?.refreshAfterExcludeChange();
    const addBtn = this.refs.addBtn as HTMLButtonElement | undefined;

    if (addBtn && this.picker) {
      addBtn.disabled = this.picker.getSelectedUserIds().length === 0;
    }
  }

  private readonly onListClick = async (ev: MouseEvent): Promise<void> => {
    const t = ev.target as HTMLElement;
    const btn = t.closest<HTMLButtonElement>("button[data-user-id]");

    if (!btn?.dataset.userId) {
      return;
    }
    const id = Number(btn.dataset.userId);

    if (Number.isNaN(id)) {
      return;
    }
    const confirmed = await showConfirmDialog({
      title: "Удалить участника?",
      message: "Пользователь будет исключён из этого чата.",
      confirmLabel: "Удалить",
      cancelLabel: "Отмена",
      isDanger: true,
    });

    if (!confirmed) {
      return;
    }
    try {
      await this.services.removeUsersFromChat(this.services.chatId, [id]);
      await this.loadMembers();
      this.picker?.clearSelection();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      showErrorToast(msg);
    }
  };

  private readonly onAddClick = async (): Promise<void> => {
    const picker = this.picker;

    if (!picker) {
      return;
    }
    const ids = picker.getSelectedUserIds();

    if (ids.length === 0) {
      return;
    }
    try {
      await this.services.addUsersToChat(this.services.chatId, ids);
      picker.clearSelection();
      picker.clearSearchInput();
      await this.loadMembers();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);

      showErrorToast(msg);
    }
  };

  private releasePicker(): void {
    if (this.pickerReleased) {
      return;
    }
    this.pickerReleased = true;
    this.picker?.destroy();
    this.picker = undefined;
  }

  private beginClose(): void {
    if (this.isClosing) {
      return;
    }
    this.isClosing = true;
    this.releasePicker();
    const backdrop = this.refs.backdrop as HTMLElement | undefined;
    const panel = this.refs.panel as HTMLElement | undefined;
    const root = this.element();

    backdrop?.classList.remove("chat-members-drawer-backdrop--open");
    const finish = (): void => {
      if (this.teardownDone) {
        return;
      }
      this.teardownDone = true;
      root?.remove();
      this.destroy();
    };
    const onTransitionEnd = (e: TransitionEvent): void => {
      if (e.target !== panel || e.propertyName !== "transform") {
        return;
      }
      panel.removeEventListener("transitionend", onTransitionEnd);
      finish();
    };

    if (panel) {
      panel.addEventListener("transitionend", onTransitionEnd);
    }
    window.setTimeout(finish, 400);
  }

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target === this.refs.backdrop || target === this.refs.closeBtn) {
        this.beginClose();
      }
    },
  };

  mount(parent: HTMLElement): void {
    const el = this.element();

    if (el) {
      parent.appendChild(el);
    }
  }
}
export { ChatMembersDrawer, type ChatMembersDrawerServices };
