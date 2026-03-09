import Handlebars from 'handlebars';
import template from './Link.hbs?raw';
import type { LinkProps } from '@/types';

class Link {
  private props: LinkProps;
  
  constructor(props: LinkProps){
    this.props = props;
  }

  public getData(): LinkProps {
    return this.props;
  }

  public render(props: LinkProps): string {
    return Handlebars.compile(template)(props);
  }
};

export { Link };
