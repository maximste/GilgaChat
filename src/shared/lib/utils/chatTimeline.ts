import type { ChatTimelineItem } from "../types/ChatTimelineTypes";

/** Есть ли в ленте хотя бы одно сообщение (не только разделители дат) */
export function timelineHasMessages(timeline: ChatTimelineItem[]): boolean {
  return timeline.some((item) => "incoming" in item);
}
