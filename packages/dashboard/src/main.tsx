import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";

import App from "@app/app";
import RootProvider from "@app/providers/root-provider";

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<StrictMode>
		<RootProvider>
			<App />
		</RootProvider>
	</StrictMode>
);
