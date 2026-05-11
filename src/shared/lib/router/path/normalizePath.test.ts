import { normalizeAppPath } from "./normalizePath";

it("нормализует пустую строку и корень в /", () => {
  expect(normalizeAppPath("")).toBe("/");
  expect(normalizeAppPath("/")).toBe("/");
  expect(normalizeAppPath("  ")).toBe("/");
});

it("приводит к нижнему регистру и добавляет ведущий слэш", () => {
  expect(normalizeAppPath("/Messenger")).toBe("/messenger");
  expect(normalizeAppPath("Profile")).toBe("/profile");
});

it("не дублирует ведущий слэш", () => {
  expect(normalizeAppPath("/about")).toBe("/about");
});
