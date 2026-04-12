import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { escapeHtml } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";

import { userDisplayName } from "../lib/userDisplayName";
import template from "./CreateDmModal.hbs?raw";

import "./MessengerModal.scss";

const DEBOUNCE_MS = 320;

type UserRowVm = {
  id: number;
  displayName: string;
  login: string;
  active: boolean;
};

type CreateDmModalBlockProps = {
  listHint: string;
  showHintOnly: boolean;
  users: UserRowVm[];
  submitDisabled: boolean;
} & BlockOwnProps;

export type CreateDmModalServices = {
  searchUsersByLogin: (login: string) => Promise<ApiUser[]>;
  openDmWithUser: (user: ApiUser) => Promise<number>;
  onDone: (chatId: number) => void;
};

class CreateDmModal extends Block<CreateDmModalBlockProps> {
  static componentName = "CreateDmModal";

  protected template = template;

  private readonly services: CreateDmModalServices;

  private selectedUser: ApiUser | null = null;

  private lastResults: ApiUser[] = [];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly onDocumentKeydown = (e: KeyboardEvent): void => {
    if (e.key === "Escape") {
      this.closeAndRemove();
    }
  };

  constructor(services: CreateDmModalServices) {
    super({
      listHint: "Type a login to search (API /user/search).",
      showHintOnly: true,
      users: [],
      submitDisabled: true,
    } as CreateDmModalBlockProps);

    this.services = services;
  }

  protected componentDidMount(): void {
    document.addEventListener("keydown", this.onDocumentKeydown);
    (this.refs.searchInput as HTMLInputElement | undefined)?.focus();
  }

  protected componentWillUnmount(): void {
    document.removeEventListener("keydown", this.onDocumentKeydown);
  }

  private mapUserRows(users: ApiUser[]): UserRowVm[] {
    return users.map((u) => ({
      id: u.id,
      displayName: escapeHtml(userDisplayName(u)),
      login: escapeHtml(u.login),
      active: this.selectedUser?.id === u.id,
    }));
  }

  private applyListFromSearch(login: string, apiUsers: ApiUser[]): void {
    const trimmed = login.trim();

    if (trimmed.length < 1) {
      this.lastResults = [];
      this.setProps({
        showHintOnly: true,
        listHint: "Type a login to search (API /user/search).",
        users: [],
      });

      return;
    }

    this.lastResults = apiUsers;
    this.setProps({
      showHintOnly: false,
      users: this.mapUserRows(apiUsers),
    });
  }

  private readonly onRootInput = (event: Event): void => {
    const target = event.target;

    if (
      !(target instanceof HTMLInputElement) ||
      target !== this.refs.searchInput
    ) {
      return;
    }

    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
    }

    const value = target.value;

    this.searchTimer = setTimeout(() => {
      const login = value.trim();

      if (login.length < 1) {
        this.applyListFromSearch("", []);

        return;
      }

      void this.services
        .searchUsersByLogin(login)
        .then((users) => {
          this.applyListFromSearch(login, users);
        })
        .catch((err: unknown) => {
          window.alert(err instanceof ApiError ? err.message : String(err));
        });
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

    if (target.closest("[data-act=submit]")) {
      void this.submit();

      return;
    }

    const row = target.closest<HTMLElement>("[data-user-id]");

    if (row && root.contains(row)) {
      const id = Number(row.dataset.userId);
      const user = this.lastResults.find((u) => u.id === id);

      if (!user) {
        return;
      }

      this.selectedUser = user;
      this.setProps({
        users: this.mapUserRows(this.lastResults),
        submitDisabled: false,
      });
    }
  };

  private async submit(): Promise<void> {
    if (!this.selectedUser) {
      return;
    }

    const submitBtn =
      this.element()?.querySelector<HTMLButtonElement>("[data-act=submit]");

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      const chatId = await this.services.openDmWithUser(this.selectedUser);

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
    click: this.onRootClick,
    input: this.onRootInput,
  };
}

export { CreateDmModal };
