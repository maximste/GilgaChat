import Handlebars from 'handlebars';
import template from './Button.hbs?raw';
import './Button.scss';

interface ButtonProps {
  type: 'reset' | 'submit' | 'button'
  text: string;
  disabled?: boolean;
  className?: string
};

class Button {
  private props: ButtonProps;
  
  constructor(props: ButtonProps){
    this.props = props;
  }

  public getData(): ButtonProps {
    return this.props;
  }

  public render(props: ButtonProps): string {
    return Handlebars.compile(template)(props);
  }
};

export { Button };
