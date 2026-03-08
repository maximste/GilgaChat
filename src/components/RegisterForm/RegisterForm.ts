import Handlebars from 'handlebars';

import template from './RegisterForm.hbs?raw';
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
} from '..';

import './RegisterForm.scss';

interface RegisterFormProps {
  title: string;
  subtitle?: string;
}

export class RegisterForm {
  private container: HTMLElement;
  private props: RegisterFormProps;
  private createAccountButton: Button;
  private signInLink: Link;
  private termsLink: Link;
  private privacyLink: Link;
  private formFields: FormField[];

  constructor(container: HTMLElement, props: RegisterFormProps) {
    this.container = container;
    this.props = props;

    const fieldClass = 'register-form__field';
    const labelClass = 'register-form__label';
    const inputClass = 'register-form__input';

    const loginLabel = new Label({ text: 'Login', for: 'userLogin', className: labelClass });
    const loginInput = new Input({
      id: 'userLogin',
      type: 'text',
      name: 'login',
      required: true,
      placeholder: 'Choose a login',
      className: inputClass,
    });

    const emailLabel = new Label({ text: 'Email', for: 'userEmail', className: labelClass });
    const emailInput = new Input({
      id: 'userEmail',
      type: 'email',
      name: 'email',
      required: true,
      placeholder: 'you@example.com',
      className: inputClass,
    });

    const nameLabel = new Label({ text: 'Name', for: 'userName', className: labelClass });
    const nameInput = new Input({
      id: 'userName',
      type: 'text',
      name: 'first_name',
      required: true,
      placeholder: 'Enter your name',
      className: inputClass,
    });

    const surnameLabel = new Label({ text: 'Surname', for: 'userSurname', className: labelClass });
    const surnameInput = new Input({
      id: 'userSurname',
      type: 'text',
      name: 'second_name',
      required: true,
      placeholder: 'Enter your surname',
      className: inputClass,
    });

    const phoneLabel = new Label({ text: 'Phone', for: 'userPhone', className: labelClass });
    const phoneInput = new Input({
      id: 'userPhone',
      type: 'tel',
      name: 'phone',
      required: true,
      placeholder: 'Enter your phone number',
      className: inputClass,
    });

    const passwordLabel = new Label({ text: 'Password', for: 'userPassword', className: labelClass });
    const passwordInput = new Input({
      id: 'userPassword',
      type: 'password',
      name: 'password',
      required: true,
      placeholder: 'Enter your password',
      className: inputClass,
    });

    const confirmPasswordLabel = new Label({
      text: 'Confirm Password',
      for: 'userConfirmPassword',
      className: labelClass,
    });
    const confirmPasswordInput = new Input({
      id: 'userConfirmPassword',
      type: 'password',
      name: 'password_confirm',
      required: true,
      placeholder: 'Confirm your password',
      className: inputClass,
    });

    this.formFields = [
      new FormField({ label: loginLabel.getData(), input: loginInput.getData(), className: fieldClass, icon: 'fa-solid fa-user' }),
      new FormField({ label: emailLabel.getData(), input: emailInput.getData(), className: fieldClass, icon: 'fa-solid fa-envelope' }),
      new FormField({ label: nameLabel.getData(), input: nameInput.getData(), className: fieldClass, icon: 'fa-solid fa-user' }),
      new FormField({ label: surnameLabel.getData(), input: surnameInput.getData(), className: fieldClass, icon: 'fa-solid fa-user' }),
      new FormField({ label: phoneLabel.getData(), input: phoneInput.getData(), className: fieldClass, icon: 'fa-solid fa-phone' }),
      new FormField({ label: passwordLabel.getData(), input: passwordInput.getData(), className: fieldClass, icon: 'fa-solid fa-lock' }),
      new FormField({
        label: confirmPasswordLabel.getData(),
        input: confirmPasswordInput.getData(),
        className: fieldClass,
        icon: 'fa-solid fa-lock',
      }),
    ];

    this.createAccountButton = new Button({
      type: 'submit',
      text: 'Create Account',
      className: 'register-form__submit-btn',
    });

    this.signInLink = new Link({
      text: 'Sign in',
      href: '#auth',
      className: 'register-form__link',
    });

    this.termsLink = new Link({
      text: 'Terms of Service',
      href: '#terms',
      className: 'register-form__link',
    });

    this.privacyLink = new Link({
      text: 'Privacy Policy',
      href: '#privacy',
      className: 'register-form__link',
    });
  }

  public render(): void {
    Handlebars.registerPartial('Button', ButtonTemplate);
    Handlebars.registerPartial('Input', InputTemplate);
    Handlebars.registerPartial('Label', LabelTemplate);
    Handlebars.registerPartial('FormField', FormFieldTemplate);
    Handlebars.registerPartial('Link', LinkTemplate);

    const compiledTemplate = Handlebars.compile(template)({
      title: this.props.title,
      subtitle: this.props.subtitle,
      loginFormField: this.formFields[0].getData(),
      emailFormField: this.formFields[1].getData(),
      nameFormField: this.formFields[2].getData(),
      surnameFormField: this.formFields[3].getData(),
      phoneFormField: this.formFields[4].getData(),
      passwordFormField: this.formFields[5].getData(),
      confirmPasswordFormField: this.formFields[6].getData(),
      createAccountButton: this.createAccountButton.getData(),
      signInLink: this.signInLink.getData(),
      termsLink: this.termsLink.getData(),
      privacyLink: this.privacyLink.getData(),
    });

    this.container.innerHTML = compiledTemplate;
  }
}
