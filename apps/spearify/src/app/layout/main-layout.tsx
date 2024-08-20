import PearCtrl from "@app/components/pear-ctrl";
import Navigation from "@app/sections/navigation";
import {
	cn,
	Container,
	Input,
	ResizableHandle,
	ResizablePanel,
	ResizablePanelGroup,
	Typography,
} from "@spear/design-system";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";
import TopBar from "../sections/topbar";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = React.useState(false);

	return (
		<div className='relative flex min-h-screen w-screen flex-col'>
			<div className='bg-gradient-to-b from-indigo-300/15 dark:from-indigo-800/15 to-30% absolute w-screen h-screen z-[1]'></div>
			<TopBar />

			<aside
				className={clsx(
					`h-screen z-10 flex-col border-r min-w-[5rem] max-w-[18rem] transition-width duration-300 ease-in-out`,
					isCollapsed ? "w-[5rem]" : "w-[23rem]"
				)}
			>
				<PearCtrl />
				<Navigation isCollapsed={isCollapsed} />
			</aside>
			<main className='transition-all duration-300 ease-in-out  flex w-full grow-1 z-10'>
				<div
					className={cn(
						"ml-[-0.7rem] mt-6 z-[11] flex h-4 w-4 items-center justify-center rounded-sm border bg-border cursor-pointer"
					)}
					onClick={() => {
						setIsCollapsed(!isCollapsed);
					}}
				>
					{isCollapsed ? (
						<ChevronRight className='h-4 w-4' />
					) : (
						<ChevronLeft className='h-4 w-4' />
					)}
				</div>
				<ResizablePanelGroup direction='horizontal'>
					<ResizablePanel className='pt-0 p-6 flex flex-col space-y-4'>
						<section className='h-[var(--tab-bar-height)] w-full flex justify-between items-center'>
							<Typography variant='h3'>Home</Typography>
							<Input
								placeholder='Search'
								className='max-w-44 bg-background'
							/>
						</section>
						<section>{children}</section>
					</ResizablePanel>
					<ResizableHandle withHandle />
					<ResizablePanel
						minSize={20}
						maxSize={50}
						defaultSize={30}
						className='p-6'
					>
						<section className='w-full h-full flex flex-col'>
							<Container className='h-full'>test</Container>
						</section>
					</ResizablePanel>
				</ResizablePanelGroup>
			</main>
		</div>
	);
}
