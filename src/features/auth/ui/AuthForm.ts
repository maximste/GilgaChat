import type { LinkProps } from "@/shared/lib/types";
import {
  authFormValidators,
  handleValidatedSubmit,
  runFieldValidatorOnFocusOut,
} from "@/shared/lib/validation";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type { ButtonProps } from "@/shared/ui/button/Button";
import type { FormFieldProps } from "@/shared/ui/formField/FormField";

import template from "./AuthForm.hbs?raw";

import "./AuthForm.scss";

interface AuthFormProps {
  title: string;
  subtitle?: string;
}

type AuthFormBlockProps = AuthFormProps & {
  emailFormField: FormFieldProps;
  passwordFormField: FormFieldProps;
  restorePasswordLink: LinkProps;
  signInButton: ButtonProps;
} & BlockOwnProps;

export class AuthForm extends Block<AuthFormBlockProps> {
  protected template = template;

  protected events = {
    submit: (event: Event) => {
      handleValidatedSubmit(event, authFormValidators);
    },
    focusout: (event: Event) => {
      runFieldValidatorOnFocusOut(event, authFormValidators);
    },
  };

  private container: HTMLElement;

  constructor(container: HTMLElement, props: AuthFormProps) {
    const fieldClass = "login-form__field";
    const labelClass = "login-form__label";
    const inputClass = "login-form__input";

    const initial: AuthFormBlockProps = {
      title: props.title,
      subtitle: props.subtitle,
      emailFormField: {
        label: {
          text: "Email",
          for: "userEmail",
          className: labelClass,
        },
        input: {
          id: "userEmail",
          type: "email",
          name: "email",
          required: true,
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-envelope",
      },
      passwordFormField: {
        label: {
          text: "Password",
          for: "userPassword",
          className: labelClass,
        },
        input: {
          id: "userPassword",
          type: "password",
          name: "password",
          required: true,
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-lock",
      },
      restorePasswordLink: {
        text: "Forgot password?",
        href: "/recovery",
        className: "login-form__link",
      },
      signInButton: {
        type: "submit",
        text: "Sign In",
        className: "login-form__submit-btn",
      },
    };

    super(initial);
    this.container = container;
  }

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }
  }
}
