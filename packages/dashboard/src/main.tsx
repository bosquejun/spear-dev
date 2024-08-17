import { StrictMode } from "react";
import * as ReactDOM from "react-dom/client";
// import { getConfig } from "virtual:spear-module";
import App from "@app/app";
import RootProvider from "@app/providers/root-provider";

// console.log(getConfig());
// client side
if (import.meta.hot) {
	import.meta.hot.on("my:greetings", (data) => {
		console.log(data.msg); // hello
	});
}

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
