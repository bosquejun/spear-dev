import { getConfigData, SpearSDKConfigs } from "./configs";

export function defineConfig(configs: SpearSDKConfigs) {
	const appConfig = getConfigData(configs);
	return appConfig;
}

export { getConfigData };

export default defineConfig;
