import { ETH_LOGO } from "@app/constants";
import { Avatar } from "@radix-ui/react-avatar";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
	AvatarImage,
	Button,
	cn,
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	Popover,
	PopoverContent,
	PopoverTrigger,
	Typography,
} from "@spear/design-system";
import { CheckIcon } from "lucide-react";
import { useState } from "react";
import { useChainId, useSwitchChain } from "wagmi";

export default function ChainSelector() {
	const currentChainId = useChainId();
	const [open, setOpen] = useState(false);
	const { chains, switchChain } = useSwitchChain();

	console.log(chains);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant='outline'
					role='combobox'
					aria-expanded={open}
					className='w-[200px] justify-between py-2 px-3'
				>
					<Avatar>
						<AvatarImage src={ETH_LOGO} className='w-6' />
					</Avatar>

					<Typography variant='p' className='text-lg'>
						{currentChainId
							? chains.find(
									(chain) => currentChainId === chain.id
								)?.name
							: "Select chain network..."}
					</Typography>
					<CaretSortIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
				</Button>
			</PopoverTrigger>
			<PopoverContent className='w-[200px] p-0'>
				<Command>
					<CommandInput
						placeholder='Search chain network...'
						className='h-9'
					/>
					<CommandList>
						<CommandEmpty>No chain network found.</CommandEmpty>
						<CommandGroup>
							{chains.map((chain) => (
								<CommandItem
									key={chain.id}
									value={chain.name}
									onSelect={async () => {
										await switchChain({
											chainId: chain.id,
										});
										setOpen(false);
									}}
									className='space-x-2 w-full  py-2 px-3'
								>
									<Avatar>
										<AvatarImage src={ETH_LOGO} />
									</Avatar>
									<div className='flex flex-col'>
										<Typography
											variant='p'
											className='text-lg'
										>
											{chain.name}
										</Typography>
										<p className='text-secondary-foreground/50'>
											{chain.testnet
												? "Testnet"
												: "Mainnet"}
										</p>
									</div>
									<div className='grow' />
									<CheckIcon
										className={cn(
											"ml-auto h-4 w-4",
											currentChainId === chain.id
												? "opacity-100"
												: "opacity-0"
										)}
									/>
								</CommandItem>
							))}
						</CommandGroup>
					</CommandList>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
