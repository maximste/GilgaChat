import Handlebars from "handlebars";
import template from "./Label.hbs?raw";
import type { LabelProps } from "@/shared/lib/types";

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
