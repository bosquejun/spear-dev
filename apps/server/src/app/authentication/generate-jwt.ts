import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import { APIContext } from "../../api";

const SECRET_KEY = "68HQF5NytaOpOkFaA7a63aprK1vfX52njfnIPAVdsFI=";

export default async function generateJwt(
	params: { address: string; signature: string; message: string },
	{ rpc }: APIContext
) {
	for (const requiredKey of ["address", "signature", "message"]) {
		if (!params[requiredKey]) {
			throw new Error(`${requiredKey} is required.`);
		}
	}

	const { address, message, signature } = params;

	const storage = rpc.storage.get("AuthStorage");

	const activeNonce = (await storage.get(address.toLowerCase())) as {
		nonce: string;
	};

	if (!activeNonce) {
		throw new Error("Address not yet logged in.");
	}

	if (!activeNonce?.nonce || !message.includes(activeNonce?.nonce)) {
		throw new Error("Invalid nonce.");
	}

	const signerAddress = ethers.verifyMessage(message, signature);

	if (signerAddress.toLowerCase() === address.toLowerCase()) {
		// The signature is valid
		// Remove the used nonce to prevent replay attacks
		await storage.delete(address.toLowerCase());

		const token = jwt.sign(
			{ address: signerAddress }, // Payload
			SECRET_KEY, // Secret key
			{ expiresIn: "1h" } // Token expiry (e.g., 1 hour)
		);

		return { address: signerAddress, token };
	} else {
		throw new Error("Invalid signature");
	}
}
