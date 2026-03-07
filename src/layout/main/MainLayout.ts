import Handlebars from 'handlebars';
import template from './MainLayout.hbs?raw';
import { LinkTemplate } from '../../components';
import type { LinkProps } from '../../types';
import './MainLayout.scss';

export interface MainLayoutProps {
  signInLink: LinkProps;
  signUpLink: LinkProps;
  content?: string;
}

class MainLayout {
  private props: MainLayoutProps;

  constructor(props: MainLayoutProps) {
    this.props = {
      ...props,
      content: props.content ?? '',
    };
  }

  public render(): string {
    Handlebars.registerPartial('Link', LinkTemplate);
    return Handlebars.compile(template)(this.props);
  }
}

export { MainLayout };
