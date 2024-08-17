#!/usr/bin/env node
try {
	require("ts-node").register({});
} catch {
	//
}
require("dotenv").config();
// const cli = require("./dist/index.js");
const cli = require("./src/index.ts");

cli.default(process.argv);
