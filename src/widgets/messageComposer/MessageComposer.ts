import { messageFormValidators } from "@/shared/lib/validation";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import {
  CHAT_MESSAGE_SENT_EVENT,
  type ChatMessageSentDetail,
} from "@/widgets/chatPage/chatMessageEvents";

import template from "./MessageComposer.hbs?raw";

import "@/shared/ui/formField/FormField.scss";
import "./MessageComposer.scss";

export type MessageComposerProps = {
  /** Имя собеседника для плейсхолдера «Message …» */
  peerName: string;
} & BlockOwnProps;

type MessageComposerBlockProps = MessageComposerProps;

export class MessageComposer extends Block<MessageComposerBlockProps> {
  static componentName = "MessageComposer";

  protected template = template;

  private trySend(): void {
    const root = this.element();
    const form = root instanceof HTMLFormElement ? root : null;
    const ta = root?.querySelector<HTMLTextAreaElement>(
      'textarea[name="message"]',
    );

    if (!form || !ta) {
      return;
    }

    const raw = ta.value;
    const err = messageFormValidators.message(raw, { message: raw });

    if (err) {
      return;
    }

    const text = raw.trim();

    form.dispatchEvent(
      new CustomEvent<ChatMessageSentDetail>(CHAT_MESSAGE_SENT_EVENT, {
        bubbles: true,
        detail: { text },
      }),
    );

    ta.value = "";
  }

  protected events = {
    submit: (event: Event) => {
      event.preventDefault();
      this.trySend();
    },
    click: (event: Event) => {
      const target = (event.target as HTMLElement).closest(
        ".message-composer__send",
      );

      if (target) {
        event.preventDefault();
        this.trySend();
      }
    },
  };

  constructor(props: { peerName: string }) {
    super({
      peerName: props.peerName,
      placeholder: `Message ${props.peerName}`,
    } as MessageComposerBlockProps);
  }

  protected componentDidMount(): void {
    const root = this.element();
    const form = root instanceof HTMLFormElement ? root : null;
    const ta = root?.querySelector<HTMLTextAreaElement>(
      'textarea[name="message"]',
    );

    ta?.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        form?.requestSubmit();
      }
    });
  }
}
