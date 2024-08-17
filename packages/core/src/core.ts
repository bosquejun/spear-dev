import SpearAccount from "./account";

type SpearCoreOptions = {
	version: "1.0";
};

export default class SpearCore {
	private _account: SpearAccount;
	constructor(readonly options: SpearCoreOptions) {}

	get Account(): SpearAccount {
		return this._account;
	}
}
