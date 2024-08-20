import { RpcHandlerContext } from "./rpc/builder";

export type JSONValue =
	| string
	| number
	| boolean
	| null
	| JSONObject
	| JSONArray;

interface JSONObject {
	[key: string]: JSONValue;
}

interface JSONArray extends Array<JSONValue> {}

export type VersionedApi = "v1";

export type APIContext = {
	rpc?: RpcHandlerContext;
	version: VersionedApi;
	source: "rpc" | "rest";
};
