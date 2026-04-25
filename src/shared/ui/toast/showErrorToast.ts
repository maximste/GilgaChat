import { ErrorToast } from "./ErrorToast";

const STACK_ID = "gilga-toast-stack";

function getStack(): HTMLElement {
  let el = document.getElementById(STACK_ID);

  if (!el) {
    el = document.createElement("div");
    el.id = STACK_ID;
    el.className = "gilga-toast-stack";
    document.body.appendChild(el);
  }

  return el;
}

function showErrorToast(
  message: string,
  options?: {
    durationMs?: number;
  },
): void {
  const durationMs = options?.durationMs ?? 6000;
  const stack = getStack();
  const toast = new ErrorToast(
    { message },
    {
      durationMs,
      onRemoved: () => {
        if (stack.childElementCount === 0) {
          stack.remove();
        }
      },
    },
  );
  const el = toast.element();

  if (el) {
    stack.appendChild(el);
  }
}

export { showErrorToast };
