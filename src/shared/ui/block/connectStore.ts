import { store } from "@/shared/lib/store";
import type { Indexed } from "@/shared/lib/types";
import { isEqual } from "@/shared/lib/utils";

import { Block, type BlockOwnProps } from "./Block";

/** Класс блока: пропсы опциональны (роутер вызывает `new Page()` без аргументов). */
type BlockConstructor<Props extends BlockOwnProps> = new (
  props?: Props,
) => Block<Props>;

/**
 * Срез стора для `mapStateToProps`: обычный объект без индексной сигнатуры `Record<string, unknown>`,
 * иначе TS не считает `Slice` совместимым с `Partial<Props>` при `setProps`.
 */
type StoreSlice = object;

/**
 * Функция «взять из полного состояния стора только нужные поля».
 * `Slice` — тип этого урезанного объекта.
 */
type MapStateToProps<Slice extends StoreSlice> = (fullState: Indexed) => Slice;

/**
 * Сторонние поля пропсов перекрывают срез из стора.
 * Приведение к `Props` одно: результат spread TS не сужает до `Props`.
 */
function mergeSliceWithOwnProps<
  Slice extends StoreSlice,
  Props extends BlockOwnProps & Slice,
>(fromStore: Slice, ownProps: Props): Props {
  return { ...fromStore, ...ownProps } as Props;
}

/**
 * Подключает `Block` к глобальному store (мост Flux: представление ↔ стор).
 * Начальные пропсы дополняются из `mapStateToProps`, при изменении стора вызывается
 * `setProps` только если срез по содержимому изменился (`isEqual`). В `destroy` подписка снимается.
 */
export function connect<Slice extends StoreSlice>(
  mapStateToProps: MapStateToProps<Slice>,
) {
  return function connectComponent<Props extends BlockOwnProps & Slice>(
    ComponentClass: BlockConstructor<Props>,
  ): BlockConstructor<Props> {
    // TS видит базу как абстрактный Block без `template`; реально наследуем конкретный класс.
    // @ts-expect-error TS2515
    class ConnectedBlock extends ComponentClass {
      private storeUnsubscribe: (() => void) | null = null;

      private lastSlice: Slice;

      constructor(props?: Props) {
        const ownProps = (props ?? {}) as Props;
        const fromStore = mapStateToProps(store.getState());

        super(mergeSliceWithOwnProps(fromStore, ownProps));
        this.lastSlice = fromStore;
        this.storeUnsubscribe = store.subscribe(() => {
          const next = mapStateToProps(store.getState());

          if (isEqual(next, this.lastSlice)) {
            return;
          }
          this.lastSlice = next;
          this.setProps(next);
        });
      }

      destroy(): void {
        this.storeUnsubscribe?.();
        this.storeUnsubscribe = null;
        super.destroy();
      }
    }

    return ConnectedBlock;
  };
}
