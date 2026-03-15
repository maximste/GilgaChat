import { RegisterForm } from "@/features/registration";

export interface RegisterPageProps {
  title?: string;
  subtitle?: string;
}

export function renderRegisterPage(
  container: HTMLElement,
  props: RegisterPageProps = {},
): void {
  const form = new RegisterForm(container, {
    title: props.title ?? "Create Account",
    subtitle: props.subtitle ?? "Sign up to get started",
  });

  form.render();
}
