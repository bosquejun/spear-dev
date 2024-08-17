/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import { sync as existsSync } from "fs-exists-cached";
import path from "path";
import resolveCwd from "resolve-cwd";
import { didYouMean } from "./utils";

const yargs = require(`yargs`);

const handlerP =
	(fn: any) =>
	(...args: any[]) => {
		Promise.resolve(fn(...args)).then(
			() => process.exit(0),
			(err) => console.log(err)
		);
	};

function buildLocalCommands(cli: any, isLocalProject: boolean) {
	const directory = path.resolve(`.`);

	const projectInfo: any = { directory };
	const useYarn = existsSync(path.join(directory, `yarn.lock`));

	if (isLocalProject) {
		projectInfo["sitePackageJson"] = require(
			path.join(directory, `package.json`)
		);
	}

	function resolveLocalCommand(command: string) {
		if (!isLocalProject) {
			cli.showHelp();
		}

		try {
			const cmdPath = resolveCwd.silent(
				`@medusajs/medusa/dist/commands/${command}`
			)!;
			return require(cmdPath).default;
		} catch (err) {
			if (!process.env.NODE_ENV?.startsWith("prod")) {
				console.log("--------------- ERROR ---------------------");
				console.log(err);
				console.log("-------------------------------------------");
			}
			cli.showHelp();
		}
	}

	function getCommandHandler(command: any, handler: any) {
		return (argv: any) => {
			const localCmd = resolveLocalCommand(command);
			const args = { ...argv, ...projectInfo, useYarn };

			return handler ? handler(args, localCmd) : localCmd(args);
		};
	}

	cli.command({
		command: `build`,
		desc: `Build your project.`,
		builder: (_: any) => _,
		handler: handlerP(
			getCommandHandler(`build`, (args: any, cmd: any) => {
				process.env.NODE_ENV = process.env.NODE_ENV || `development`;
				cmd(args);

				return new Promise(() => {});
			})
		),
	});
}

function isLocalMedusaProject() {
	let inMedusaProject = false;

	try {
		const { dependencies, devDependencies } = require(
			path.resolve(`./package.json`)
		);
		inMedusaProject = !!(
			(dependencies && dependencies["@medusajs/medusa"]) ||
			(devDependencies && devDependencies["@medusajs/medusa"])
		);
	} catch {
		// ignore
	}

	return inMedusaProject;
}

function getVersionInfo() {
	const { version } = require(`../package.json`);
	const isMedusaProject = isLocalMedusaProject();
	if (isMedusaProject) {
		let medusaVersion = "";
		try {
			medusaVersion = require(
				path.join(
					process.cwd(),
					`node_modules`,
					`@medusajs/medusa`,
					`package.json`
				)
			).version;
		} catch {
			/* noop */
		}

		if (!medusaVersion) {
			medusaVersion = `unknown`;
		}

		return `Medusa CLI version: ${version}
Medusa version: ${medusaVersion}
  Note: this is the Medusa version for the site at: ${process.cwd()}`;
	} else {
		return `Medusa CLI version: ${version}`;
	}
}

export default (argv: any) => {
	const cli = yargs();
	const isLocalProject = isLocalMedusaProject();

	cli.scriptName(`spear`)
		.usage(`Usage: $0 <command> [options]`)
		.alias(`h`, `help`)
		.alias(`v`, `version`)
		.option(`verbose`, {
			default: false,
			type: `boolean`,
			describe: `Turn on verbose output`,
			global: true,
		})
		.option(`no-color`, {
			alias: `no-colors`,
			default: false,
			type: `boolean`,
			describe: `Turn off the color in output`,
			global: true,
		})
		.option(`json`, {
			describe: `Turn on the JSON logger`,
			default: false,
			type: `boolean`,
			global: true,
		});

	buildLocalCommands(cli, isLocalProject);

	try {
		cli.version(
			`version`,
			`Show the version of the Medusa CLI and the Medusa package in the current project`,
			getVersionInfo()
		);
	} catch {
		// ignore
	}

	return cli
		.wrap(cli.terminalWidth())
		.demandCommand(
			1,
			`Pass --help to see all available commands and options.`
		)
		.strict()
		.fail((msg: string, error: any, yargs: any) => {
			const availableCommands = yargs
				.getCommands()
				.map((commandDescription: string) => {
					const [command] = commandDescription;
					return command.split(` `)[0];
				});
			const arg = argv.slice(2)[0];
			const suggestion = arg ? didYouMean(arg, availableCommands) : ``;

			if (!process.env.NODE_ENV?.startsWith("prod")) {
				console.log("--------------- ERROR ---------------------");
				console.log(error);
				console.log("-------------------------------------------");
			}

			cli.showHelp();
			console.log(suggestion);
		})
		.parse(argv.slice(2));
};
