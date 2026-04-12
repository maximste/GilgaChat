import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatHeader.hbs?raw";

import "./ChatHeader.scss";

export interface ChatHeaderProps {
  peerName: string;
  /** Личный чат: зелёная точка «онлайн»; для группы — false. */
  showStatusDot?: boolean;
}

type ChatHeaderBlockProps = ChatHeaderProps & {
  showStatusDot: boolean;
} & BlockOwnProps;

class ChatHeader extends Block<ChatHeaderBlockProps> {
  static componentName = "ChatHeader";

  protected template = template;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      showStatusDot: props.showStatusDot ?? true,
    } as ChatHeaderBlockProps);
  }
}

export { ChatHeader };
