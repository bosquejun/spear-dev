import BaseStorage from "./baseModel";

export default class AuthStorage extends BaseStorage {
	storageKey(): string {
		return "auth-storage";
	}
	storageName(): string {
		return "AuthStorage";
	}
}
