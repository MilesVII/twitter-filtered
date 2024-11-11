// @ts-ignore
const browser = browser ?? chrome;

type GenericObject = Record<string, any>;

export type WipeMode = "onspot" | "onrequest";
export type Storage = {
	whitelist: string[],
	prefs: {
		mode: WipeMode
		bleach: boolean
	}
};

type StorageKey = keyof Storage;
const defaults: Storage = {
	whitelist: [],
	prefs: {
		mode: "onrequest",
		bleach: true
	}
};

export async function save<T extends StorageKey>(key: T, value: Storage[T]) {
	const payload: GenericObject = {};
	payload[key] = value;
	await browser.storage.local.set(payload);
}
export async function load<T extends StorageKey>(key: T): Promise<Storage[T]>{
	const stored = await browser.storage.local.get(key);
	if (stored && stored[key])
		return stored[key] as Storage[T];
	else
		return defaults[key] as Storage[T];
}
