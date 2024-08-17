import { ethers, Networkish } from "ethers";

export default class SpearEthProvider extends ethers.JsonRpcProvider {
	constructor(
		url: string,
		// readonly publicKey: string,
		network?: Networkish
	) {
		super(url, network);
	}
}
