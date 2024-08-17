/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore
import meant from "meant";

export function didYouMean(scmd: string, commands: any): string {
	const bestSimilarity = meant(scmd, commands).map((str: string) => {
		return `    ${str}`;
	});

	if (bestSimilarity.length === 0) return ``;
	if (bestSimilarity.length === 1) {
		return `\nDid you mean this?\n ${bestSimilarity[0]}\n`;
	} else {
		return (
			[`\nDid you mean one of these?`]
				.concat(bestSimilarity.slice(0, 3))
				.join(`\n`) + `\n`
		);
	}
}
