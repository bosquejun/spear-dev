import RPC from "@hyperswarm/rpc";
import crypto from "crypto";
import Hyperbee from "hyperbee";
import Hypercore from "hypercore";
import DHT from "hyperdht";

(async () => {
	const hcore = new Hypercore("./.spear/rpc-client");
	const hbee = new Hyperbee(hcore, {
		keyEncoding: "utf-8",
		valueEncoding: "binary",
	});
	await hbee.ready();

	// resolved distributed hash table seed for key pair
	let dhtSeed = (await hbee.get("dht-seed"))?.value;
	if (!dhtSeed) {
		// not found, generate and store in db
		dhtSeed = crypto.randomBytes(32);
		await hbee.put("dht-seed", dhtSeed);
	}

	// start distributed hash table, it is used for rpc service discovery
	const dht = new DHT({
		port: 50001,
		keyPair: DHT.keyPair(dhtSeed),
		bootstrap: [{ host: "127.0.0.1", port: 30001 }], // note boostrap points to dht that is started via cli
	});

	const rpc = new RPC({
		dht,
	});

	const [method, pubKey, ...args] = process.argv.slice(2);

	if (!pubKey) {
		throw new Error("Invalid public key");
	}

	const client = rpc.connect(Buffer.from(pubKey, "hex"));

	if (method === "login") {
		const response = await client.request(
			"login",
			Buffer.from(
				JSON.stringify({
					version: "v1",
					data: { address: args[0] },
				})
			)
		);

		console.log(JSON.parse(response.toString()));
	} else if (method === "generateJwt") {
		const [address, signature, message] = args;
		const response = await client.request(
			"generateJwt",
			Buffer.from(
				JSON.stringify({
					version: "v1",
					data: { address, signature, message },
				})
			)
		);

		console.log(JSON.parse(response.toString()));
	} else {
		throw new Error("Invalid method");
	}
})();
