import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./ErrorToast.hbs?raw";

import "./toast.scss";

const OUT_MS = 200;

type ErrorToastProps = {
  message: string;
} & BlockOwnProps;

type ErrorToastOptions = {
  durationMs: number;
  onRemoved: () => void;
};

/**
 * Одноразовый тост об ошибке: таймер, кнопка закрытия, анимация исчезновения.
 */
class ErrorToast extends Block<ErrorToastProps> {
  protected template = template;

  private readonly toastOptions: ErrorToastOptions;

  private settled = false;

  private timerId?: ReturnType<typeof setTimeout>;

  constructor(props: ErrorToastProps, toastOptions: ErrorToastOptions) {
    super(props);
    this.toastOptions = toastOptions;
  }

  protected componentDidMount(): void {
    this.timerId = window.setTimeout(() => {
      this.dismiss();
    }, this.toastOptions.durationMs);
  }

  protected componentWillUnmount(): void {
    if (this.timerId !== undefined) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
  }

  private dismiss(): void {
    if (this.settled) {
      return;
    }
    this.settled = true;
    if (this.timerId !== undefined) {
      window.clearTimeout(this.timerId);
      this.timerId = undefined;
    }
    const el = this.element();

    if (!el) {
      this.destroy();
      this.toastOptions.onRemoved();

      return;
    }
    el.classList.add("gilga-toast--out");
    window.setTimeout(() => {
      el.remove();
      this.destroy();
      this.toastOptions.onRemoved();
    }, OUT_MS);
  }

  protected events = {
    click: (event: Event) => {
      const target = event.target as HTMLElement;

      if (target === this.refs.closeBtn) {
        this.dismiss();
      }
    },
  };
}
export { ErrorToast, type ErrorToastProps };
