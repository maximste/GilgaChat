import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./MainLayout.hbs?raw";

import "./MainLayout.scss";

export interface MainLayoutProps {
  content?: string;
}

type MainLayoutBlockProps = MainLayoutProps & BlockOwnProps;

class MainLayout extends Block<MainLayoutBlockProps> {
  protected template = template;

  constructor(props: MainLayoutProps) {
    super({
      ...props,
      content: props.content ?? "",
    } as MainLayoutBlockProps);
  }
}

export { MainLayout };
