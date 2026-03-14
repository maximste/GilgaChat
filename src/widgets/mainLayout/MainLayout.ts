import Handlebars from "handlebars";
import template from "./MainLayout.hbs?raw";
import { LinkTemplate } from "@/shared/ui";
import type { LinkProps } from "@/shared/lib/types";
import "./MainLayout.scss";

export interface MainLayoutProps {
  goBackLink: LinkProps;
  content?: string;
}

class MainLayout {
  private props: MainLayoutProps;

  constructor(props: MainLayoutProps) {
    this.props = {
      ...props,
      content: props.content ?? "",
    };
  }

  public render(): string {
    Handlebars.registerPartial("Link", LinkTemplate);
    return Handlebars.compile(template)(this.props);
  }
}

export { MainLayout };
