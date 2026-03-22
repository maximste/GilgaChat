import {
  handleValidatedSubmit,
  messageFormValidators,
  runFieldValidatorOnFocusOut,
} from "@/shared/lib/validation";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

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

  protected events = {
    submit: (event: Event) => {
      handleValidatedSubmit(event, messageFormValidators, () => {
        const root = this.element();
        const ta = root?.querySelector<HTMLTextAreaElement>(
          'textarea[name="message"]',
        );

        if (ta) {
          ta.value = "";
        }
      });
    },
    focusout: (event: Event) => {
      runFieldValidatorOnFocusOut(event, messageFormValidators);
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
    const form = root?.querySelector("form");
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
