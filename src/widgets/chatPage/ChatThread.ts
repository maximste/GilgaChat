import type { ChatTimelineRowVm } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatThread.hbs?raw";

import "./ChatThread.scss";

export interface ChatThreadProps {
  peerName: string;
  hasMessages: boolean;
  timelineRows: ChatTimelineRowVm[];
}

type ChatThreadBlockProps = ChatThreadProps & BlockOwnProps;

class ChatThread extends Block<ChatThreadBlockProps> {
  static componentName = "ChatThread";

  protected template = template;

  constructor(props: ChatThreadProps) {
    super(props as ChatThreadBlockProps);
  }
}

export { ChatThread };
