/// <reference types="vite/client" />

declare module "virtual:spear-module" {
	const content: string;
	export const getConfig: () => { type: "teset" };
	export default content;
}
