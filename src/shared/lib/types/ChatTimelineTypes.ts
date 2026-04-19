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
      /** Id сообщения на сервере (дедуп / отладка). */
      serverMessageId?: string;
      /** Превью картинки для file/sticker с image/* */
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
