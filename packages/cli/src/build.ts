// import { getConfigData } from "@spear/sdk";
import path from "path";

export default async function buildSpearApp() {
	// only resolved root project dir.
	// @todo - support monorepo in the future
	try {
		const configsPath = require.resolve(
			path.join(process.cwd(), "spear-config.js")
		);

		const configs = await import(configsPath);

		console.log(configs);
	} catch (error) {
		console.error("spear-config.js not found.");
		throw error;
	}
}
