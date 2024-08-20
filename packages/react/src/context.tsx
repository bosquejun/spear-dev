/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createContext } from "react";
// @ts-ignore
import Hypercore from "hypercore";
// @ts-ignore
import Hyperswarm from "hyperswarm";
// @ts-ignore
import DHT from "hyperdht";
// @ts-ignore
import Hyperbee from "hyperbee";

export type SpearConfig = {
	core?: Hypercore;
	swarm?: Hyperswarm;
	dht?: DHT;
	bee?: Hyperbee;
};

export type SpearContext = {
	config?: SpearConfig;
};

export const SpearContext = createContext<SpearContext | null>(null);
