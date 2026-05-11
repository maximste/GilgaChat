/** Элемент ленты чата: разделитель даты или сообщение (входящее / исходящее) */
type ChatTimelineItem =
  | {
      dateLabel: string;
    }
  | {
      incoming: true;
      author: string;
      authorAvatarUrl?: string;
      time: string;
      text: string;
      reaction?: string;
      reactionCount?: number;
      showReadReceipt?: boolean;
      serverMessageId?: string;
      mediaImageUrl?: string;
    }
  | {
      incoming: false;
      time: string;
      text?: string;
      imageCaption?: string;
      hasImage?: boolean;
      serverMessageId?: string;
      mediaImageUrl?: string;
    };

export { type ChatTimelineItem };
