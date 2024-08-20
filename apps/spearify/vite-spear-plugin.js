import { readFileSync } from "fs";

export default function myPlugin() {
	const virtualModuleId = "virtual:spear-module";
	const resolvedVirtualModuleId = "\0" + virtualModuleId;

	return {
		name: "my-plugin", // required, will show up in warnings and errors
		resolveId(id) {
			if (id === virtualModuleId) {
				return resolvedVirtualModuleId;
			}
		},
		load(id) {
			if (id === resolvedVirtualModuleId) {
				const file = readFileSync("./.spear/index.js");
				return file.toString("utf-8");
			}
		},
	};
}
