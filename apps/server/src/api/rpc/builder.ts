/* eslint-disable @typescript-eslint/no-explicit-any */
import Hypercore from "hypercore";
import { APIContext, JSONValue } from "../";
import BaseStorage from "../../model/baseModel";
import { VersionedRpcHandlers } from "./";

export type RpcHandlerContext = {
	rawRequest: RpcRequestDataShape | null;
	requestorPublicKey: string;
	method: string;
	core: Hypercore;
	storage: Map<string, BaseStorage>;
};
export type RPCMethodHandler<TReqData = JSONValue, TRes = JSONValue> = (
	requestData: TReqData | null,
	context: APIContext
) => Promise<TRes | void>;

export type RpcHandler = {
	authentication?: RPCMethodHandler;
	handler: RPCMethodHandler;
};

export type RpcHandlerRecord = Record<string, RpcHandler>;

function getAllDistinctMethods(versionedRpcHandlers: VersionedRpcHandlers) {
	const methods = [];
	for (const version in versionedRpcHandlers) {
		for (const method in versionedRpcHandlers[version]) {
			if (!methods.includes(method)) {
				methods.push(method);
			}
		}
	}

	return methods;
}

export type RpcRequestDataShape = {
	version: keyof VersionedRpcHandlers;
	data: JSONValue | null;
	signature?: string;
};

export function buildRpcHandlers(
	server: any,
	versionedRpcHandlers: VersionedRpcHandlers,
	core: Hypercore,
	storage: Map<string, BaseStorage>
) {
	const rpcMethods = getAllDistinctMethods(versionedRpcHandlers);

	// register all distinct methods to rpc sever
	for (const method of rpcMethods) {
		server.respond(method, async (req: Buffer, rpc: any) => {
			let reqData = null;
			const requestorPublicKey =
				rpc.stream.remotePublicKey.toString("hex");
			try {
				reqData = req.length ? JSON.parse(req.toString()) : null;
			} catch (error) {
				throw new Error("Invalid rpc request parameter");
			}

			const { data, version } = reqData as RpcRequestDataShape;
			// todo - signature

			const versionedRpcEntries = versionedRpcHandlers[version];

			if (!versionedRpcEntries) {
				throw new Error(`Unsupported version of ${method} method.`);
			}

			const { handler, authentication } = versionedRpcEntries[method];

			if (authentication) {
				// handle authentication
			}

			try {
				const context: APIContext = {
					rpc: {
						rawRequest: reqData || null,
						requestorPublicKey,
						method,
						core,
						storage,
					},
					version,
					source: "rpc",
				};
				const response = await handler(data, context);

				const resData = {
					version,
					data: response || null,
					error: null,
				};

				return Buffer.from(JSON.stringify(resData));
			} catch (error) {
				const { message } = error;

				return Buffer.from(
					JSON.stringify({
						error: {
							message,
							code: null,
						},
						data: null,
						version,
					})
				);
			}
		});
	}
}
