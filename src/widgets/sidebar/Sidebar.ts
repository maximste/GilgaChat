import type { LinkProps } from "@/shared/lib/types";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./Sidebar.hbs?raw";

import "./Sidebar.scss";

export interface DirectMessageItem {
  firstName: string;
  lastName: string;
  preview: string;
  statusType: "green" | "yellow" | "gray";
}

export interface GroupItem {
  name: string;
  preview: string;
  iconClass: string;
}

export interface SidebarProps {
  appTitle: string;
  topLinks: LinkProps[];
  currentUser: {
    firstName: string;
    lastName: string;
    status: string;
  };
  directMessages: DirectMessageItem[];
  groups: GroupItem[];
  /** HTML-фрагмент справа от текста (иконка и т.п.) */
  appTitleRightSection?: string;
}

type SidebarBlockProps = SidebarProps & {
  appTitleRightSection: string;
} & BlockOwnProps;

const DEFAULT_APP_TITLE_RIGHT_SECTION =
  '<i class="fa-solid fa-chevron-down messenger-sidebar__chevron" aria-hidden="true"></i>';

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

  constructor(props: SidebarProps) {
    super({
      ...props,
      appTitleRightSection:
        props.appTitleRightSection ?? DEFAULT_APP_TITLE_RIGHT_SECTION,
    } as SidebarBlockProps);
  }

  protected componentDidMount(): void {
    this.element()?.addEventListener("click", this.handleChatListClick);
  }

  protected componentWillUnmount(): void {
    this.element()?.removeEventListener("click", this.handleChatListClick);
  }
}

export { Sidebar };
