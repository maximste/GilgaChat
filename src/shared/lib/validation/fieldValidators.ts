type ValuesBag = Record<string, string>;

type FieldValidator = (value: string, values: ValuesBag) => string | null;

const NAME_LATIN = /^[a-zA-Z]+(?:-[a-zA-Z]+)*$/;
const NAME_CYR = /^[а-яёА-ЯЁ]+(?:-[а-яёА-ЯЁ]+)*$/;

function validatePersonalName(value: string): string | null {
  const v = value.trim();

  if (!v) return "Обязательное поле";
  if (NAME_LATIN.test(v) || NAME_CYR.test(v)) return null;

  return "Имя: латиница или кириллица, без пробелов и цифр, допустим дефис";
}

/** login: 3–20, латиница, цифры/дефис/_, не только цифры, без пробелов */
function validateLogin(value: string): string | null {
  const v = value.trim();

  if (!v) return "Обязательное поле";
  if (v.length < 3 || v.length > 20) {
    return "Логин: от 3 до 20 символов";
  }
  if (!/^[a-zA-Z0-9_-]+$/.test(v)) {
    return "Логин: только латиница, цифры, дефис и подчёркивание, без пробелов";
  }
  if (/^\d+$/.test(v)) {
    return "Логин не может состоять только из цифр";
  }
  if (!/[a-zA-Z]/.test(v)) {
    return "В логине должна быть хотя бы одна буква";
  }

  return null;
}

/** email: @ и точка после неё; между @ и точкой — только буквы */
const EMAIL_RE = /^[A-Za-z0-9._+-]+@[A-Za-z]+\.[A-Za-z0-9.-]+$/;

function validateEmail(value: string): string | null {
  const v = value.trim();

  if (!v) return "Обязательное поле";
  if (!EMAIL_RE.test(v)) {
    return "Email: латиница/цифры в локальной части; после @ — буквы до точки, затем домен";
  }

  return null;
}

/** password: 8–40, минимум одна заглавная и одна цифра */
function validatePassword(value: string): string | null {
  const v = value.trim();

  if (!v) return "Обязательное поле";
  if (v.length < 8 || v.length > 40) {
    return "Пароль: от 8 до 40 символов";
  }
  if (!/[A-Z]/.test(v)) {
    return "В пароле нужна хотя бы одна заглавная буква";
  }
  if (!/[0-9]/.test(v)) {
    return "В пароле нужна хотя бы одна цифра";
  }

  return null;
}

/** phone: 10–15 символов, цифры, может начинаться с + */
function validatePhone(value: string): string | null {
  const v = value.trim();

  if (!v) return "Обязательное поле";
  if (/^\d{10,15}$/.test(v)) return null;
  if (/^\+\d{9,14}$/.test(v)) return null;

  return "Телефон: 10–15 символов, только цифры (в начале может быть +)";
}

function validateMessage(value: string): string | null {
  if (!value.trim()) return "Сообщение не должно быть пустым";

  return null;
}

function validatePasswordConfirm(
  value: string,
  values: ValuesBag,
): string | null {
  const v = value.trim();

  if (!v) return "Подтвердите пароль";
  if (v !== (values.password ?? "")) return "Пароли не совпадают";

  return null;
}

/** Опциональные поля пароля в настройках профиля */
function validateEditNewPassword(
  value: string,
  values: ValuesBag,
): string | null {
  const v = value.trim();

  if (!v) return null;
  if (v.length < 8 || v.length > 40) {
    return "Пароль: от 8 до 40 символов";
  }
  if (!/[A-Z]/.test(v)) {
    return "В пароле нужна хотя бы одна заглавная буква";
  }
  if (!/[0-9]/.test(v)) {
    return "В пароле нужна хотя бы одна цифра";
  }
  if (!values.old_password?.trim()) {
    return "Введите текущий пароль";
  }

  return null;
}

function validateEditOldPassword(
  value: string,
  values: ValuesBag,
): string | null {
  if (values.new_password?.trim() && !value.trim()) {
    return "Введите текущий пароль";
  }

  return null;
}

export {
  validateEditNewPassword,
  validateEditOldPassword,
  validateEmail,
  validateLogin,
  validateMessage,
  validatePassword,
  validatePasswordConfirm,
  validatePersonalName,
  validatePhone,
};
export type { FieldValidator, ValuesBag };
