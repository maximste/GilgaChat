import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./Sidebar.hbs?raw";
import type { DirectMessageItem, GroupItem, SidebarCurrentUser } from "./types";

import "./Sidebar.scss";

export interface SidebarProps {
  appTitle: string;
  currentUser: SidebarCurrentUser;
  directMessages: DirectMessageItem[];
  groups: GroupItem[];
  searchPlaceholder?: string;
  searchAriaLabel?: string;
}

type SidebarBlockProps = SidebarProps & BlockOwnProps;

/** Всплывающее событие на корне сайдбара при выборе чата в списке */
export const SIDEBAR_SELECT_CHAT_EVENT = "sidebar-select-chat" as const;

export type SidebarSelectChatDetail = { chatId: string };

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

  constructor(props: SidebarProps) {
    super({
      ...props,
      searchPlaceholder: props.searchPlaceholder,
      searchAriaLabel: props.searchAriaLabel,
    } as SidebarBlockProps);
  }
}

export { Sidebar };
