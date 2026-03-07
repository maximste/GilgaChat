import Handlebars from 'handlebars';

import template from './AuthForm.hbs?raw';
import { 
  Button,
  ButtonTemplate,
  FormField,
  FormFieldTemplate,
  Input,
  InputTemplate,
  Label,
  LabelTemplate,
} from '..';

import './AuthForm.scss'

interface AuthFormProps {
  title: string;
  subtitle?: string;
};

export class AuthForm {
  private container: HTMLElement;
  private props: AuthFormProps;
  private signInButton: Button;
  private emailLabel: Label;
  private emailInput: Input;
  private passwordLabel: Label;
  private passwordInput: Input;
  private emailFormField: FormField;
  private passwordFormField: FormField;

  constructor(container: HTMLElement, props: AuthFormProps) {
    this.container = container;
    this.props = props;

    this.emailLabel = new Label ({
      text: 'Email',
      for: 'userEmail',
      className: 'login-form__label',
    });

    this.passwordLabel = new Label ({
      text: 'Password',
      for: 'userPassword',
      className: 'login-form__label',
    });

    this.emailInput = new Input ({
      id: 'userEmail',
      type: 'email',
      name: 'email',
      required: true,
      className: "login-form__input",
    });

    this.passwordInput = new Input ({
      id: 'userPassword',
      type: 'password',
      name: 'password',
      required: true,
      className: "login-form__input",
    });

    this.signInButton = new Button ({
      type: 'submit',
      text: 'Sign In',
      className: 'login-form__submit-btn',
    });
    
    this.emailFormField = new FormField({
      label: this.emailLabel.getData(),
      input: this.emailInput.getData(),
      className: 'login-form__field',
    });

    this.passwordFormField = new FormField({
      label: this.passwordLabel.getData(),
      input: this.passwordInput.getData(),
      className: 'login-form__field',
    });
  }
  
  public render(): void {
    Handlebars.registerPartial("Button", ButtonTemplate);
    Handlebars.registerPartial("Input", InputTemplate);
    Handlebars.registerPartial("Label", LabelTemplate);
    Handlebars.registerPartial("FormField", FormFieldTemplate);

    const compiledTemplate = Handlebars.compile(template)({
      title: this.props.title,
      subtitle: this.props.subtitle,
      signInButton: this.signInButton.getData(),
      emailFormField: this.emailFormField.getData(),
      passwordFormField: this.passwordFormField.getData(),
    });

    this.container.innerHTML = compiledTemplate;
  }
};
