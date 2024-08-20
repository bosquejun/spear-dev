import Hypercore from "hypercore";
import path from "path";
import startServer from "./api/server";

(async () => {
	const core = new Hypercore(path.join(process.cwd(), ".spear", "storage"));

	await core.ready();

	startServer(core).catch((error) => {
		console.error(error);
		process.exit(1);
	});
})();
