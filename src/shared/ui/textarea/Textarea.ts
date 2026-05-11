import type { TextareaProps } from "@/shared/lib/types";

import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Textarea.hbs?raw";

import "./Textarea.scss";

type TextareaBlockProps = TextareaProps & BlockOwnProps;

class Textarea extends Block<TextareaBlockProps> {
  static componentName = "Textarea";

  protected template = template;

  constructor(props: TextareaBlockProps) {
    super({
      ...props,
      rows: props.rows ?? 2,
    } as TextareaBlockProps);
  }
}
export { Textarea };
