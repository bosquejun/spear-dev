import { Card, CardContent, Typography } from "@spear/design-system";
import * as React from "react";
import { holesky } from "viem/chains";
import { Connector, useConnect } from "wagmi";

declare const Pear: unknown;

const isDesktop = typeof Pear !== "undefined";

export function WalletOptions({ closeSheet }: { closeSheet: () => void }) {
	const { connectors, connect } = useConnect();

	return connectors
		.filter((conn) =>
			isDesktop
				? conn.type !== "injected"
				: conn.type === "injected" && conn.id !== "injected"
		)
		.map((connector) => (
			<WalletOption
				key={connector.uid}
				connector={connector}
				onClick={() => {
					connect({ connector, chainId: holesky.id });
					closeSheet();
				}}
			/>
		));
}

function WalletOption({
	connector,
	onClick,
}: {
	connector: Connector;
	onClick: () => void;
}) {
	const [ready, setReady] = React.useState(false);

	React.useEffect(() => {
		(async () => {
			const provider = await connector.getProvider();
			setReady(!!provider);
		})();
	}, [connector]);

	return (
		<Card
			key={connector.name}
			disabled={!ready}
			clickable
			onClick={onClick}
		>
			<CardContent className='flex items-center py-2 px-3 gap-x-3 min-h-14'>
				{!isDesktop && (
					<img src={connector.icon} width={40} height='auto' />
				)}
				<Typography className='capitalize'>{connector.name}</Typography>
			</CardContent>
		</Card>
	);
}
