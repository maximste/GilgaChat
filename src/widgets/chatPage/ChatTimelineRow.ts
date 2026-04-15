import type { ChatTimelineRowVm } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatTimelineRow.hbs?raw";

import "./ChatTimelineRow.scss";

type ChatTimelineRowBlockProps = ChatTimelineRowVm & BlockOwnProps;

class ChatTimelineRow extends Block<ChatTimelineRowBlockProps> {
  static componentName = "ChatTimelineRow";

  protected template = template;

  constructor(props: ChatTimelineRowVm) {
    super(props as ChatTimelineRowBlockProps);
  }
}

export { ChatTimelineRow };
