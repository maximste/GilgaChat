import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./MessengerFab.hbs?raw";

import "./MessengerFab.scss";

interface MessengerFabProps {
  onOpenGroup: () => void;
}

type MessengerFabBlockProps = MessengerFabProps & BlockOwnProps;

class MessengerFab extends Block<MessengerFabBlockProps> {
  static componentName = "MessengerFab";

  protected template = template;

  private readonly handleRootClick = (event: Event): void => {
    const target = event.target as HTMLElement;

    if (target.closest(".messenger-fab")) {
      event.stopPropagation();
      this.props.onOpenGroup();
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
export { type MessengerFabProps };
