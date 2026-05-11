/** Всплывающее событие с корня формы композера: отправка текста в ленту чата */
const CHAT_MESSAGE_SENT_EVENT = "chat-message-sent" as const;

type ChatMessageSentDetail = {
  text: string;
};

export { CHAT_MESSAGE_SENT_EVENT, type ChatMessageSentDetail };
