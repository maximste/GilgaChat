import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import type { MessengerModalShell } from "../MessengerModalShell";
import { AvatarFilePicker } from "../pickers/AvatarFilePicker";
import { GroupMemberPicker } from "../pickers/GroupMemberPicker";
import template from "./CreateGroupForm.hbs?raw";

type CreateGroupFormProps = BlockOwnProps;

export type CreateGroupFormServices = {
  createGroupWithMembers: (options: {
    title: string;
    userIds: number[];
    avatarFile?: File;
  }) => Promise<number>;
  searchUsersByLogin: (login: string) => Promise<ApiUser[]>;
  getProfileFromStore: () => ApiUser | null;
  onDone: (chatId: number) => void;
  /** Закрыть модалку и освободить DOM (destroy формы и shell). */
  closeModal: () => void;
};

class CreateGroupForm extends Block<CreateGroupFormProps> {
  protected template = template;

  private readonly services: CreateGroupFormServices;

  private readonly shell: MessengerModalShell;

  private avatar?: AvatarFilePicker;

  private picker?: GroupMemberPicker;

  private groupNameDraft = "";

  constructor(services: CreateGroupFormServices, shell: MessengerModalShell) {
    super({} as CreateGroupFormProps);
    this.services = services;
    this.shell = shell;
  }

  protected componentDidMount(): void {
    const avatarHost = this.refs.avatarMount as HTMLElement | undefined;
    const pickerHost = this.refs.pickerMount as HTMLElement | undefined;

    if (avatarHost) {
      this.avatar = new AvatarFilePicker();
      avatarHost.appendChild(this.avatar.element()!);
    }

    if (pickerHost) {
      this.picker = new GroupMemberPicker({
        searchUsersByLogin: this.services.searchUsersByLogin,
        getProfileFromStore: this.services.getProfileFromStore,
        onSelectionChange: () => this.syncSubmitButton(),
      });
      pickerHost.appendChild(this.picker.element()!);
    }

    (this.refs.nameInput as HTMLInputElement | undefined)?.focus();
    this.syncSubmitButton();
  }

  protected componentWillUnmount(): void {
    this.avatar?.destroy();
    this.avatar = undefined;
    this.picker?.destroy();
    this.picker = undefined;
  }

  private isSubmitEnabled(): boolean {
    return (
      this.groupNameDraft.trim().length > 0 &&
      (this.picker?.getSelectedUserIds().length ?? 0) > 0
    );
  }

  private syncSubmitButton(): void {
    this.shell.setSubmitDisabled(!this.isSubmitEnabled());
  }

  async submit(): Promise<void> {
    const title = this.groupNameDraft.trim();
    const userIds = this.picker?.getSelectedUserIds() ?? [];

    if (!title || userIds.length === 0) {
      return;
    }

    this.shell.setSubmitDisabled(true);

    try {
      const chatId = await this.services.createGroupWithMembers({
        title,
        userIds,
        avatarFile: this.avatar?.getFile() ?? undefined,
      });

      this.services.onDone(chatId);
      this.services.closeModal();
    } catch (e) {
      this.syncSubmitButton();
      window.alert(e instanceof ApiError ? e.message : String(e));
    }
  }

  private readonly onRootInput = (event: Event): void => {
    const target = event.target;

    if (target === this.refs.nameInput && target instanceof HTMLInputElement) {
      this.groupNameDraft = target.value;
      this.syncSubmitButton();
    }
  };

  protected events = {
    input: this.onRootInput,
  };
}

export { CreateGroupForm };
