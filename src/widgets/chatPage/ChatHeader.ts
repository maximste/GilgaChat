import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ChatHeader.hbs?raw";

import "./ChatHeader.scss";

interface ChatHeaderProps {
  peerName: string;
  /** Личный чат: зелёная точка «онлайн»; для группы — false. */
  showStatusDot?: boolean;
  /** Группа: кнопка «Участники» (добавление / удаление). */
  showGroupMemberActions?: boolean;
}

type ChatHeaderBlockProps = ChatHeaderProps & {
  showStatusDot: boolean;
  showGroupMemberActions: boolean;
} & BlockOwnProps;

class ChatHeader extends Block<ChatHeaderBlockProps> {
  static componentName = "ChatHeader";

  protected template = template;

  constructor(props: ChatHeaderProps) {
    super({
      ...props,
      showStatusDot: props.showStatusDot ?? true,
      showGroupMemberActions: props.showGroupMemberActions ?? false,
    } as ChatHeaderBlockProps);
  }
}
export { ChatHeader };
export { type ChatHeaderProps };
