import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { escapeHtml } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import { userDisplayName } from "../lib/userDisplayName";
import template from "./CreateGroupModal.hbs?raw";

import "./MessengerModal.scss";

const DEBOUNCE_MS = 320;

type ChipVm = { id: number; label: string };

type MemberRowVm = {
  id: number;
  displayName: string;
  login: string;
  picked: boolean;
};

type CreateGroupModalBlockProps = {
  chips: ChipVm[];
  membersLabelText: string;
  showMemberHintOnly: boolean;
  memberListHint: string;
  memberRows: MemberRowVm[];
  submitDisabled: boolean;
} & BlockOwnProps;

export type CreateGroupModalServices = {
  searchUsersByLogin: (login: string) => Promise<ApiUser[]>;
  createGroupWithMembers: (options: {
    title: string;
    userIds: number[];
    avatarFile?: File;
  }) => Promise<number>;
  getProfileFromStore: () => ApiUser | null;
  onDone: (chatId: number) => void;
};

class CreateGroupModal extends Block<CreateGroupModalBlockProps> {
  static componentName = "CreateGroupModal";

  protected template = template;

  private readonly services: CreateGroupModalServices;

  private readonly selected = new Map<number, ApiUser>();

  private lastMemberResults: ApiUser[] = [];

  private avatarFile: File | null = null;

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly onDocumentKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.closeAndRemove();
    }
  };

  constructor(services: CreateGroupModalServices) {
    super({
      chips: [],
      membersLabelText: "Add members (0)",
      showMemberHintOnly: true,
      memberListHint: "Type a login to search.",
      memberRows: [],
      submitDisabled: true,
    } as CreateGroupModalBlockProps);

    this.services = services;
  }

  protected componentDidMount(): void {
    document.addEventListener("keydown", this.onDocumentKeydown);
    (this.refs.nameInput as HTMLInputElement | undefined)?.focus();
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onDocumentKeydown);
  }

  private selfId(): number | null {
    return this.services.getProfileFromStore()?.id ?? null;
  }

  private buildChips(): ChipVm[] {
    return [...this.selected.values()].map((u) => ({
      id: u.id,
      label: escapeHtml(userDisplayName(u)),
    }));
  }

  private buildMemberRows(users: ApiUser[]): MemberRowVm[] {
    const self = this.selfId();
    const rows: MemberRowVm[] = [];

    for (const u of users) {
      if (self !== null && u.id === self) {
        continue;
      }

      rows.push({
        id: u.id,
        displayName: escapeHtml(userDisplayName(u)),
        login: escapeHtml(u.login),
        picked: this.selected.has(u.id),
      });
    }

    return rows;
  }

  private refreshMemberBlock(
    patch: Partial<
      Pick<
        CreateGroupModalBlockProps,
        "showMemberHintOnly" | "memberListHint" | "memberRows"
      >
    >,
  ): void {
    this.setProps({
      chips: this.buildChips(),
      membersLabelText: `Add members (${this.selected.size})`,
      ...patch,
    });
  }

  private syncSubmit(): void {
    const nameEl = this.refs.nameInput as HTMLInputElement | undefined;
    const nameOk = Boolean(nameEl?.value.trim());
    const ok = nameOk && this.selected.size > 0;

    this.setProps({ submitDisabled: !ok });
  }

  private applyMemberSearchQuery(raw: string): void {
    const login = raw.trim();

    if (login.length < 1) {
      this.lastMemberResults = [];
      this.refreshMemberBlock({
        showMemberHintOnly: true,
        memberListHint: "Type a login to search.",
        memberRows: [],
      });

      return;
    }

    void this.services
      .searchUsersByLogin(login)
      .then((users) => {
        this.lastMemberResults = users;
        this.refreshMemberBlock({
          showMemberHintOnly: false,
          memberRows: this.buildMemberRows(users),
        });
      })
      .catch((err: unknown) => {
        window.alert(err instanceof ApiError ? err.message : String(err));
      });
  }

  private readonly onRootChange = (event: Event): void => {
    const target = event.target;

    if (
      target === this.refs.avatarInput &&
      target instanceof HTMLInputElement
    ) {
      this.avatarFile = target.files?.[0] ?? null;
    }
  };

  private readonly onRootKeydown = (event: Event): void => {
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

  private readonly onRootInput = (event: Event): void => {
    const target = event.target;

    if (target === this.refs.nameInput) {
      this.syncSubmit();

      return;
    }

    if (target !== this.refs.memberSearchInput) {
      return;
    }

    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const value = target.value;

    this.searchTimer = setTimeout(() => {
      this.applyMemberSearchQuery(value);
    }, DEBOUNCE_MS);
  };

  private readonly onRootClick = (event: Event): void => {
    const root = event.currentTarget as HTMLElement;
    const target = event.target as HTMLElement;

    if (target === this.refs.backdrop) {
      this.closeAndRemove();

      return;
    }

    if (
      target.closest(".messenger-modal__close") ||
      target.closest("[data-act=cancel]")
    ) {
      this.closeAndRemove();

      return;
    }

    const removeChip = target.closest<HTMLButtonElement>("[data-chip-remove]");

    if (removeChip) {
      const id = Number(removeChip.dataset.chipRemove);

      this.selected.delete(id);
      this.refreshMemberBlock({
        showMemberHintOnly: this.props.showMemberHintOnly,
        memberListHint: this.props.memberListHint,
        memberRows: this.buildMemberRows(this.lastMemberResults),
      });
      this.syncSubmit();

      return;
    }

    if (target.closest("[data-act=submit]")) {
      void this.submit();

      return;
    }

    const row = target.closest<HTMLElement>("[data-member-id]");

    if (row && root.contains(row)) {
      const id = Number(row.dataset.memberId);
      const user = this.lastMemberResults.find((u) => u.id === id);

      if (!user) {
        return;
      }

      if (this.selected.has(id)) {
        this.selected.delete(id);
      } else {
        this.selected.set(id, user);
      }

      this.refreshMemberBlock({
        showMemberHintOnly: this.props.showMemberHintOnly,
        memberListHint: this.props.memberListHint,
        memberRows: this.buildMemberRows(this.lastMemberResults),
      });
      this.syncSubmit();
    }
  };

  private async submit(): Promise<void> {
    const nameInput = this.refs.nameInput as HTMLInputElement;
    const title = nameInput.value.trim();

    if (!title || this.selected.size === 0) {
      return;
    }

    const submitBtn =
      this.element()?.querySelector<HTMLButtonElement>("[data-act=submit]");

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      const chatId = await this.services.createGroupWithMembers({
        title,
        userIds: [...this.selected.keys()],
        avatarFile: this.avatarFile ?? undefined,
      });

      this.closeAndRemove();
      this.services.onDone(chatId);
    } catch (e) {
      if (submitBtn) {
        submitBtn.disabled = false;
      }

      window.alert(e instanceof ApiError ? e.message : String(e));
    }
  }

  closeAndRemove(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.element()?.remove();
    this.destroy();
  }

  mount(parent: HTMLElement): void {
    parent.appendChild(this.element()!);
  }

  protected events = {
    change: this.onRootChange,
    click: this.onRootClick,
    input: this.onRootInput,
    keydown: this.onRootKeydown,
  };
}

export { CreateGroupModal };
