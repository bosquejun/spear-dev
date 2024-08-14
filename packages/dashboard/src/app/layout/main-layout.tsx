import PearCtrl from "@app/components/pear-ctrl";
import Navigation from "@app/sections/navigation";
import { cn } from "@spear/design-system";
import clsx from "clsx";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

export default function MainLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const [isCollapsed, setIsCollapsed] = React.useState(true);

	return (
		<div className='flex min-h-screen w-screen  dark:bg-muted/40 bg-muted/30'>
			<aside
				className={clsx(
					`h-screen z-10 flex-col border-r bg-background min-w-[5rem] max-w-[14rem] transition-width duration-300 ease-in-out`,
					isCollapsed ? "w-[5rem]" : "w-[14rem]"
				)}
			>
				<PearCtrl />
				<Navigation isCollapsed={isCollapsed} />
			</aside>
			<main className='transition-all duration-300 ease-in-out  flex w-full grow-1 pt-6'>
				<div
					className={cn(
						"absolute ml-[-0.7rem] top-3 z-[11] flex h-4 w-4 items-center justify-center rounded-sm border bg-border cursor-pointer"
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
				{children}
			</main>
		</div>
	);
}
