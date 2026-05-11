import type { ChatTimelineItem } from "../../types/ChatTimelineTypes";

/** Вью-модель строки ленты для шаблона (без дискриминированного union в Handlebars) */
interface ChatTimelineRowVm {
  isDate: boolean;
  isIncoming: boolean;
  isOutgoing: boolean;
  dateLabel?: string;
  author?: string;
  authorAvatarUrl?: string;
  time?: string;
  text?: string;
  reaction?: string;
  reactionCount?: number;
  imageCaption?: string;
  hasImage?: boolean;
  mediaImageUrl?: string;
}

/** Есть ли в ленте хотя бы одно сообщение (не только разделители дат) */
function timelineHasMessages(timeline: ChatTimelineItem[]): boolean {
  return timeline.some((item) => "incoming" in item);
}

function mapChatTimelineToRows(items: ChatTimelineItem[]): ChatTimelineRowVm[] {
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
        authorAvatarUrl: item.authorAvatarUrl,
        time: item.time,
        text: item.text,
        reaction: item.reaction,
        reactionCount: item.reactionCount,
        mediaImageUrl: item.mediaImageUrl,
        hasImage: Boolean(item.mediaImageUrl),
      };
    }

    return {
      isDate: false,
      isIncoming: false,
      isOutgoing: true,
      time: item.time,
      text: item.text,
      imageCaption: item.imageCaption,
      hasImage: Boolean(item.hasImage || item.mediaImageUrl),
      mediaImageUrl: item.mediaImageUrl,
    };
  });
}

export { type ChatTimelineRowVm, mapChatTimelineToRows, timelineHasMessages };
