function isEqual(a: object, b: object): boolean {
  return deepEqual(a, b);
}

function deepEqual(x: unknown, y: unknown): boolean {
  if (Object.is(x, y)) {
    return true;
  }

  if (
    typeof x !== "object" ||
    x === null ||
    typeof y !== "object" ||
    y === null
  ) {
    return false;
  }

  if (x instanceof Date && y instanceof Date) {
    return x.getTime() === y.getTime();
  }

  if (x instanceof RegExp && y instanceof RegExp) {
    return x.source === y.source && x.flags === y.flags;
  }

  if (Array.isArray(x) && Array.isArray(y)) {
    if (x.length !== y.length) {
      return false;
    }
    for (let i = 0; i < x.length; i += 1) {
      if (!deepEqual(x[i], y[i])) {
        return false;
      }
    }

    return true;
  }

  if (Array.isArray(x) !== Array.isArray(y)) {
    return false;
  }

  const keysX = Object.keys(x);
  const keysY = Object.keys(y);

  if (keysX.length !== keysY.length) {
    return false;
  }

  for (const key of keysX) {
    if (!Object.prototype.hasOwnProperty.call(y, key)) {
      return false;
    }
    if (
      !deepEqual(
        (x as Record<string, unknown>)[key],
        (y as Record<string, unknown>)[key],
      )
    ) {
      return false;
    }
  }

  return true;
}

export { isEqual };
