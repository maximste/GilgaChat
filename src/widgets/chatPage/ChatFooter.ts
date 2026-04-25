import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatFooter.hbs?raw";

import "./ChatFooter.scss";

interface ChatFooterProps {
  peerName: string;
}

type ChatFooterBlockProps = ChatFooterProps & BlockOwnProps;

class ChatFooter extends Block<ChatFooterBlockProps> {
  static componentName = "ChatFooter";

  protected template = template;

  constructor(props: ChatFooterProps) {
    super(props as ChatFooterBlockProps);
  }
}
export { ChatFooter };
export { type ChatFooterProps };
