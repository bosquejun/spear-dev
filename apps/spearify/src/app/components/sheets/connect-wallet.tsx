import { WalletOptions } from "@app/sections/wallet-options";
import { trimAddress } from "@app/utils/string";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import {
	Avatar,
	AvatarFallback,
	Button,
	Input,
	Separator,
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
	Skeleton,
	Tooltip,
	TooltipContent,
	Typography,
} from "@spear/design-system";
import { useState } from "react";
import { toast } from "sonner";
import { formatUnits } from "viem";
import {
	useAccount,
	useAccountEffect,
	useBalance,
	useDisconnect,
	useSignMessage,
} from "wagmi";
import ChainSelector from "../chain-selector";
import Show from "../show";

export default function ConnectWalletSheet() {
	const { isConnected, address, isReconnecting, isConnecting } = useAccount();
	const { disconnect } = useDisconnect();
	const [open, setOpenSheet] = useState(false);
	const [nonceToSign, setNonceToSign] = useState("");
	const { signMessageAsync } = useSignMessage();

	const { data, isLoading: isBalanceLoading } = useBalance({
		address,
		query: {
			enabled: isConnected,
		},
	});

	const openSheet = () => {
		setOpenSheet(true);
	};

	const closeSheet = () => {
		setOpenSheet(false);
	};

	useAccountEffect({
		onConnect(data) {
			if (data.isReconnected) {
				toast(`${data.chain?.name} wallet reconnected.`);
			} else {
				toast(`${data.chain?.name} wallet connected.`);
				openSheet();
			}
		},
		onDisconnect() {
			closeSheet();
			toast("Wallet disconnected");
		},
	});

	if (isReconnecting) {
		return <Skeleton className='w-[112px] h-[32px]' />;
	}

	console.log({ isConnecting, isReconnecting });

	return (
		<Sheet open={open} onOpenChange={(open) => setOpenSheet(open)}>
			<SheetTrigger asChild>
				{isConnected && !isBalanceLoading ? (
					<Tooltip>
						<TooltipTrigger>
							<Button onClick={openSheet} variant='ghost'>
								<p>{trimAddress(address as string)}</p>
								<Separator
									orientation='vertical'
									className='mx-2'
								/>
								<p>
									{formatUnits(
										data?.value as bigint,
										data?.decimals as number
									).slice(0, 4)}{" "}
									hETH
								</p>
							</Button>
						</TooltipTrigger>
						<TooltipContent>{address}</TooltipContent>
					</Tooltip>
				) : (
					<Button onClick={openSheet} size='sm' variant='default'>
						Connect Wallet
					</Button>
				)}
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<Show>
						<Show.When isTrue={isConnected}>
							<SheetTitle></SheetTitle>
						</Show.When>
						<Show.Else>
							<SheetTitle>Connect Wallet</SheetTitle>
							<SheetDescription>
								Select wallet to connect
							</SheetDescription>
						</Show.Else>
					</Show>
				</SheetHeader>
				<div className='flex flex-col h-[calc(100vh_-_24px)] py-4 space-y-2'>
					<Show>
						<Show.When isTrue={isConnected}>
							<div className='flex flex-col space-y-1 w-full items-center'>
								<Avatar className='w-20 h-20'>
									<AvatarFallback className='text-4xl bg-primary text-primary-foreground'>
										{address?.slice(
											address.length - 2,
											address.length
										)}
									</AvatarFallback>
								</Avatar>
								<Tooltip>
									<TooltipTrigger>
										<Typography
											variant='h3'
											className='text-secondary-foreground'
										>
											{trimAddress(address!)}
										</Typography>
									</TooltipTrigger>
									<TooltipContent>
										<p>{address}</p>
									</TooltipContent>
								</Tooltip>
								{!isBalanceLoading &&
								Boolean(data) &&
								isConnected ? (
									<Tooltip>
										<TooltipTrigger>
											<Typography
												variant='p'
												className='text-muted-foreground'
											>
												{formatUnits(
													data?.value as bigint,
													data?.decimals as number
												).slice(0, 4)}{" "}
												hETH
											</Typography>
										</TooltipTrigger>

										<TooltipContent>
											<p>
												{formatUnits(
													data?.value as bigint,
													data?.decimals as number
												).toString()}
											</p>
										</TooltipContent>
									</Tooltip>
								) : (
									<Skeleton className='w-[69px] h-[32px]' />
								)}
								<ChainSelector />

								<Input
									placeholder='nonce'
									onChange={(e) => {
										setNonceToSign(e.target.value);
									}}
								/>
								<Button
									onClick={async () => {
										const message = `Please sign this message to authenticate. Nonce: ${nonceToSign}`;

										const signature =
											await signMessageAsync({ message });
										console.log(signature);
									}}
								>
									Sign message
								</Button>
							</div>
						</Show.When>
						<Show.Else>
							<div className='grid gap-4 py-4 text-muted-foreground'>
								<WalletOptions closeSheet={closeSheet} />
							</div>
						</Show.Else>
					</Show>

					{isConnected && (
						<>
							<div className='grow' />
							<Button
								variant='destructive'
								onClick={() => disconnect()}
							>
								Disconnect
							</Button>
						</>
					)}
				</div>
			</SheetContent>
		</Sheet>
	);
}
