/* eslint-disable @typescript-eslint/ban-ts-comment */

// @ts-ignore
import Hypercore from "hypercore";
import path from "path";
import React from "react";
import { SpearConfig } from "../context";

export const useHypercore = (config: SpearConfig = {}) => {
	const core = React.useRef();

	React.useEffect(() => {
		core.current =
			config?.core ||
			new Hypercore(path.join(process.cwd(), ".spear", "react-storage"));
	}, []);

	return { core };
};
