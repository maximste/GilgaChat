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
  Link,
  LinkTemplate,
} from '@/shared/ui';

import './AuthForm.scss';

interface AuthFormProps {
  title: string;
  subtitle?: string;
}

export class AuthForm {
  private container: HTMLElement;
  private props: AuthFormProps;
  private signInButton: InstanceType<typeof Button>;
  private emailLabel: InstanceType<typeof Label>;
  private emailInput: InstanceType<typeof Input>;
  private passwordLabel: InstanceType<typeof Label>;
  private passwordInput: InstanceType<typeof Input>;
  private emailFormField: InstanceType<typeof FormField>;
  private passwordFormField: InstanceType<typeof FormField>;
  private restorePasswordLink: InstanceType<typeof Link>;

  constructor(container: HTMLElement, props: AuthFormProps) {
    this.container = container;
    this.props = props;

    this.emailLabel = new Label({
      text: 'Email',
      for: 'userEmail',
      className: 'login-form__label',
    });

    this.passwordLabel = new Label({
      text: 'Password',
      for: 'userPassword',
      className: 'login-form__label',
    });

    this.emailInput = new Input({
      id: 'userEmail',
      type: 'email',
      name: 'email',
      required: true,
      className: "login-form__input",
    });

    this.passwordInput = new Input({
      id: 'userPassword',
      type: 'password',
      name: 'password',
      required: true,
      className: "login-form__input",
    });

    this.signInButton = new Button({
      type: 'submit',
      text: 'Sign In',
      className: 'login-form__submit-btn',
    });

    this.emailFormField = new FormField({
      label: this.emailLabel.getData(),
      input: this.emailInput.getData(),
      className: 'login-form__field',
      icon: 'fa-solid fa-envelope',
    });

    this.passwordFormField = new FormField({
      label: this.passwordLabel.getData(),
      input: this.passwordInput.getData(),
      className: 'login-form__field',
      icon: 'fa-solid fa-lock',
    });

    this.restorePasswordLink = new Link({
      text: 'Forgot password?',
      href: '/recovery',
      className: 'login-form__link',
    });
  }

  public render(): void {
    Handlebars.registerPartial("Button", ButtonTemplate);
    Handlebars.registerPartial("Input", InputTemplate);
    Handlebars.registerPartial("Label", LabelTemplate);
    Handlebars.registerPartial("FormField", FormFieldTemplate);
    Handlebars.registerPartial("Link", LinkTemplate);

    const compiledTemplate = Handlebars.compile(template)({
      title: this.props.title,
      subtitle: this.props.subtitle,
      signInButton: this.signInButton.getData(),
      emailFormField: this.emailFormField.getData(),
      passwordFormField: this.passwordFormField.getData(),
      restorePasswordLink: this.restorePasswordLink.getData(),
    });

    this.container.innerHTML = compiledTemplate;
  }
}
