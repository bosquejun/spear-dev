import path from "path";
export type SpearConfigExtension<T = object> = {
	resolve: string;
	options?: T;
};

export type SpearSDKConfigs = {
	rootDir?: string;
	// TODO
	// modules: SpearConfigExtension[];
	// TODO
	plugins?: SpearConfigExtension[];
	// TODO
	gui?: SpearGUIConfigs;
};

type SpearGUIConfigs = {
	theme?: {
		defaultTheme?: "light" | "dark" | "system";
	};
	pear?: {
		backgroundColor?: string;
		height?: number;
		width?: number;
	};
};

export function getConfigData(configs: SpearSDKConfigs) {
	const targetDir = configs?.rootDir || __dirname;

	const resolvedPath = path.resolve(path.join(targetDir, "spear-config.js"));

	console.log(resolvedPath);
}
