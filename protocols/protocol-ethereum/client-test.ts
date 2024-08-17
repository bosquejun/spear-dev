/* eslint-disable @typescript-eslint/ban-ts-comment */
import path from "path";
import EthereumIndexer from "./src/indexer";
// @ts-ignore
import Hypercore from "hypercore";
import SpearEthProvider from "./src/provider/spear-provider";

(async () => {
	const core = new Hypercore(path.join(process.cwd(), ".spear", "wallets"));
	const provider = new SpearEthProvider(
		"https://ethereum-holesky-rpc.publicnode.com"
	);
	const indexer = new EthereumIndexer(core, provider);

	const listener = await indexer.listen();
	console.log(listener.publicKey.toString("hex"));
})();
