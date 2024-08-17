import {
	Label,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@spear/design-system";
import clsx from "clsx";
import { LayoutGrid, Radio, Telescope, Ticket } from "lucide-react";
import { ReactNode } from "react";

function NavItem({
	icon,
	title,
	enableTooltip,
	hideTitle,
	selected,
}: {
	enableTooltip?: boolean;
	title: string;
	icon: ReactNode;
	hideTitle?: boolean;
	selected?: boolean;
}) {
	const render = () => {
		return (
			<a
				href='#'
				className={clsx(
					"flex h-9 items-center rounded-lg duration-300 ease-in-out hover:text-foreground md:h-10 cursor-pointer hover:bg-accent/30",
					{
						"md:w-10 w-9 justify-center px-0": hideTitle,
						"md:w-full w-9 px-4 space-x-4  justify-start":
							!hideTitle,
						"bg-accent hover:bg-accent/80": selected,
					}
				)}
			>
				{icon}
				<Label
					className={clsx(
						"duration-300 ease-in-out transition-all cursor-pointer delay-2000",
						hideTitle ? "opacity-0 w-0" : "opacity-100 w-full"
					)}
				>
					{title}
				</Label>
			</a>
		);
	};

	return enableTooltip ? (
		<Tooltip>
			<TooltipTrigger asChild>{render()}</TooltipTrigger>
			<TooltipContent>{title}</TooltipContent>
		</Tooltip>
	) : (
		render()
	);
}

export default function Navigation({ isCollapsed }: { isCollapsed: boolean }) {
	return (
		<nav
			className={clsx(
				"flex flex-col items-center gap-2 pt-[var(--tab-bar-height)]",
				isCollapsed ? "px-2" : "px-4"
			)}
		>
			<NavItem
				icon={
					<Telescope className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='Browse'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
				selected
			/>
			<NavItem
				icon={
					<Radio className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='Live Auction'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
			/>
			<NavItem
				icon={
					<LayoutGrid className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='My Collections'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
			/>
			<NavItem
				icon={
					<Ticket className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='Collections'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
			/>
		</nav>
	);
}
