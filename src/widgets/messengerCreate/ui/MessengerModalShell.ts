import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./MessengerModalShell.hbs?raw";

import "./MessengerModal.scss";

type MessengerModalShellProps = {
  title: string;
  subtitle?: string;
  modalClass: string;
  primaryLabel: string;
} & BlockOwnProps;

/**
 * Каркас модалки: бэкдроп, заголовок, слот тела, Cancel + основная кнопка.
 * Контент (форма) монтируется в `bodyMount` вручную, без вложенного compile в шаблоне.
 */
class MessengerModalShell extends Block<MessengerModalShellProps> {
  protected template = template;

  private onClose: () => void = () => {};

  private onSubmit: () => void = () => {};

  private readonly onDocumentKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.onClose();
    }
  };

  constructor(props: MessengerModalShellProps) {
    super(props);
  }

  protected componentDidMount(): void {
    document.addEventListener("keydown", this.onDocumentKeydown);
    this.setSubmitDisabled(true);
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onDocumentKeydown);
  }

  setHandlers(handlers: { onClose: () => void; onSubmit: () => void }): void {
    this.onClose = handlers.onClose;
    this.onSubmit = handlers.onSubmit;
  }

  mountBody(node: Element): void {
    const host = this.refs.bodyMount;

    if (host) {
      host.appendChild(node);
    }
  }

  setSubmitDisabled(disabled: boolean): void {
    const btn = this.refs.submitBtn as HTMLButtonElement | undefined;

    if (btn) {
      btn.disabled = disabled;
    }
  }

  closeAndRemove(): void {
    this.element()?.remove();
    this.destroy();
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.element()!);
  }

  private readonly onRootClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    if (target === this.refs.backdrop) {
      this.onClose();

      return;
    }
    if (
      target.closest(".messenger-modal__close") ||
      target === this.refs.cancelBtn ||
      target.closest("[data-act=cancel]")
    ) {
      this.onClose();

      return;
    }
    if (target === this.refs.submitBtn || target.closest("[data-act=submit]")) {
      this.onSubmit();
    }
  };

  protected events = {
    click: this.onRootClick,
  };
}
export { MessengerModalShell, type MessengerModalShellProps };
