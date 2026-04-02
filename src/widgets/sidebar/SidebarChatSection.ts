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
