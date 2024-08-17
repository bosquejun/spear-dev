import path from "path";
import { fileURLToPath } from "url";

const VIRTUAL_MODULES = [];

export async function getViteConfig(options) {
	const { searchForWorkspaceRoot, mergeConfig } = await import("vite");
	const { default: react } = await import("@vitejs/plugin-react");
	const { default: medusa } = await import("@medusajs/admin-vite-plugin");

	const getPort = await import("get-port");
	const hmrPort = await getPort.default();

	const __dirname = fileURLToPath(new URL(".", import.meta.url));

	const root = path.resolve(__dirname, "./");

	const backendUrl = "";

	const baseConfig = {
		root,
		base: "/",
		build: {
			emptyOutDir: true,
			outDir: path.resolve(process.cwd(), "./spear-cache"),
		},
		optimizeDeps: {
			include: ["@medusajs/dashboard", "react-dom/client"],
			exclude: VIRTUAL_MODULES,
		},
		// define: {
		// 	__BASE__: JSON.stringify(options.path),
		// 	__BACKEND_URL__: JSON.stringify(backendUrl),
		// },
		server: {
			fs: {
				allow: [searchForWorkspaceRoot(process.cwd())],
			},
			hmr: {
				port: hmrPort,
			},
			middlewareMode: true,
		},
		css: {
			postcss: {
				plugins: [
					require("tailwindcss")({
						config: createTailwindConfig(root, options?.sources),
					}),
				],
			},
		},
		plugins: [
			react(),
			medusa({
				sources: options?.sources,
			}),
		],
	};

	if (options.vite) {
		const customConfig = options.vite(baseConfig);

		return mergeConfig(baseConfig, customConfig);
	}

	return baseConfig;
}

function createTailwindConfig(entry, sources = []) {
	const root = path.join(entry, "**/*.{js,ts,jsx,tsx}");
	const html = path.join(entry, "index.html");

	let dashboard = "";

	try {
		dashboard = path.join(
			path.dirname(require.resolve("@medusajs/dashboard")),
			"**/*.{js,ts,jsx,tsx}"
		);
	} catch (_e) {
		// ignore
	}

	let ui = "";

	try {
		ui = path.join(
			path.dirname(require.resolve("@medusajs/ui")),
			"**/*.{js,ts,jsx,tsx}"
		);
	} catch (_e) {
		// ignore
	}

	const extensions = sources.map((s) => path.join(s, "**/*.{js,ts,jsx,tsx}"));

	const config = {
		presets: [require("@medusajs/ui-preset")],
		content: [html, root, dashboard, ui, ...extensions],
		darkMode: "class",
	};

	return config;
}

(async (options) => {
	const vite = await import("vite");

	const viteConfig = await getViteConfig(options);
	const buildConfig = {
		mode: "production",
		logLevel: "error",
	};

	await vite.build(vite.mergeConfig(viteConfig, buildConfig));
	// const vite = await import("vite");
	// // const { output } = await vite.build({
	// // 	mode: "development",
	// // 	plugins: [react()],
	// // });
	// // debugger;

	// const __dirname = fileURLToPath(new URL(".", import.meta.url));

	// const spearDashboardPath = path.join(__dirname, ".spear");
	// const distPath = path.join(__dirname, "dist");
	// // const jsFilePath = path.join(distPath, output[0].fileName);
	// // const indexHtml = path.join(distPath, output[2].fileName);
	// const server = await vite.createServer({
	// 	configFile: "vite.config.ts",
	// 	root: __dirname,
	// });
	// await server.listen();
	// server.bindCLIShortcuts({ print: true });

	// const runtime = await vite.createViteRuntime(server);

	// runtime.executeEntrypoint(path.join(spearDashboardPath, "index.js"));
})();
