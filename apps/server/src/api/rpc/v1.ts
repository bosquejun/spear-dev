import generateJwt from "../../app/authentication/generate-jwt";
import loginWallet from "../../app/authentication/login-wallet";
import { RpcHandlerRecord } from "./builder";

const v1RpcHandlers: RpcHandlerRecord = {
	health: {
		handler: async () => {
			return {
				status: "Healthy",
			};
		},
	},
	login: {
		handler: loginWallet,
	},
	generateJwt: {
		handler: generateJwt,
	},
};

export default v1RpcHandlers;
