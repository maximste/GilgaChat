import type { InputProps } from "@/shared/lib/types";

import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Input.hbs?raw";

type InputBlockProps = InputProps & BlockOwnProps;

class Input extends Block<InputBlockProps> {
  static componentName = "Input";

  protected template = template;

  constructor(props: InputBlockProps) {
    super(props);
  }
}

export { Input };
