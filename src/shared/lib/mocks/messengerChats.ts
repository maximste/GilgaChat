import type { ChatTimelineItem } from "../types/ChatTimelineTypes";

/** Демо-лента сообщений до подключения API */
export function createDemoChatTimeline(peerName: string): ChatTimelineItem[] {
  return [
    { dateLabel: "Saturday, February 21" },
    {
      incoming: true,
      author: peerName,
      time: "2:34 PM",
      text: "Hey! Did you get the files I sent yesterday?",
      showReadReceipt: true,
    },
    {
      incoming: false,
      time: "2:36 PM",
      text: "Yes, thanks — looking at them now.",
    },
    {
      incoming: true,
      author: peerName,
      time: "2:40 PM",
      text: "Great. Let me know if you need the source assets too.",
      reaction: "👍",
      reactionCount: 1,
    },
    { dateLabel: "Sunday, February 22" },
    {
      incoming: false,
      time: "11:02 AM",
      imageCaption: "Sure! Here are the mockups I created",
      hasImage: true,
    },
    {
      incoming: true,
      author: peerName,
      time: "11:15 AM",
      text: "These look amazing — exactly what we discussed.",
    },
  ];
}

export type MockMessengerChatConfig = {
  peerName: string;
  timeline: ChatTimelineItem[];
};

/** Демо-карта чатов по `data-chat` (dm-0, group-1, …) до подключения бэкенда */
export const MOCK_MESSENGER_CHATS: Record<string, MockMessengerChatConfig> = {
  "dm-0": {
    peerName: "Sarah Chen",
    timeline: createDemoChatTimeline("Sarah Chen"),
  },
  "dm-1": {
    peerName: "Marcus Johnson",
    timeline: [],
  },
  "group-0": {
    peerName: "Project Alpha Team",
    timeline: [],
  },
  "group-1": {
    peerName: "Weekend Plans",
    timeline: createDemoChatTimeline("Weekend Plans"),
  },
};
