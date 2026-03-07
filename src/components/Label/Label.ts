import Handlebars from 'handlebars';
import template from './Label.hbs?raw';
import './Label.scss';
import type { LabelProps } from '../../types';

class Label {
  private props: LabelProps;
  
  constructor(props: LabelProps){
    this.props = props;
  }

  public getData(): LabelProps {
    return this.props;
  }

  public render(props: LabelProps): string {
    return Handlebars.compile(template)(props);
  }
};

export { Label };
