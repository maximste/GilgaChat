import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Button.hbs?raw";

import "./Button.scss";

interface ButtonProps {
  type: "reset" | "submit" | "button";
  text?: string;
  disabled?: boolean;
  className?: string;
  leftSection?: string;
  rightSection?: string;
  ariaHaspopup?: string;
  ariaExpanded?: string | boolean;
}

type ButtonBlockProps = ButtonProps & BlockOwnProps;

class Button extends Block<ButtonBlockProps> {
  static componentName = "Button";

  protected template = template;

  constructor(props: ButtonBlockProps) {
    super(props);
  }
}
export { Button };
export { type ButtonProps };
