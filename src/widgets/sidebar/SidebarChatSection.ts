import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./SidebarChatSection.hbs?raw";
import type { GroupItem } from "./types";

import "./SidebarChatSection.scss";

type SidebarChatSectionKind = "groups";

interface SidebarChatSectionProps {
  /** Совпадает с `data-section` у заголовка */
  sectionData: SidebarChatSectionKind;
  title: string;
  items: GroupItem[];
}

type SidebarChatSectionBlockProps = SidebarChatSectionProps & {
  chatIdPrefix: string;
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
    const chatIdPrefix = "group-";

    super({
      ...props,
      chatIdPrefix,
    } as SidebarChatSectionBlockProps);
  }
}
export { SidebarChatSection };
export { type SidebarChatSectionKind, type SidebarChatSectionProps };
