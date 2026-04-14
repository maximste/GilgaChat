import { ApiError } from "@/shared/lib/api";
import type { ApiUser } from "@/shared/lib/api/types";
import { escapeHtml } from "@/shared/lib/utils";
import { Block, type BlockOwnProps } from "@/shared/ui/block";
import { showErrorToast } from "@/shared/ui/toast";

import { normalizeUserSearchResponse } from "../../lib/normalizeUserSearchResponse";
import { userDisplayName } from "../../lib/userDisplayName";
import template from "./GroupMemberPicker.hbs?raw";

const DEBOUNCE_MS = 320;

type GroupMemberPickerProps = BlockOwnProps;

export type GroupMemberPickerServices = {
  searchUsersByLogin: (login: string) => Promise<unknown>;
  getProfileFromStore: () => ApiUser | null;
  onSelectionChange: () => void;
};

type ChipVm = { id: number; label: string };

type MemberRowVm = {
  id: number;
  displayName: string;
  login: string;
  picked: boolean;
};

/**
 * Поиск участников, чипы и список. Список обновляется императивным DOM (без setProps/replaceWith у вложенного Block).
 */
class GroupMemberPicker extends Block<GroupMemberPickerProps> {
  protected template = template;

  private readonly services: GroupMemberPickerServices;

  private readonly selected = new Map<number, ApiUser>();

  private lastMemberResults: ApiUser[] = [];

  private searchTimer: ReturnType<typeof setTimeout> | null = null;

  private listUi: {
    showMemberHintOnly: boolean;
    memberListHint: string;
  } = {
    showMemberHintOnly: true,
    memberListHint: "Type a login to search.",
  };

  private memberRows: MemberRowVm[] = [];

  private memberSearchEl: HTMLInputElement | null = null;

  constructor(services: GroupMemberPickerServices) {
    super({} as GroupMemberPickerProps);
    this.services = services;
  }

  protected componentDidMount(): void {
    const searchInput = this.refs.memberSearchInput as
      | HTMLInputElement
      | undefined;

    if (searchInput) {
      this.memberSearchEl = searchInput;
      searchInput.addEventListener("input", this.onMemberSearchInput);
    }

    this.pushResults({ memberRows: [] });
    this.updateMembersLabel();
  }

  protected componentWillUnmount(): void {
    if (this.searchTimer) {
      clearTimeout(this.searchTimer);
      this.searchTimer = null;
    }

    this.memberSearchEl?.removeEventListener("input", this.onMemberSearchInput);
    this.memberSearchEl = null;
  }

  getSelectedUserIds(): number[] {
    return [...this.selected.keys()];
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

  private updateMembersLabel(): void {
    const el = this.refs.membersLabel as HTMLElement | undefined;

    if (el) {
      el.textContent = `Add members (${this.selected.size})`;
    }
  }

  private renderChips(): void {
    const host = this.refs.chipsMount as HTMLElement | undefined;

    if (!host) {
      return;
    }

    host.replaceChildren();

    for (const c of this.buildChips()) {
      const span = document.createElement("span");

      span.className = "messenger-modal__chip";
      span.innerHTML = `${c.label}<button type="button" class="messenger-modal__chip-remove" data-chip-remove="${c.id}" aria-label="Remove">&times;</button>`;
      host.appendChild(span);
    }
  }

  private ensureListUl(): HTMLUListElement | null {
    const mount = this.refs.resultsMount as HTMLElement | undefined;

    if (!mount) {
      return null;
    }

    let ul = mount.querySelector<HTMLUListElement>(
      "ul.group-member-pick-results__ul",
    );

    if (!ul) {
      ul = document.createElement("ul");
      ul.className = "messenger-modal__user-list group-member-pick-results__ul";
      ul.setAttribute("role", "listbox");
      mount.appendChild(ul);
    }

    return ul;
  }

  /** Список без Handlebars/вложенного Block — гарантированно в DOM. */
  private syncResultsMountDom(): void {
    const ul = this.ensureListUl();

    if (!ul) {
      return;
    }

    ul.replaceChildren();

    if (this.listUi.showMemberHintOnly) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = this.listUi.memberListHint;
      ul.appendChild(li);

      return;
    }

    for (const row of this.memberRows) {
      const li = document.createElement("li");

      li.className = `messenger-modal__user-row${row.picked ? " messenger-modal__user-row--picked" : ""}`;
      li.dataset.memberId = String(row.id);
      li.innerHTML = `<span class="messenger-modal__user-dot messenger-modal__user-dot--gray" aria-hidden="true"></span><span class="messenger-modal__user-meta"><span class="messenger-modal__user-name">${row.displayName}</span><span class="messenger-modal__user-login">@${row.login}</span></span><span class="messenger-modal__check" aria-hidden="true">${row.picked ? "✓" : ""}</span>`;
      ul.appendChild(li);
    }

    if (this.memberRows.length === 0) {
      const li = document.createElement("li");

      li.className = "messenger-modal__hint";
      li.textContent = "No users.";
      ul.appendChild(li);
    }
  }

  private pushResults(
    patch: Partial<{
      showMemberHintOnly: boolean;
      memberListHint: string;
      memberRows: MemberRowVm[];
    }>,
  ): void {
    if (patch.showMemberHintOnly !== undefined) {
      this.listUi.showMemberHintOnly = patch.showMemberHintOnly;
    }

    if (patch.memberListHint !== undefined) {
      this.listUi.memberListHint = patch.memberListHint;
    }

    if (patch.memberRows !== undefined) {
      this.memberRows = patch.memberRows;
    }

    this.renderChips();
    this.syncResultsMountDom();
    this.updateMembersLabel();
    this.services.onSelectionChange();
  }

  private applyMemberSearchQuery(raw: string): void {
    const login = raw.trim();

    if (login.length < 1) {
      this.lastMemberResults = [];
      this.listUi = {
        showMemberHintOnly: true,
        memberListHint: "Type a login to search.",
      };
      this.pushResults({ memberRows: [] });

      return;
    }

    void this.services
      .searchUsersByLogin(login)
      .then((response) => {
        const users = normalizeUserSearchResponse(response);

        this.lastMemberResults = users;
        this.listUi = { showMemberHintOnly: false, memberListHint: "" };
        this.pushResults({
          memberRows: this.buildMemberRows(users),
        });
      })
      .catch((err: unknown) => {
        showErrorToast(err instanceof ApiError ? err.message : String(err));
      });
  }

  private readonly onMemberSearchInput = (): void => {
    const target = this.memberSearchEl;

    if (!target) {
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

    const removeChip = target.closest<HTMLButtonElement>("[data-chip-remove]");

    if (removeChip) {
      const id = Number(removeChip.dataset.chipRemove);

      this.selected.delete(id);
      this.pushResults({
        memberRows: this.buildMemberRows(this.lastMemberResults),
      });

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

      this.pushResults({
        memberRows: this.buildMemberRows(this.lastMemberResults),
      });
    }
  };

  protected events = {
    click: this.onRootClick,
  };
}

export { GroupMemberPicker };
