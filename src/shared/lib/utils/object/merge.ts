/**
 * Deep-merge plain objects: keys from both sides are kept.
 *
 * Steps (same at every depth):
 * 1. Start from a shallow copy of `lhs` so keys that exist only on the left stay (e.g. `d: 5`).
 * 2. Walk each key of `rhs`.
 * 3. If both sides have a plain object at that key — merge them recursively (nested keys combine).
 * 4. Otherwise — take the value from `rhs` (primitives, arrays, null, etc. replace the left side).
 */

import type { Indexed } from "../../types";

export function isPlainObject(value: unknown): value is Indexed {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  const result: Indexed = { ...lhs };

  for (const key of Object.keys(rhs)) {
    const left = result[key];
    const right = rhs[key];

    if (isPlainObject(left) && isPlainObject(right)) {
      result[key] = merge(left, right);
    } else {
      result[key] = right;
    }
  }

  return result;
}

export { merge };
