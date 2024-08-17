import { fromHex } from "./encoding";
import bip39 from "bip39";

export function generateMnemonicFromKey(key: Buffer | string) {
	const _key = (typeof key === "string" ? fromHex(key) : key) as Buffer;
	const mnemonic = bip39.entropyToMnemonic(_key);
	return mnemonic;
}

export async function mnemonicToSeed(mnemonic: string) {
	return bip39.mnemonicToSeedSync(mnemonic);
}
