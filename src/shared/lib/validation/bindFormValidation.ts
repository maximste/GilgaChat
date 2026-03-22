import type { FieldValidator, ValuesBag } from "./fieldValidators";

function readLiveValues(
  form: HTMLFormElement,
  fieldNames: string[],
): ValuesBag {
  const values: ValuesBag = {};

  for (const name of fieldNames) {
    const el = form.elements.namedItem(name);

    if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
      values[name] = el.value;
    } else if (el instanceof RadioNodeList) {
      values[name] = el.value;
    }
  }

  return values;
}

/**
 * Показать/сбросить ошибку у поля: разметка .form-field вокруг input/textarea.
 */
function setFieldErrorDom(
  form: HTMLFormElement,
  fieldName: string,
  message: string | null,
): void {
  const control = form.elements.namedItem(fieldName);

  if (
    !(control instanceof HTMLInputElement) &&
    !(control instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  const fieldRoot = control.closest(".form-field");

  if (!fieldRoot) {
    return;
  }

  let errorEl = fieldRoot.querySelector<HTMLElement>(".form-field__error");

  if (!message) {
    errorEl?.remove();
    fieldRoot.classList.remove("form-field--error");
    control.removeAttribute("aria-invalid");

    return;
  }

  if (!errorEl) {
    errorEl = document.createElement("p");
    errorEl.className = "form-field__error";
    errorEl.setAttribute("role", "alert");
    fieldRoot.appendChild(errorEl);
  }

  errorEl.textContent = message;
  fieldRoot.classList.add("form-field--error");
  control.setAttribute("aria-invalid", "true");
}

/** Объект только с непустыми (после trim) строковыми значениями */
function collectFilledFields(values: ValuesBag): Record<string, string> {
  return Object.fromEntries(
    Object.entries(values).filter(([, v]) => String(v).trim() !== ""),
  );
}

function validateAllFormFields(
  form: HTMLFormElement,
  validators: Record<string, FieldValidator>,
): { ok: true; values: ValuesBag } | { ok: false; values: ValuesBag } {
  const names = Object.keys(validators);
  const values = readLiveValues(form, names);
  let hasError = false;

  for (const name of names) {
    const fn = validators[name];
    const raw = values[name] ?? "";
    const msg = fn(raw, values);

    setFieldErrorDom(form, name, msg);

    if (msg) hasError = true;
  }

  return hasError ? { ok: false, values } : { ok: true, values };
}

/** Валидация одного поля при уходе фокуса (focusout всплывает до корня Block). */
function runFieldValidatorOnFocusOut(
  event: Event,
  validators: Record<string, FieldValidator>,
): void {
  const target = event.target;

  if (
    !(target instanceof HTMLInputElement) &&
    !(target instanceof HTMLTextAreaElement)
  ) {
    return;
  }

  const name = target.name;

  if (!name || !validators[name]) return;

  const form = target.form;

  if (!form) return;

  const names = Object.keys(validators);
  const values = readLiveValues(form, names);
  const msg = validators[name](values[name] ?? "", values);

  setFieldErrorDom(form, name, msg);
}

/**
 * Обработчик submit: preventDefault, полная проверка, console.log заполненных полей, onValid.
 * Слушатель вешается на корень компонента (submit всплывает с &lt;form&gt;).
 */
function handleValidatedSubmit(
  event: Event,
  validators: Record<string, FieldValidator>,
  onValid?: (values: ValuesBag, filled: Record<string, string>) => void,
): void {
  const form = (event as SubmitEvent).target;

  if (!(form instanceof HTMLFormElement)) return;

  event.preventDefault();

  const result = validateAllFormFields(form, validators);

  if (!result.ok) return;

  const filled = collectFilledFields(result.values);

  console.log(filled);

  onValid?.(result.values, filled);
}

export { handleValidatedSubmit, runFieldValidatorOnFocusOut };
