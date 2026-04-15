import { ConfirmDialog } from "./ConfirmDialog";

export type ShowConfirmDialogOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  container?: HTMLElement;
};

export function showConfirmDialog(
  options: ShowConfirmDialogOptions,
): Promise<boolean> {
  const {
    title,
    message,
    confirmLabel = "Подтвердить",
    cancelLabel = "Отмена",
    isDanger = false,
    container = document.body,
  } = options;

  const titleId = `confirm-dialog-title-${Math.random().toString(36).slice(2, 11)}`;

  return new Promise((resolve) => {
    const dialog = new ConfirmDialog(
      {
        title,
        message,
        confirmLabel,
        cancelLabel,
        isDanger,
        titleId,
      },
      {
        onResult: (confirmed) => {
          resolve(confirmed);
        },
      },
    );

    const el = dialog.element();

    if (el) {
      container.appendChild(el);
    }
  });
}
