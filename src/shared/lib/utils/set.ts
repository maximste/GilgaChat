import type { Indexed } from "../types";
import { isPlainObject, merge } from "./merge";

function set(
  object: Indexed | unknown,
  path: string,
  value: unknown,
): Indexed | unknown {
  if (typeof path !== "string") {
    throw new Error("path must be string");
  }

  if (!isPlainObject(object)) {
    return object;
  }

  const keys = path.split(".").filter((segment) => segment.length > 0);

  if (keys.length === 0) {
    return object;
  }

  const patch = keys.reduceRight<unknown>(
    (acc, key) => ({ [key]: acc }),
    value,
  ) as Indexed;
  const merged = merge(object, patch);

  Object.assign(object, merged);

  return object;
}

export { set };
