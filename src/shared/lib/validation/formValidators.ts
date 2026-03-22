import type { FieldValidator } from "./fieldValidators";
import {
  validateEditNewPassword,
  validateEditOldPassword,
  validateEmail,
  validateLogin,
  validateMessage,
  validatePassword,
  validatePasswordConfirm,
  validatePersonalName,
  validatePhone,
} from "./fieldValidators";

const authFormValidators: Record<string, FieldValidator> = {
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
};

const registerFormValidators: Record<string, FieldValidator> = {
  login: (v) => validateLogin(v),
  email: (v) => validateEmail(v),
  password: (v) => validatePassword(v),
  password_confirm: (v, all) => validatePasswordConfirm(v, all),
  first_name: (v) => validatePersonalName(v),
  second_name: (v) => validatePersonalName(v),
  display_name: (v) => validatePersonalName(v),
  phone: (v) => validatePhone(v),
};

const editProfileFormValidators: Record<string, FieldValidator> = {
  login: (v) => validateLogin(v),
  display_name: (v) => validatePersonalName(v),
  email: (v) => validateEmail(v),
  first_name: (v) => validatePersonalName(v),
  second_name: (v) => validatePersonalName(v),
  phone: (v) => validatePhone(v),
  old_password: (v, all) => validateEditOldPassword(v, all),
  new_password: (v, all) => validateEditNewPassword(v, all),
};

const messageFormValidators: Record<string, FieldValidator> = {
  message: (v) => validateMessage(v),
};

export {
  authFormValidators,
  editProfileFormValidators,
  messageFormValidators,
  registerFormValidators,
};
