/** Всплывающее событие с корня формы композера: отправка текста в ленту чата */
export const CHAT_MESSAGE_SENT_EVENT = "chat-message-sent" as const;

export type ChatMessageSentDetail = { text: string };
