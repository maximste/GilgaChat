import { Block, type BlockOwnProps } from "../block/Block";
import template from "./Search.hbs?raw";

import "./Search.scss";

export interface SearchProps {
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
  /** Класс иконки Font Awesome без префикса `fa-solid` (например `fa-magnifying-glass`) */
  iconClass?: string;
}

type SearchBlockProps = SearchProps & BlockOwnProps;

class Search extends Block<SearchBlockProps> {
  static componentName = "Search";

  protected template = template;

  constructor(props: SearchBlockProps = {} as SearchBlockProps) {
    const placeholder = props.placeholder ?? "Search";

    super({
      ...props,
      placeholder,
      ariaLabel: props.ariaLabel ?? placeholder,
      className: props.className ?? "",
      iconClass: props.iconClass ?? "fa-magnifying-glass",
    } as SearchBlockProps);
  }
}

export { Search };
