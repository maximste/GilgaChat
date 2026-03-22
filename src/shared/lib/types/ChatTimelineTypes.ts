/** Элемент ленты чата: разделитель даты или сообщение (входящее / исходящее) */
export type ChatTimelineItem =
  | { dateLabel: string }
  | {
      incoming: true;
      author: string;
      time: string;
      text: string;
      reaction?: string;
      reactionCount?: number;
      showReadReceipt?: boolean;
    }
  | {
      incoming: false;
      time: string;
      text?: string;
      imageCaption?: string;
      hasImage?: boolean;
    };
