import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./MessengerFab.hbs?raw";

import "./MessengerFab.scss";

export interface MessengerFabProps {
  onOpenDm: () => void;
  onOpenGroup: () => void;
}

type MessengerFabBlockProps = MessengerFabProps & BlockOwnProps;

class MessengerFab extends Block<MessengerFabBlockProps> {
  static componentName = "MessengerFab";

  protected template = template;

  private menuOpen = false;

  private readonly onDocumentClick = (ev: MouseEvent): void => {
    if (!this.menuOpen) {
      return;
    }

    const root = this.element();

    if (root?.contains(ev.target as Node)) {
      return;
    }

    this.closeMenu();
  };

  protected componentDidMount(): void {
    document.addEventListener("click", this.onDocumentClick);
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("click", this.onDocumentClick);
  }

  private closeMenu(): void {
    this.menuOpen = false;
    const menu = this.refs.fabMenu;

    if (menu instanceof HTMLElement) {
      menu.hidden = true;
    }

    const fab = this.refs.fabBtn;

    if (fab instanceof HTMLElement) {
      fab.setAttribute("aria-expanded", "false");
    }
  }

  private toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    const menu = this.refs.fabMenu;

    if (menu instanceof HTMLElement) {
      menu.hidden = !this.menuOpen;
    }

    const fab = this.refs.fabBtn;

    if (fab instanceof HTMLElement) {
      fab.setAttribute("aria-expanded", String(this.menuOpen));
    }
  }

  private readonly handleRootClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    if (target.closest(".messenger-fab")) {
      event.stopPropagation();
      this.toggleMenu();

      return;
    }

    const opener = target.closest<HTMLButtonElement>("[data-open]");

    if (opener && this.refs.fabMenu?.contains(opener)) {
      const kind = opener.getAttribute("data-open");

      this.closeMenu();

      if (kind === "dm") {
        this.props.onOpenDm();
      }

      if (kind === "group") {
        this.props.onOpenGroup();
      }
    }
  };

  protected events = {
    click: this.handleRootClick,
  };

  constructor(props: MessengerFabProps) {
    super(props as MessengerFabBlockProps);
  }
}

export { MessengerFab };
