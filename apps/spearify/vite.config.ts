/* eslint-disable @typescript-eslint/ban-ts-comment */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@app": path.resolve(__dirname, "./src/app"),
			"@assets": path.resolve(__dirname, "./src/assets"),
			"@spear/design-system": path.resolve(
				__dirname,
				"../../packages/design-system/src"
			),
		},
	},
	cacheDir: "./.vite",
	build: {
		minify: false,
	},
});
