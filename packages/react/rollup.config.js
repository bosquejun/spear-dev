/* eslint-disable @typescript-eslint/no-var-requires */
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const typescript = require("@rollup/plugin-typescript");

module.exports = {
	input: "src/index.ts",
	output: [
		{
			file: "dist/index.cjs.js",
			format: "cjs",
			sourcemap: true,
		},
		{
			file: "dist/index.esm.js",
			format: "esm",
			sourcemap: true,
		},
	],
	external: ["react", "react-dom"],
	plugins: [
		resolve(),
		commonjs(),
		typescript({ tsconfig: "./tsconfig.json" }),
	],
};
