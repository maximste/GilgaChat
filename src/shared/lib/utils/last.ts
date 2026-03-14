function last<T>(list: T[]): T | undefined {
  return Array.isArray(list) ? list.pop() : undefined;
}

export { last };
