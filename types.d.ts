/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
declare namespace Pear {
	export const configs: {
		storage: string;
	};
}

declare module "corestore" {
	export default class {
		constructor(opt: any);

		createKeyPair(
			str: string
		): Promise<{ publicKey: Buffer; secretKey: Buffer }>;
	}
}

declare module "hypecore" {
	export default class {
		constructor(opt: any);

		ready(): Promise<void>;
	}
}
