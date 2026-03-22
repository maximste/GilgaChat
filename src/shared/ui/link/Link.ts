import type { LinkProps } from "@/shared/lib/types";

import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Link.hbs?raw";

type LinkBlockProps = LinkProps & BlockOwnProps;

class Link extends Block<LinkBlockProps> {
  static componentName = "Link";

  protected template = template;

  constructor(props: LinkBlockProps) {
    super(props);
  }
}

export { Link };
