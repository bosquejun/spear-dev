import UserProvider from "@app/contexts/user-context";
import { ThemeProvider, Toaster, TooltipProvider } from "@spear/design-system";
import React from "react";

export default function RootProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ThemeProvider defaultTheme='dark' storageKey='spear-ui-theme'>
			<UserProvider>
				<TooltipProvider>{children}</TooltipProvider>
			</UserProvider>
			<Toaster />
		</ThemeProvider>
	);
}
