/* eslint-disable @typescript-eslint/ban-ts-comment */
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// @ts-ignore
import spearPlugin from "./vite-spear-plugin";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		spearPlugin(),
		{
			// ...
			configureServer(server) {
				server.ws.on("connection", () => {
					setTimeout(() => {
						server.ws.send("my:greetings", { msg: "hello" });
					}, 3000);
				});
			},
		},
	],
	resolve: {
		alias: {
			"@app": path.resolve(__dirname, "./src/app"),
			"@spear/design-system": path.resolve(
				__dirname,
				"../design-system/src"
			),
		},
	},
	cacheDir: "./.vite",
	build: {
		minify: false,
		// lib: {
		// 	// Could also be a dictionary or array of multiple entry points
		// 	entry: path.resolve(__dirname, "src/main.tsx"),
		// 	name: "MyLib",
		// 	// the proper extensions will be added
		// 	fileName: "my-lib",
		// },
		// rollupOptions: {
		// 	treeshake: true,
		// 	output: {
		// 		entryFileNames: `assets/dashboard.js`,
		// 		chunkFileNames: `assets/dashboard-chunk.js`,
		// 	},
		// },
	},
});
