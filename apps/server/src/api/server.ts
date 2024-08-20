import Hypercore from "hypercore";
import startRpcServer from "./rpc";

export default async function startServer(core: Hypercore) {
	const rpcServer = await startRpcServer(core);

	const { publicKey, ...info } = rpcServer.server.address();
	console.log(
		`Running RPC server at ${JSON.stringify({
			...info,
			publicKey: publicKey.toString("hex"),
		})}`
	);

	return rpcServer;
}
