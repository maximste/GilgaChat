import type { LabelProps } from "@/shared/lib/types";

import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Label.hbs?raw";

type LabelBlockProps = LabelProps & BlockOwnProps;

class Label extends Block<LabelBlockProps> {
  static componentName = "Label";

  protected template = template;

  constructor(props: LabelBlockProps) {
    super(props);
  }
}
export { Label };
