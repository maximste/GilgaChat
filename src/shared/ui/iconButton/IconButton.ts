import { Block, type BlockOwnProps } from "../block/Block";
import template from "./IconButton.hbs?raw";

import "./IconButton.scss";

export interface IconButtonProps {
  /** Классы иконки Font Awesome, например `fa-solid fa-paperclip` */
  icon: string;
  /** Обязательная подпись для доступности */
  ariaLabel: string;
  /** Если задан — рендерится `<a>` вместо `<button>` */
  href?: string;
  type?: "button" | "submit" | "reset";
  className?: string;
  disabled?: boolean;
}

type IconButtonBlockProps = IconButtonProps & BlockOwnProps;

class IconButton extends Block<IconButtonBlockProps> {
  static componentName = "IconButton";

  protected template = template;

  constructor(props: IconButtonBlockProps) {
    super({
      ...props,
      type: props.type ?? "button",
    } as IconButtonBlockProps);
  }
}

export { IconButton };
