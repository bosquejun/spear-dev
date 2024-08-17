/* eslint-disable @typescript-eslint/ban-ts-comment */

import { JsonRpcProvider } from "ethers";
// @ts-ignore
import Hypercore from "hypercore";
// @ts-ignore
import Hyperbee from "hyperbee";
// @ts-ignore
import Hyperswarm from "hyperswarm";
import { SpearETHWallet } from "../wallet";

export default class EthereumIndexer {
	private _bee: Hyperbee;
	private _swarm: Hyperswarm;
	private _wallets: SpearETHWallet[] = [];
	readonly confirmationBlock = 12;
	constructor(
		private readonly _core: Hypercore,
		private readonly _provider: JsonRpcProvider
	) {
		this._bee = new Hyperbee(_core, { valueEncoding: "json" });
		this._swarm = new Hyperswarm();
	}

	async listen() {
		this._provider.on("block", this._onBlockDetected.bind(this));

		this._swarm.on("update", () => {
			console.log("Peer connected:", this._swarm.connections.size);
		});

		this._swarm.on("connection", (conn: unknown) => {
			this._core.replicate(conn);
		});

		await this._core.ready();

		this._wallets = await SpearETHWallet.loadWalletsFromCore(
			this._core,
			undefined,
			this._provider
		);

		console.log(this._wallets.length);

		this._swarm.join(this._core.discoveryKey);

		return {
			publicKey: this._core.key,
		};
	}

	private async _onBlockDetected(blockNumber: number) {
		const [latestBlock, confirmedBlock] = await Promise.all([
			this._provider.getBlock(blockNumber, true),
			this._provider.getBlock(blockNumber - this.confirmationBlock, true),
		]);
		console.log(
			`latest [${latestBlock?.number}] - ${latestBlock?.prefetchedTransactions.length}, confirmed [${confirmedBlock?.number}] - ${confirmedBlock?.prefetchedTransactions.length}`
		);
	}
}
