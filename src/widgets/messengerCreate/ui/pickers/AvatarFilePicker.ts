import { Block, type BlockOwnProps } from "@/shared/ui/block";

import template from "./AvatarFilePicker.hbs?raw";

type AvatarFilePickerProps = BlockOwnProps;

/**
 * Круглая зона загрузки аватара с локальным превью (object URL).
 * Не вызывать setProps после mount — только пользовательский выбор файла.
 */
class AvatarFilePicker extends Block<AvatarFilePickerProps> {
  protected template = template;

  private avatarFile: File | null = null;

  private avatarPreviewObjectUrl: string | null = null;

  getFile(): File | null {
    return this.avatarFile;
  }

  protected componentWillUnmount(): void {
    this.revokeAvatarPreview();
  }

  private revokeAvatarPreview(): void {
    if (this.avatarPreviewObjectUrl) {
      URL.revokeObjectURL(this.avatarPreviewObjectUrl);
      this.avatarPreviewObjectUrl = null;
    }
  }

  private updatePreviewDom(): void {
    const placeholder = this.refs.avatarPlaceholder as HTMLElement | undefined;
    const img = this.refs.avatarPreviewImg as HTMLImageElement | undefined;

    if (!placeholder || !img) {
      return;
    }

    if (this.avatarFile && this.avatarPreviewObjectUrl) {
      img.src = this.avatarPreviewObjectUrl;
      img.hidden = false;
      placeholder.hidden = true;

      return;
    }

    img.removeAttribute("src");
    img.hidden = true;
    placeholder.hidden = false;
  }

  private readonly onChange = (event: Event): void => {
    const target = event.target;

    if (
      target === this.refs.avatarInput &&
      target instanceof HTMLInputElement
    ) {
      this.revokeAvatarPreview();
      this.avatarFile = target.files?.[0] ?? null;

      if (this.avatarFile) {
        this.avatarPreviewObjectUrl = URL.createObjectURL(this.avatarFile);
      }

      this.updatePreviewDom();
    }
  };

  private readonly onKeydown = (event: Event): void => {
    const e = event as KeyboardEvent;

    if (e.key !== "Enter" && e.key !== " ") {
      return;
    }

    const label = this.refs.avatarLabel;

    if (!(label instanceof HTMLElement) || !label.contains(e.target as Node)) {
      return;
    }

    e.preventDefault();
    (this.refs.avatarInput as HTMLInputElement | undefined)?.click();
  };

  protected events = {
    change: this.onChange,
    keydown: this.onKeydown,
  };
}

export { AvatarFilePicker };
