import type { LabelProps } from "@/shared/lib/types";

import template from "./Label.hbs?raw";
import Handlebars from "handlebars";

class Label {
  private props: LabelProps;

  constructor(props: LabelProps) {
    this.props = props;
  }

  public getData(): LabelProps {
    return this.props;
  }

  public render(props: LabelProps): string {
    return Handlebars.compile(template)(props);
  }
}

export { Label };
