import Handlebars from 'handlebars';
import template from './Input.hbs?raw';
import type { InputProps } from '../../types';

class Input {
  private props: InputProps;
  
  constructor(props: InputProps){
    this.props = props;
  }

  public getData(): InputProps {
    return this.props;
  }

  public render(props: InputProps): string {
    return Handlebars.compile(template)(props);
  }
};

export { Input };
