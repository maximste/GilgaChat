import type { ChatTimelineItem } from "../types/ChatTimelineTypes";

/** Вью-модель строки ленты для шаблона (без дискриминированного union в Handlebars) */
export interface ChatTimelineRowVm {
  isDate: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  dateLabel?: string;
  author?: string;
  time?: string;
  text?: string;
  reaction?: string;
  reactionCount?: number;
  showReadReceipt?: boolean;
  imageCaption?: string;
  hasImage?: boolean;
}

/** Есть ли в ленте хотя бы одно сообщение (не только разделители дат) */
export function timelineHasMessages(timeline: ChatTimelineItem[]): boolean {
  return timeline.some((item) => "incoming" in item);
}

export function mapChatTimelineToRows(
  items: ChatTimelineItem[],
): ChatTimelineRowVm[] {
  return items.map((item) => {
    if ("dateLabel" in item) {
      return {
        isDate: true,
        isIncoming: false,
        isOutgoing: false,
        dateLabel: item.dateLabel,
      };
    }

    if (item.incoming) {
      return {
        isDate: false,
        isIncoming: true,
        isOutgoing: false,
        author: item.author,
        time: item.time,
        text: item.text,
        reaction: item.reaction,
        reactionCount: item.reactionCount,
        showReadReceipt: item.showReadReceipt,
      };
    }

    return {
      isDate: false,
      isIncoming: false,
      isOutgoing: true,
      time: item.time,
      text: item.text,
      imageCaption: item.imageCaption,
      hasImage: item.hasImage,
    };
  });
}
