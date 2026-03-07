type InputType =
  | "text" | "password" | "email" | "number" | "tel" | "url" | "search"
  | "checkbox" | "radio" | "range" | "color" 
  | "date" | "time" | "datetime-local" | "month" | "week"
  | "file" | "submit" | "reset" | "button" | "hidden" | "image";

interface InputProps {
  id: string;
  type: InputType;
  name: string;
  required?: boolean;
  className?: string;
};

export type { InputProps, InputType };
