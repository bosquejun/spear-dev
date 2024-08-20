import React, { PropsWithChildren } from "react";
import { SpearConfig, SpearContext } from "./context";
import { useHypercore } from "./hooks";

export function SpearProvider({
	config,
	children,
}: PropsWithChildren & {
	config: SpearConfig;
}) {
	const { core } = useHypercore(config);

	console.log(core);

	const context: SpearContext = {
		config,
	};

	return (
		<SpearContext.Provider value={context}>
			{children}
		</SpearContext.Provider>
	);
}
