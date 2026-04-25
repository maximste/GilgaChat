import type { HelperOptions } from "handlebars";
import Handlebars from "handlebars";
/**
 * Регистрирует хелпер Handlebars с именем Component.componentName.
 *
 * Идея: шаблон родительского Block пишет {{Input id=... ref=...}} — при компиляции родителя
 * хелпер синхронно:
 * 1) создаёт экземпляр дочернего Block (new Component(hash));
 * 2) кладёт в data.root (это тот же объект, что передан в Handlebars.compile(...)(props))
 *    запись с методом embed: найти в уже сгенерированном HTML заглушку и заменить её на
 *    component.element();
 * 3) возвращает разметку заглушки (SafeString — не экранируется в {{...}}).
 *
 * Порядок во времени:
 * - Сначала Handlebars собирает строку HTML родителя; в ней остаются <div data-component-hbs-id="n">.
 * - После этого Block.compile() вызывает для каждого элемента __children embed(fragment):
 *   querySelector по data-attribute, replaceWith реального корня дочернего компонента.
 *
 * ref: если в hash передан непустой ref, досрочно вызывается component.element() и корень
 * сохраняется в root.__refs[refKey] (доступ родителя до embed). Пустой ref не используем —
 * иначе оператор "ref" in hash срабатывал бы и для undefined.
 */
/** Уникальный id в data-attribute у каждой заглушки в одном проходе шаблона */
let uniqueId = 0;

function registerComponent(Component: any) {
  Handlebars.registerHelper(
    Component.componentName,
    function (this: unknown, { hash, data }: HelperOptions) {
      const dataAttribute = `data-component-hbs-id="${++uniqueId}"`;
      const component = new Component(hash);
      const root = data.root as Record<string, unknown>;
      const refVal = hash.ref;

      if (refVal != null && refVal !== "") {
        const refKey = String(refVal);

        root.__refs = root.__refs ?? {};
        (root.__refs as Record<string, Element>)[refKey] = component.element()!;
      }
      // Один массив на весь проход compile родителя — все вложенные хелперы push в тот же root.
      root.__children = root.__children ?? [];
      (
        root.__children as Array<{
          component: unknown;
          embed(n: DocumentFragment): void;
        }>
      ).push({
        component,
        embed(node: DocumentFragment) {
          const placeholder = node.querySelector(`[${dataAttribute}]`);

          if (!placeholder) {
            throw new Error(
              `Can't find data-id for component ${Component.componentName}`,
            );
          }
          const el = component.element();

          if (el) {
            placeholder.replaceWith(el);
          }
        },
      });

      return new Handlebars.SafeString(`<div ${dataAttribute}></div>`);
    },
  );
}

export { registerComponent };
