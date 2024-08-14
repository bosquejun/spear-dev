/* eslint-disable @typescript-eslint/no-namespace */
import * as React from "react";

declare global {
	namespace JSX {
		interface IntrinsicElements {
			"pear-ctrl": React.DetailedHTMLProps<
				React.HTMLAttributes<HTMLElement>,
				HTMLElement
			>;
		}
	}
}

export default function PearCtrl() {
	return <pear-ctrl />;
}
