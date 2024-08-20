import AuthStorage from "./authModel";

export default async function initializeStorage() {
	const storageMap = new Map();
	const models = [AuthStorage];

	for (const Model of models) {
		const instance = new Model();
		await instance.ready();
		storageMap.set(instance.storageName(), instance);
	}

	return storageMap;
}
