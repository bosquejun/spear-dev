import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";
import { holesky, mainnet } from "wagmi/chains";
import { injected, metaMask } from "wagmi/connectors";

export const config = createConfig({
	chains: [holesky, mainnet],
	transports: {
		[holesky.id]: http(),
		[mainnet.id]: http(),
	},
	connectors: [injected(), metaMask()],
});

const queryClient = new QueryClient();

export default function ChainProvider({ children }: PropsWithChildren) {
	return (
		<WagmiProvider config={config}>
			<QueryClientProvider client={queryClient}>
				{children}
			</QueryClientProvider>
		</WagmiProvider>
	);
}
