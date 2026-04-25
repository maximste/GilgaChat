/** @jest-environment jsdom */

import type { BlockOwnProps } from "@/shared/ui/block";

import { Button, type ButtonProps } from "./Button";

type ButtonTestProps = ButtonProps & BlockOwnProps;

class ButtonWithInlineTemplate extends Button {
  protected template =
    '<button class="button" type="{{type}}"><span class="button__label">{{text}}</span></button>';
}

it("Button рендерит тип и текст из пропсов в DOM", () => {
  const button = new ButtonWithInlineTemplate({
    type: "submit",
    text: "Отправить",
  } as ButtonTestProps);
  const el = button.element();

  expect(el?.getAttribute("type")).toBe("submit");
  expect(el?.textContent).toContain("Отправить");
});
