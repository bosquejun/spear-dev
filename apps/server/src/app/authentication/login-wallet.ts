import { APIContext } from "../../api";

export default async function loginWallet(
	{ address }: { address: string },
	{ rpc }: APIContext
) {
	if (!address) {
		throw new Error("Address is required login.");
	}
	const nonce = crypto.randomUUID();

	const storage = rpc.storage.get("AuthStorage");

	await storage.put(address.toLowerCase(), { nonce });

	console.log(await storage.get(address.toLowerCase()));

	return { nonce };
}
