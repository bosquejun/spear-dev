import { WalletProviders } from "@app/contexts/wallet-context";
import { ThemeProvider, Toaster, TooltipProvider } from "@spear/design-system";
import { SpearProvider } from "@spear/react";
import React from "react";
import ChainProvider from "./ChainProvider";

export default function RootProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider defaultTheme='dark' storageKey='spear-ui-theme'>
			<ChainProvider>
				<SpearProvider config={{}}>
					<WalletProviders>
						<TooltipProvider>{children}</TooltipProvider>
					</WalletProviders>
				</SpearProvider>
			</ChainProvider>

			<Toaster />
		</ThemeProvider>
	);
}
