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

class Sidebar extends Block<SidebarBlockProps> {
  static componentName = "Sidebar";

  protected template = template;

  constructor(props: SidebarProps) {
    super({
      ...props,
      appTitleRightSection:
        props.appTitleRightSection ?? DEFAULT_APP_TITLE_RIGHT_SECTION,
    } as SidebarBlockProps);
  }
}

export { Sidebar };
