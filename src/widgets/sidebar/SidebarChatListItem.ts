import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type { SidebarStatusType } from "@/shared/ui/sidebar";

import template from "./SidebarChatListItem.hbs?raw";

import "./SidebarChatListItem.scss";

interface SidebarChatListItemProps {
  chatId?: string;
  chatIdPrefix: string;
  index: number | string;
  firstName?: string;
  lastName?: string;
  preview?: string;
  statusType?: SidebarStatusType;
  name?: string;
  iconClass?: string;
  avatarUrl?: string;
}

type SidebarChatListItemBlockProps = SidebarChatListItemProps & {
  chatId: string;
  primaryLineText: string;
  previewLine: string;
} & BlockOwnProps;

class SidebarChatListItem extends Block<SidebarChatListItemBlockProps> {
  static componentName = "SidebarChatListItem";

  protected template = template;

  constructor(props: SidebarChatListItemProps) {
    const primaryLineText = props.name ?? "";

    super({
      ...props,
      chatId: props.chatId ?? `${props.chatIdPrefix}${props.index}`,
      primaryLineText,
      previewLine: props.preview ?? "",
    } as SidebarChatListItemBlockProps);
  }
}
export { SidebarChatListItem };
export { type SidebarChatListItemProps };
