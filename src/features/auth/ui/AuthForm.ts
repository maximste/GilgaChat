import { APP_PATHS, appHref } from "@/shared/config/routes";
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
  /** После успешной валидации: в API уходит `login` и `password` (как в POST /auth/signin). */
  onSignIn?: (payload: {
    login: string;
    password: string;
  }) => void | Promise<void>;
}

type AuthFormBlockProps = AuthFormProps & {
  loginFormField: FormFieldProps;
  passwordFormField: FormFieldProps;
  restorePasswordLink: LinkProps;
  signUpLink: LinkProps;
  signInButton: ButtonProps;
} & BlockOwnProps;

class AuthForm extends Block<AuthFormBlockProps> {
  protected template = template;

  constructor(props: AuthFormProps) {
    const onSignIn = props.onSignIn;
    const fieldClass = "login-form__field";
    const labelClass = "login-form__label";
    const inputClass = "login-form__input";
    const initial: AuthFormBlockProps = {
      title: props.title,
      subtitle: props.subtitle,
      loginFormField: {
        label: {
          text: "Login",
          for: "userLogin",
          className: labelClass,
        },
        input: {
          id: "userLogin",
          type: "text",
          name: "login",
          required: true,
          placeholder: "Your login",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-user",
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
      signUpLink: {
        text: "Sign up",
        href: appHref(APP_PATHS.signUp),
        className: "login-form__sign-up-link",
      },
      signInButton: {
        type: "submit",
        text: "Sign In",
        className: "login-form__submit-btn",
      },
    };

    super(initial);
    this.events = {
      submit: (event: Event) => {
        handleValidatedSubmit(event, authFormValidators, (values) => {
          void onSignIn?.({
            login: String(values.login ?? "").trim(),
            password: String(values.password ?? ""),
          });
        });
      },
      focusout: (event: Event) => {
        runFieldValidatorOnFocusOut(event, authFormValidators);
      },
    };
  }
}
export { AuthForm, type AuthFormProps };
