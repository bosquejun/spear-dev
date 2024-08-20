import RPC from "@hyperswarm/rpc";
import Hypercore from "hypercore";
import DHT from "hyperdht";
import { VersionedApi } from "..";
import initializeStorage from "../../model";
import { buildRpcHandlers, RpcHandlerRecord } from "./builder";
import v1RpcHandlers from "./v1";

export type VersionedRpcHandlers = Record<VersionedApi, RpcHandlerRecord>;

export const rpcMethodAndHandlers: VersionedRpcHandlers = {
	v1: v1RpcHandlers,
};

export default async function startRpcServer(core: Hypercore) {
	const dht = new DHT({
		port: 40001,
		keyPair: DHT.keyPair(core.keyPair.publicKey),
		bootstrap: [{ host: "127.0.0.1", port: 30001 }],
	});

	const rpc = new RPC({
		keyPair: core.keyPair,
		dht,
	});

	const server = rpc.createServer();

	const storage = await initializeStorage();

	buildRpcHandlers(server, rpcMethodAndHandlers, core, storage);

	await server.listen();

	return { rpc, server };
}
