import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./Sidebar.hbs?raw";
import type { GroupItem, SidebarCurrentUser } from "./types";

import "./Sidebar.scss";

interface SidebarProps {
  appTitle: string;
  currentUser: SidebarCurrentUser;
  groups: GroupItem[];
}

type SidebarBlockProps = SidebarProps & BlockOwnProps;

/** Всплывающее событие на корне сайдбара при выборе чата в списке */
const SIDEBAR_SELECT_CHAT_EVENT = "sidebar-select-chat" as const;

type SidebarSelectChatDetail = {
  chatId: string;
};

class Sidebar extends Block<SidebarBlockProps> {
  static componentName = "Sidebar";

  protected template = template;

  private readonly handleChatListClick = (event: Event): void => {
    const root = this.element();

    if (!root) {
      return;
    }
    const item = (event.target as HTMLElement).closest<HTMLButtonElement>(
      ".messenger-sidebar__item",
    );

    if (!item || !root.contains(item)) {
      return;
    }
    const chatId = item.dataset.chat;

    if (!chatId) {
      return;
    }
    root.dispatchEvent(
      new CustomEvent<SidebarSelectChatDetail>(SIDEBAR_SELECT_CHAT_EVENT, {
        bubbles: true,
        detail: { chatId },
      }),
    );
  };

  protected events = {
    click: this.handleChatListClick,
  };

  constructor(props: Partial<SidebarProps> = {}) {
    super({
      appTitle: props.appTitle ?? "GilgaChat",
      currentUser: props.currentUser ?? {
        firstName: "Alex",
        lastName: "Morgan",
        status: "Playing games",
      },
      groups: props.groups ?? [],
    } as SidebarBlockProps);
  }
}
export { Sidebar };
export {
  SIDEBAR_SELECT_CHAT_EVENT,
  type SidebarProps,
  type SidebarSelectChatDetail,
};
