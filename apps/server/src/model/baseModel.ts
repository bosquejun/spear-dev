import Hyperbee from "hyperbee";
import Hypercore from "hypercore";
import path from "path";
import { JSONValue } from "../api";

export default abstract class BaseStorage {
	private readonly _storage: Hyperbee | null = null;
	private readonly _core: Hypercore;
	constructor(core?: Hypercore) {
		this._core =
			core ||
			new Hypercore(
				path.join(process.cwd(), ".spear", "storage", this.storageKey())
			);
		this._storage = new Hyperbee(this._core, {
			valueEncoding: "json",
			keyEncoding: "utf-8",
		});
	}

	abstract storageKey(): string;
	abstract storageName(): string;

	async ready() {
		await this._storage.ready();
	}

	get hyperbee() {
		return this._storage;
	}

	async get(key: string): Promise<JSONValue | null> {
		const data = await this._storage.get(key, { update: true });
		if (!data) return null;
		return data.value;
	}

	async put(key: string, value: JSONValue): Promise<void> {
		return this._storage.put(key, value);
	}

	async delete(key: string): Promise<void> {
		return this._storage.del(key);
	}
}
