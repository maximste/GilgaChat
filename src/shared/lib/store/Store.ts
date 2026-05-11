import type { Indexed } from "../types";
import { isEqual, merge, set } from "../utils";

type Listener = () => void;

/**
 * Глобальное иммутабельное состояние: обновление через merge + set по path,
 * подписчики уведомляются после каждого реального изменения данных.
 */
class Store {
  private state: Indexed = {};

  private readonly listeners = new Set<Listener>();

  getState(): Indexed {
    return this.state;
  }

  setState(path: string, value: unknown): void {
    const patchHolder: Indexed = {};

    set(patchHolder, path, value);
    const nextState = merge(this.state, patchHolder);

    if (isEqual(this.state, nextState)) {
      return;
    }
    this.state = nextState;
    this.emit();
  }

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
const store = new Store();

export { Store, store };
