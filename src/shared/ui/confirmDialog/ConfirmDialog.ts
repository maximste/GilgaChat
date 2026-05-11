import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ConfirmDialog.hbs?raw";

import "./confirmDialog.scss";

type ConfirmDialogProps = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  isDanger: boolean;
  /** Уникальный id для aria-labelledby (несколько диалогов подряд). */
  titleId: string;
} & BlockOwnProps;

type ConfirmDialogOptions = {
  onResult: (confirmed: boolean) => void;
};

class ConfirmDialog extends Block<ConfirmDialogProps> {
  protected template = template;

  private readonly dialogOptions: ConfirmDialogOptions;

  private settled = false;

  constructor(props: ConfirmDialogProps, dialogOptions: ConfirmDialogOptions) {
    super(props);
    this.dialogOptions = dialogOptions;
  }

  protected componentDidMount(): void {
    document.addEventListener("keydown", this.onDocumentKeydown);
    (this.refs.cancelBtn as HTMLButtonElement | undefined)?.focus();
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onDocumentKeydown);
  }

  private finish(value: boolean): void {
    if (this.settled) {
      return;
    }
    this.settled = true;
    const el = this.element();

    if (el) {
      el.remove();
    }
    this.destroy();
    this.dialogOptions.onResult(value);
  }

  private readonly onDocumentKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.finish(false);
    }
  };

  protected events = {
    click: (event: Event) => {
      const root = this.element();
      const target = event.target as HTMLElement;

      if (target === root) {
        this.finish(false);

        return;
      }
      if (target === this.refs.cancelBtn) {
        this.finish(false);

        return;
      }
      if (target === this.refs.confirmBtn) {
        this.finish(true);
      }
    },
  };
}
export { ConfirmDialog, type ConfirmDialogOptions, type ConfirmDialogProps };
