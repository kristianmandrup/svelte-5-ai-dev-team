export const list = (n: number) => Array(n).fill(undefined);

export const getRandom = (items: string[]): string =>
	items[Math.floor(Math.random() * items.length)];
