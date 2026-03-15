import {
  Button,
  ButtonTemplate,
  FormField,
  FormFieldTemplate,
  Input,
  InputTemplate,
  Label,
  LabelTemplate,
} from "@/shared/ui";

import template from "./EditProfileForm.hbs?raw";
import Handlebars from "handlebars";

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

export class EditProfileForm {
  private container: HTMLElement;

  private callbacks: EditProfileFormCallbacks;

  private loginFormField: InstanceType<typeof FormField>;

  private displayNameFormField: InstanceType<typeof FormField>;

  private emailFormField: InstanceType<typeof FormField>;

  private firstNameFormField: InstanceType<typeof FormField>;

  private secondNameFormField: InstanceType<typeof FormField>;

  private phoneFormField: InstanceType<typeof FormField>;

  private oldPasswordFormField: InstanceType<typeof FormField>;

  private newPasswordFormField: InstanceType<typeof FormField>;

  private cancelButton: InstanceType<typeof Button>;

  private saveButton: InstanceType<typeof Button>;

  constructor(
    container: HTMLElement,
    props: EditProfileFormProps,
    callbacks: EditProfileFormCallbacks,
  ) {
    this.container = container;
    this.callbacks = callbacks;

    const fieldClass = "edit-profile__field";
    const labelClass = "edit-profile__label";
    const inputClass = "edit-profile__input";

    this.loginFormField = new FormField({
      label: new Label({
        text: "Login",
        for: "editProfileLogin",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileLogin",
        type: "text",
        name: "login",
        value: props.login,
        required: true,
        placeholder: "Login",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-user",
    });

    this.displayNameFormField = new FormField({
      label: new Label({
        text: "Display name",
        for: "editProfileDisplayName",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileDisplayName",
        type: "text",
        name: "display_name",
        value: props.displayName,
        required: true,
        placeholder: "Display name",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-user",
    });

    this.emailFormField = new FormField({
      label: new Label({
        text: "Email",
        for: "editProfileEmail",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileEmail",
        type: "email",
        name: "email",
        value: props.email,
        required: true,
        placeholder: "you@example.com",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-envelope",
    });

    this.firstNameFormField = new FormField({
      label: new Label({
        text: "Name",
        for: "editProfileFirstName",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileFirstName",
        type: "text",
        name: "first_name",
        value: props.firstName,
        required: true,
        placeholder: "Name",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-user",
    });

    this.secondNameFormField = new FormField({
      label: new Label({
        text: "Surname",
        for: "editProfileSecondName",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileSecondName",
        type: "text",
        name: "second_name",
        value: props.surname,
        required: true,
        placeholder: "Surname",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-user",
    });

    this.phoneFormField = new FormField({
      label: new Label({
        text: "Phone",
        for: "editProfilePhone",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfilePhone",
        type: "tel",
        name: "phone",
        value: props.phone,
        required: true,
        placeholder: "+1 (555) 000-0000",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-phone",
    });

    this.oldPasswordFormField = new FormField({
      label: new Label({
        text: "Current password",
        for: "editProfileOldPassword",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileOldPassword",
        type: "password",
        name: "old_password",
        placeholder: "Leave blank to keep current",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-lock",
    });

    this.newPasswordFormField = new FormField({
      label: new Label({
        text: "New password",
        for: "editProfileNewPassword",
        className: labelClass,
      }).getData(),
      input: new Input({
        id: "editProfileNewPassword",
        type: "password",
        name: "new_password",
        placeholder: "Leave blank to keep current",
        className: inputClass,
      }).getData(),
      className: fieldClass,
      icon: "fa-solid fa-lock",
    });

    this.cancelButton = new Button({
      type: "button",
      text: "Cancel",
      className: "edit-profile__btn edit-profile__btn--secondary",
    });

    this.saveButton = new Button({
      type: "submit",
      text: "Save",
      className: "edit-profile__btn edit-profile__btn--primary",
    });
  }

  public render(): void {
    Handlebars.registerPartial("Button", ButtonTemplate);
    Handlebars.registerPartial("FormField", FormFieldTemplate);
    Handlebars.registerPartial("Input", InputTemplate);
    Handlebars.registerPartial("Label", LabelTemplate);

    this.container.innerHTML = Handlebars.compile(template)({
      loginFormField: this.loginFormField.getData(),
      displayNameFormField: this.displayNameFormField.getData(),
      emailFormField: this.emailFormField.getData(),
      firstNameFormField: this.firstNameFormField.getData(),
      secondNameFormField: this.secondNameFormField.getData(),
      phoneFormField: this.phoneFormField.getData(),
      oldPasswordFormField: this.oldPasswordFormField.getData(),
      newPasswordFormField: this.newPasswordFormField.getData(),
      cancelButton: this.cancelButton.getData(),
      saveButton: this.saveButton.getData(),
    });

    this.container
      .querySelector('[type="button"]')
      ?.addEventListener("click", () => {
        this.callbacks.onCancel();
      });

    this.container
      .querySelector("#editProfileForm")
      ?.addEventListener("submit", (e) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data: EditProfileFormProps = {
          login: (
            form.elements.namedItem("login") as HTMLInputElement
          ).value.trim(),
          displayName: (
            form.elements.namedItem("display_name") as HTMLInputElement
          ).value.trim(),
          email: (
            form.elements.namedItem("email") as HTMLInputElement
          ).value.trim(),
          firstName: (
            form.elements.namedItem("first_name") as HTMLInputElement
          ).value.trim(),
          surname: (
            form.elements.namedItem("second_name") as HTMLInputElement
          ).value.trim(),
          phone: (
            form.elements.namedItem("phone") as HTMLInputElement
          ).value.trim(),
          oldPassword:
            (form.elements.namedItem("old_password") as HTMLInputElement)
              .value || undefined,
          newPassword:
            (form.elements.namedItem("new_password") as HTMLInputElement)
              .value || undefined,
        };

        this.callbacks.onSave?.(data);
      });
  }
}
