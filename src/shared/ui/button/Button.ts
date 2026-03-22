import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Button.hbs?raw";

import "./Button.scss";

export interface ButtonProps {
  type: "reset" | "submit" | "button";
  text: string;
  disabled?: boolean;
  className?: string;
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
