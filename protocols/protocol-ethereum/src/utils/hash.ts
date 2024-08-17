import { BinaryToTextEncoding, createHash } from "crypto";
import { BytesLike } from "ethers";

export const hashSecretKey = (
	secretKey: BytesLike,
	encoding: BinaryToTextEncoding = "hex"
) => {
	// Hash the 64-byte secret key to derive a 32-byte Ethereum-compatible private key
	const hash = createHash("sha256");
	hash.update(secretKey);
	return hash.digest(encoding); // 32-byte private key in hex format
};
