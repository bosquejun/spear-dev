import ConnectWalletSheet from "@app/components/sheets/connect-wallet";

export default function TopBar() {
	return (
		<div className='flex w-screen h-[var(--top-bar-height)] justify-between items-center z-10 absolute border-b px-3'>
			{/* <PearCtrl /> */}
			<div className='grow' />
			<div className='flex gap-1'>
				<ConnectWalletSheet />
			</div>
		</div>
	);
}
