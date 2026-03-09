import Handlebars from 'handlebars';
import template from './FormField.hbs?raw';
import './FormField.scss';
import type { InputProps, LabelProps } from '../../types';
import InputTemplate from '../Input/Input.hbs?raw';
import LabelTemplate from '../Label/Label.hbs?raw';

interface FormFieldProps {
  input: InputProps;
  label: LabelProps;
  className?: string;
  /** Font Awesome icon classes, e.g. "fa-solid fa-envelope" */
  icon?: string;
}

class FormField {
  private props: FormFieldProps;
  
  constructor(props: FormFieldProps){
    this.props = props;
  }

  public getData(): FormFieldProps {
    const input = this.props.icon
      ? { ...this.props.input, className: [this.props.input.className, 'form-field__input--with-icon'].filter(Boolean).join(' ') }
      : this.props.input;
    return { ...this.props, input };
  }

  public render(): string {
    Handlebars.registerPartial("Input", InputTemplate);
    Handlebars.registerPartial("Label", LabelTemplate);
    const data = this.getData();
    return Handlebars.compile(template)(data);
  }
};

export { FormField };
