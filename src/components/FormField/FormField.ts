import Handlebars from 'handlebars';
import template from './FormField.hbs?raw';
import './FormField.scss';
import type { InputProps, LabelProps } from '../../types';
import InputTemplate from '../Input/Input.hbs?raw';
import LabelTemplate from '../Label/Label.hbs?raw';

interface FormFieldProps {
  input: InputProps,
  label: LabelProps,
  className?: string;
};

class FormField {
  private props: FormFieldProps;
  
  constructor(props: FormFieldProps){
    this.props = props;
  }

  public getData(): FormFieldProps {
    return this.props;
  }

  public render(props: FormFieldProps): string {
    Handlebars.registerPartial("Input", InputTemplate);
    Handlebars.registerPartial("Label", LabelTemplate);
    
    return Handlebars.compile(template)(props);
  }
};

export { FormField };
