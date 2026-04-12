import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./SidebarChatSection.hbs?raw";
import type { DirectMessageItem, GroupItem } from "./types";

import "./SidebarChatSection.scss";

export type SidebarChatSectionKind = "dm" | "groups";

export interface SidebarChatSectionProps {
  /** Совпадает с `data-section` у заголовка (`dm` | `groups`) */
  sectionData: SidebarChatSectionKind;
  title: string;
  items: DirectMessageItem[] | GroupItem[];
}

type SidebarChatSectionBlockProps = SidebarChatSectionProps & {
  chatIdPrefix: string;
  isDmVariant: boolean;
} & BlockOwnProps;

class SidebarChatSection extends Block<SidebarChatSectionBlockProps> {
  static componentName = "SidebarChatSection";

  protected template = template;

  protected events = {
    click: (event: Event) => {
      const head = (event.target as HTMLElement).closest<HTMLButtonElement>(
        ".messenger-sidebar__section-head",
      );
      const root = this.element();

      if (!head || !root?.contains(head)) {
        return;
      }

      const wasExpanded = head.getAttribute("aria-expanded") === "true";

      head.setAttribute("aria-expanded", String(!wasExpanded));
      root.classList.toggle(
        "messenger-sidebar__section--collapsed",
        wasExpanded,
      );
    },
  };

  constructor(props: SidebarChatSectionProps) {
    const isDmVariant = props.sectionData === "dm";
    const chatIdPrefix = isDmVariant ? "dm-" : "group-";

    super({
      ...props,
      chatIdPrefix,
      isDmVariant,
    } as SidebarChatSectionBlockProps);
  }
}

export { SidebarChatSection };
