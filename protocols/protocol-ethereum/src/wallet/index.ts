/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as bip39 from "bip39";
import { HDNodeWallet, JsonRpcProvider, Wallet } from "ethers";
// @ts-ignore
import Hypercore from "hypercore";
// @ts-ignore
import Hyperbee from "hyperbee";

export class SpearETHWallet {
	private _wallet: HDNodeWallet | null = null;

	private _loaded: boolean = false;
	private _encryptedJson: string | null = null;
	private _storage: Hyperbee | null = null;
	constructor(
		private readonly _core: Hypercore,
		private _seedPhrase: string | null = null,
		readonly provider: JsonRpcProvider | null = null
	) {
		this._storage = new Hyperbee(this._core, {
			valueEncoding: "json",
		});
	}

	static async fromPhrase(
		phrase: string,
		core: Hypercore,
		password?: string,
		provider?: JsonRpcProvider
	) {
		const wallet = new SpearETHWallet(core, phrase, provider);
		const hdWallet = Wallet.fromPhrase(phrase);

		await wallet.loadWallet(hdWallet, password);

		return wallet;
	}

	static async create(
		core: Hypercore,
		deriveFromCore?: boolean,
		provider?: JsonRpcProvider
	): Promise<SpearETHWallet> {
		let seedPhrase;
		if (deriveFromCore) {
			await core.ready();
			seedPhrase = bip39.entropyToMnemonic(core.keyPair.publicKey);
		} else {
			seedPhrase = bip39.generateMnemonic();
		}

		return new SpearETHWallet(core, seedPhrase, provider);
	}

	static async loadWalletsFromCore(
		core: Hypercore,
		password?: string,
		provider?: JsonRpcProvider
	) {
		const wallets = [];

		const storage = new Hyperbee(core, {
			valueEncoding: "json",
		});

		await storage.ready();
		for await (const record of storage.createReadStream()) {
			const { value } = record;
			const hdWallet = await Wallet.fromEncryptedJson(
				JSON.stringify(value),
				password || core.key.toString("hex")
			);
			const wallet = new SpearETHWallet(core, null, provider);

			await wallet.loadWallet(hdWallet as HDNodeWallet);
			wallets.push(wallet);
		}
		return wallets;
	}

	get seedPhrase() {
		// fetching seed phrase only allowed if not yet on loaded
		return this._loaded ? null : this._seedPhrase;
	}

	get encryptedJson() {
		return this._loaded ? this._encryptedJson : null;
	}

	private async _load(password?: string) {
		if (!this._wallet) {
			throw new Error("Wallet is not defined.");
		}
		password = password || this._core.key.toString("hex");

		// encrypt wallet with password
		this._encryptedJson = await this._wallet.encrypt(password!);

		const address = await this._wallet.getAddress();

		await this._storage.ready();

		const storedWallet = await this._storage.get(address);

		if (!storedWallet) {
			await this._storage.put(address, JSON.parse(this.encryptedJson!));
		}

		// clear seed-phrase
		this._seedPhrase = null;

		// update loaded flag
		this._loaded = true;
	}

	public async loadWallet(wallet: HDNodeWallet, password?: string) {
		this._wallet = wallet;

		await this._load(password);
	}

	public async verifyAndLoad(
		verifier: (seedPhrase: string) => boolean,
		password?: string
	) {
		// apply verification;
		if (this._seedPhrase && !verifier(this._seedPhrase)) {
			throw new Error("Seed phrase verification failed.");
		}

		// instantiate HDWallet from phrase
		this._wallet = Wallet.fromPhrase(this._seedPhrase as string);

		await this._load(password);
	}

	public async getAddress(): Promise<string | null | undefined> {
		return this._loaded ? await this._wallet?.getAddress() : null;
	}

	public async getBalance(): Promise<bigint> {
		if (!this.provider) {
			throw new Error("Provider is not provided");
		}
		return this.provider?.getBalance((await this.getAddress()) as string);
	}
}
