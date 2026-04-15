export {
  ChatPage,
  type ChatPageHostDeps,
  type ChatPageProps,
} from "./ChatPage";
export {
  createDemoChatTimeline,
  MOCK_MESSENGER_CHATS,
  type MockMessengerChatConfig,
} from "@/shared/lib/mocks";
export type { ChatTimelineItem } from "@/shared/lib/types/ChatTimelineTypes";
export { timelineHasMessages } from "@/shared/lib/utils";
