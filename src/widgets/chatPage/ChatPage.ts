import { createDemoChatTimeline } from "@/shared/lib/mocks";
import type { ChatTimelineItem } from "@/shared/lib/types/ChatTimelineTypes";
import {
  mapChatTimelineToRows,
  timelineHasMessages,
} from "@/shared/lib/utils/chatTimeline";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import {
  CHAT_MESSAGE_SENT_EVENT,
  type ChatMessageSentDetail,
} from "./chatMessageEvents";
import template from "./ChatPage.hbs?raw";

import "./ChatPage.scss";

export interface ChatPageProps {
  peerName?: string;
  /** Лента сообщений; без передачи подставляется демо-лента */
  timeline?: ChatTimelineItem[];
}

type ChatPageBlockProps = ChatPageProps & {
  peerName: string;
  timeline: ChatTimelineItem[];
  hasMessages: boolean;
  timelineRows: ReturnType<typeof mapChatTimelineToRows>;
} & BlockOwnProps;

export class ChatPage extends Block<ChatPageBlockProps> {
  protected template = template;

  private container: HTMLElement;

  private readonly onChatMessageSent = (event: Event): void => {
    const { text } = (event as CustomEvent<ChatMessageSentDetail>).detail;

    if (!text?.trim()) {
      return;
    }

    const time = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    });

    const newItem: ChatTimelineItem = {
      incoming: false,
      time,
      text: text.trim(),
    };

    const timeline = [...this.props.timeline, newItem];

    this.setProps({
      timeline,
      hasMessages: timelineHasMessages(timeline),
      timelineRows: mapChatTimelineToRows(timeline),
    });
  };

  constructor(container: HTMLElement, props: ChatPageProps = {}) {
    const peerName = props.peerName ?? "Sarah Chen";
    const timeline = props.timeline ?? createDemoChatTimeline(peerName);
    const hasMessages = timelineHasMessages(timeline);
    const timelineRows = mapChatTimelineToRows(timeline);

    super({
      peerName,
      timeline,
      hasMessages,
      timelineRows,
    } as ChatPageBlockProps);

    this.container = container;
  }

  protected componentDidMount(): void {
    this.element()?.addEventListener(
      CHAT_MESSAGE_SENT_EVENT,
      this.onChatMessageSent as EventListener,
    );
  }

  protected componentWillUnmount(): void {
    this.element()?.removeEventListener(
      CHAT_MESSAGE_SENT_EVENT,
      this.onChatMessageSent as EventListener,
    );
  }

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }
  }
}
