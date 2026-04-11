import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type { SidebarStatusType } from "@/shared/ui/sidebar";

import template from "./SidebarChatListItem.hbs?raw";

import "./SidebarChatListItem.scss";

export interface SidebarChatListItemProps {
  chatId?: string;
  isDmVariant: boolean;
  chatIdPrefix: string;
  index: number | string;
  firstName?: string;
  lastName?: string;
  preview?: string;
  statusType?: SidebarStatusType;
  name?: string;
  iconClass?: string;
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
    const primaryLineText = props.isDmVariant
      ? `${props.lastName ?? ""} ${props.firstName ?? ""}`.trim()
      : (props.name ?? "");

    super({
      ...props,
      chatId: props.chatId ?? `${props.chatIdPrefix}${props.index}`,
      primaryLineText,
      previewLine: props.preview ?? "",
    } as SidebarChatListItemBlockProps);
  }
}

export { SidebarChatListItem };
