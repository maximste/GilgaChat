function first<T>(list: T[]): T | undefined {
	return Array.isArray(list) ? list[0] : undefined
}

export { first };
