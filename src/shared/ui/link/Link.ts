import type { LinkProps } from "@/shared/lib/types";

import template from "./Link.hbs?raw";
import Handlebars from "handlebars";

class Link {
  private props: LinkProps;

  constructor(props: LinkProps) {
    this.props = props;
  }

  public getData(): LinkProps {
    return this.props;
  }

  public render(props: LinkProps): string {
    return Handlebars.compile(template)(props);
  }
}

export { Link };
