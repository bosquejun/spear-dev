import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@app": path.resolve(__dirname, "./src/app"),
			"@spear/design-system": path.resolve(
				__dirname,
				"../design-system/src"
			),
		},
	},
	cacheDir: "./cache",
});
