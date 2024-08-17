import Corestore from "corestore";
import { SpearCoreConfigs } from "..";
import { generateMnemonicFromKey } from "../utils/keys";

export default class SpearAccount {
	private _store: Corestore;
	constructor(
		private readonly _configs: Partial<Omit<SpearCoreConfigs, "account">>
	) {
		this._store = new Corestore(
			_configs.hasPear ? Pear.configs.storage : ""
		);
	}

	get store() {
		return this._store;
	}

	public async createAccount() {
		const keyPair = await this._store.createKeyPair(crypto.randomUUID());
		const mnemonic = generateMnemonicFromKey(keyPair.publicKey);

		return {
			mnemonic,
			publicKey: keyPair.publicKey,
		};
	}
}
