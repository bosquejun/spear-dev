import SpearAccount from "./account";

type SpearCoreOptions = {
	version: "1.0";
};

export type SpearCoreConfigs = {
	hasPear: boolean;
	Pear: unknown | null;
	account: SpearAccount;
};

declare const Pear: unknown;

export default async function initializeSpearCore(options: SpearCoreOptions) {
	const hasPear = typeof Pear !== "undefined";
	const defaultConfigs: Partial<SpearCoreConfigs> = {
		hasPear,
		Pear: hasPear ? Pear : null,
	};

	const account = new SpearAccount(defaultConfigs);

	return {
		configs: defaultConfigs,
		account,
		options,
	};
}
