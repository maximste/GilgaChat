function trim(str: string, chars?: string): string {
  if (chars === undefined) {
    return str.trim();
  }

  const toTrim = new Set(chars);
  let start = 0;
  let end = str.length;

  while (start < end && toTrim.has(str[start]!)) {
    start += 1;
  }
  while (end > start && toTrim.has(str[end - 1]!)) {
    end -= 1;
  }

  return str.slice(start, end);
}

export { trim };
