import type { Indexed } from "../types";
import { isPlainObject } from "./merge";

function cloneDeepValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (value instanceof RegExp) {
    return new RegExp(value.source, value.flags);
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneDeepValue(item));
  }

  if (isPlainObject(value)) {
    const out: Indexed = {};

    for (const key of Object.keys(value)) {
      out[key] = cloneDeepValue((value as Indexed)[key]);
    }

    return out;
  }

  return value;
}

function cloneDeep<T extends object = object>(obj: T): T {
  return cloneDeepValue(obj) as T;
}

export { cloneDeep };
