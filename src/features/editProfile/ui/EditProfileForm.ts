import {
  editProfileFormValidators,
  handleValidatedSubmit,
  runFieldValidatorOnFocusOut,
} from "@/shared/lib/validation";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import type { ButtonProps } from "@/shared/ui/button/Button";
import type { FormFieldProps } from "@/shared/ui/formField/FormField";

import template from "./EditProfileForm.hbs?raw";

import "./EditProfileForm.scss";

export interface EditProfileFormProps {
  login: string;
  displayName: string;
  email: string;
  firstName: string;
  surname: string;
  phone: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface EditProfileFormCallbacks {
  onCancel: () => void;
  onSave?: (data: EditProfileFormProps) => void;
}

type EditProfileFormBlockProps = {
  loginFormField: FormFieldProps;
  displayNameFormField: FormFieldProps;
  emailFormField: FormFieldProps;
  firstNameFormField: FormFieldProps;
  secondNameFormField: FormFieldProps;
  phoneFormField: FormFieldProps;
  oldPasswordFormField: FormFieldProps;
  newPasswordFormField: FormFieldProps;
  cancelButton: ButtonProps;
  saveButton: ButtonProps;
} & BlockOwnProps;

function buildBlockProps(
  props: EditProfileFormProps,
): EditProfileFormBlockProps {
  const fieldClass = "edit-profile__field";
  const labelClass = "edit-profile__label";
  const inputClass = "edit-profile__input";

  return {
    loginFormField: {
      label: {
        text: "Login",
        for: "editProfileLogin",
        className: labelClass,
      },
      input: {
        id: "editProfileLogin",
        type: "text",
        name: "login",
        value: props.login,
        required: true,
        placeholder: "Login",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-user",
    },
    displayNameFormField: {
      label: {
        text: "Display name",
        for: "editProfileDisplayName",
        className: labelClass,
      },
      input: {
        id: "editProfileDisplayName",
        type: "text",
        name: "display_name",
        value: props.displayName,
        required: true,
        placeholder: "Display name",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-user",
    },
    emailFormField: {
      label: {
        text: "Email",
        for: "editProfileEmail",
        className: labelClass,
      },
      input: {
        id: "editProfileEmail",
        type: "email",
        name: "email",
        value: props.email,
        required: true,
        placeholder: "you@example.com",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-envelope",
    },
    firstNameFormField: {
      label: {
        text: "Name",
        for: "editProfileFirstName",
        className: labelClass,
      },
      input: {
        id: "editProfileFirstName",
        type: "text",
        name: "first_name",
        value: props.firstName,
        required: true,
        placeholder: "Name",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-user",
    },
    secondNameFormField: {
      label: {
        text: "Surname",
        for: "editProfileSecondName",
        className: labelClass,
      },
      input: {
        id: "editProfileSecondName",
        type: "text",
        name: "second_name",
        value: props.surname,
        required: true,
        placeholder: "Surname",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-user",
    },
    phoneFormField: {
      label: {
        text: "Phone",
        for: "editProfilePhone",
        className: labelClass,
      },
      input: {
        id: "editProfilePhone",
        type: "tel",
        name: "phone",
        value: props.phone,
        required: true,
        placeholder: "+1 (555) 000-0000",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-phone",
    },
    oldPasswordFormField: {
      label: {
        text: "Current password",
        for: "editProfileOldPassword",
        className: labelClass,
      },
      input: {
        id: "editProfileOldPassword",
        type: "password",
        name: "old_password",
        placeholder: "Leave blank to keep current",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-lock",
    },
    newPasswordFormField: {
      label: {
        text: "New password",
        for: "editProfileNewPassword",
        className: labelClass,
      },
      input: {
        id: "editProfileNewPassword",
        type: "password",
        name: "new_password",
        placeholder: "Leave blank to keep current",
        className: inputClass,
      },
      className: fieldClass,
      icon: "fa-solid fa-lock",
    },
    cancelButton: {
      type: "button",
      text: "Cancel",
      className: "edit-profile__btn edit-profile__btn--secondary",
    },
    saveButton: {
      type: "submit",
      text: "Save",
      className: "edit-profile__btn edit-profile__btn--primary",
    },
  };
}

export class EditProfileForm extends Block<EditProfileFormBlockProps> {
  protected template = template;

  private container: HTMLElement;

  private callbacks: EditProfileFormCallbacks;

  protected events = {
    submit: (event: Event) => {
      handleValidatedSubmit(event, editProfileFormValidators, (values) => {
        const data: EditProfileFormProps = {
          login: values.login.trim(),
          displayName: values.display_name.trim(),
          email: values.email.trim(),
          firstName: values.first_name.trim(),
          surname: values.second_name.trim(),
          phone: values.phone.trim(),
          oldPassword: values.old_password?.trim() || undefined,
          newPassword: values.new_password?.trim() || undefined,
        };

        this.callbacks.onSave?.(data);
      });
    },
    focusout: (event: Event) => {
      runFieldValidatorOnFocusOut(event, editProfileFormValidators);
    },
  };

  constructor(
    container: HTMLElement,
    props: EditProfileFormProps,
    callbacks: EditProfileFormCallbacks,
  ) {
    super(buildBlockProps(props));
    this.container = container;
    this.callbacks = callbacks;
  }

  public render(): void {
    super.render();
    const root = this.element();

    if (root) {
      this.container.replaceChildren(root);
    }

    this.container
      .querySelector('[type="button"]')
      ?.addEventListener("click", () => {
        this.callbacks.onCancel();
      });
  }
}
