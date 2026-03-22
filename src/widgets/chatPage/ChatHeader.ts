import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatHeader.hbs?raw";

import "./ChatHeader.scss";

export interface ChatHeaderProps {
  peerName: string;
}

type ChatHeaderBlockProps = ChatHeaderProps & BlockOwnProps;

class ChatHeader extends Block<ChatHeaderBlockProps> {
  static componentName = "ChatHeader";

  protected template = template;

  constructor(props: ChatHeaderProps) {
    super(props as ChatHeaderBlockProps);
  }
}

export { ChatHeader };
