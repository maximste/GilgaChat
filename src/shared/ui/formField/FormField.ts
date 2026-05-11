import type { InputProps, LabelProps } from "@/shared/lib/types";

import { Block, type BlockOwnProps } from "../block/Block";
import template from "./FormField.hbs?raw";

import "./FormField.scss";

interface FormFieldProps {
  input: InputProps;
  label: LabelProps;
  className?: string;
  /** Font Awesome icon classes, e.g. "fa-solid fa-envelope" */
  icon?: string;
}

type FormFieldBlockProps = FormFieldProps & BlockOwnProps;

function withIconInputClass(props: FormFieldProps): FormFieldProps {
  const input = props.icon
    ? {
        ...props.input,
        className: [props.input.className, "form-field__input--with-icon"]
          .filter(Boolean)
          .join(" "),
      }
    : props.input;

  return { ...props, input };
}

class FormField extends Block<FormFieldBlockProps> {
  static componentName = "FormField";

  protected template = template;

  constructor(props: FormFieldBlockProps) {
    super(withIconInputClass(props) as FormFieldBlockProps);
  }
}
export { FormField };
export { type FormFieldProps };
