import { APP_PATHS, appHref } from "@/shared/config/routes";
import type { SignUpRequest } from "@/shared/lib/api/types";
import type { LinkProps } from "@/shared/lib/types";
import {
  handleValidatedSubmit,
  registerFormValidators,
  runFieldValidatorOnFocusOut,
} from "@/shared/lib/validation";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type { ButtonProps } from "@/shared/ui/button/Button";
import type { FormFieldProps } from "@/shared/ui/formField/FormField";

import template from "./RegisterForm.hbs?raw";

import "./RegisterForm.scss";

interface RegisterFormProps {
  title: string;
  subtitle?: string;
  onSignUp?: (payload: SignUpRequest) => void | Promise<void>;
}

type RegisterFormBlockProps = RegisterFormProps & {
  loginFormField: FormFieldProps;
  emailFormField: FormFieldProps;
  passwordFormField: FormFieldProps;
  confirmPasswordFormField: FormFieldProps;
  nameFormField: FormFieldProps;
  surnameFormField: FormFieldProps;
  displayNameFormField: FormFieldProps;
  phoneFormField: FormFieldProps;
  createAccountButton: ButtonProps;
  signInLink: LinkProps;
} & BlockOwnProps;

class RegisterForm extends Block<RegisterFormBlockProps> {
  protected template = template;

  constructor(props: RegisterFormProps) {
    const onSignUp = props.onSignUp;
    const fieldClass = "register-form__field";
    const labelClass = "register-form__label";
    const inputClass = "register-form__input";
    const initial: RegisterFormBlockProps = {
      title: props.title,
      subtitle: props.subtitle,
      loginFormField: {
        label: { text: "Login", for: "userLogin", className: labelClass },
        input: {
          id: "userLogin",
          type: "text",
          name: "login",
          required: true,
          placeholder: "Choose a login",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-user",
      },
      emailFormField: {
        label: { text: "Email", for: "userEmail", className: labelClass },
        input: {
          id: "userEmail",
          type: "email",
          name: "email",
          required: true,
          placeholder: "you@example.com",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-envelope",
      },
      passwordFormField: {
        label: { text: "Password", for: "userPassword", className: labelClass },
        input: {
          id: "userPassword",
          type: "password",
          name: "password",
          required: true,
          placeholder: "Password",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-lock",
      },
      confirmPasswordFormField: {
        label: {
          text: "Confirm Password",
          for: "userConfirmPassword",
          className: labelClass,
        },
        input: {
          id: "userConfirmPassword",
          type: "password",
          name: "password_confirm",
          required: true,
          placeholder: "Confirm password",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-lock",
      },
      nameFormField: {
        label: { text: "Name", for: "userName", className: labelClass },
        input: {
          id: "userName",
          type: "text",
          name: "first_name",
          required: true,
          placeholder: "Enter your name",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-user",
      },
      surnameFormField: {
        label: { text: "Surname", for: "userSurname", className: labelClass },
        input: {
          id: "userSurname",
          type: "text",
          name: "second_name",
          required: true,
          placeholder: "Surname",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-user",
      },
      displayNameFormField: {
        label: {
          text: "Display name",
          for: "userDisplayName",
          className: labelClass,
        },
        input: {
          id: "userDisplayName",
          type: "text",
          name: "display_name",
          required: true,
          placeholder: "Display name",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-user",
      },
      phoneFormField: {
        label: { text: "Phone", for: "userPhone", className: labelClass },
        input: {
          id: "userPhone",
          type: "tel",
          name: "phone",
          required: true,
          placeholder: "Phone number",
          className: inputClass,
        },
        className: fieldClass,
        icon: "fa-solid fa-phone",
      },
      createAccountButton: {
        type: "submit",
        text: "Create Account",
        className: "register-form__btn register-form__btn--primary",
      },
      signInLink: {
        text: "Sign in",
        href: appHref(APP_PATHS.login),
        className: "register-form__link",
      },
    };

    super(initial);
    this.events = {
      submit: (event: Event) => {
        handleValidatedSubmit(event, registerFormValidators, (values) => {
          void onSignUp?.({
            first_name: String(values.first_name ?? "").trim(),
            second_name: String(values.second_name ?? "").trim(),
            login: String(values.login ?? "").trim(),
            email: String(values.email ?? "").trim(),
            password: String(values.password ?? ""),
            phone: String(values.phone ?? "").trim(),
          });
        });
      },
      focusout: (event: Event) => {
        runFieldValidatorOnFocusOut(event, registerFormValidators);
      },
    };
  }
}
export { RegisterForm, type RegisterFormProps };
