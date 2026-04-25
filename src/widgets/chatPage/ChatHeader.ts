import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatHeader.hbs?raw";

import "./ChatHeader.scss";

interface ChatHeaderProps {
  peerName: string;
  avatarUrl?: string;
  showStatusDot?: boolean;
  showGroupMemberActions?: boolean;
  canChangeAvatar?: boolean;
}

type ChatHeaderBlockProps = ChatHeaderProps & {
  showStatusDot: boolean;
  showGroupMemberActions: boolean;
  canChangeAvatar: boolean;
} & BlockOwnProps;

class ChatHeader extends Block<ChatHeaderBlockProps> {
  static componentName = "ChatHeader";

  protected template = template;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      showStatusDot: props.showStatusDot ?? true,
      showGroupMemberActions: props.showGroupMemberActions ?? false,
      canChangeAvatar: props.canChangeAvatar ?? false,
    } as ChatHeaderBlockProps);
  }
}
export { ChatHeader };
export { type ChatHeaderProps };
