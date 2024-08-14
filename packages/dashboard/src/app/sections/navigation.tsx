import {
	Label,
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@spear/design-system";
import clsx from "clsx";
import { Home, ShoppingCart } from "lucide-react";
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
						"duration-300 ease-in-out transition-all cursor-pointer",
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
				"flex flex-col items-center gap-4 py-4 pt-14",
				isCollapsed ? "px-2" : "px-4"
			)}
		>
			{/* <a
				href='#'
				className='ease-in-out group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-md bg-primary text-lg font-semibold text-primary-foreground md:h-10 md:w-10 md:text-base'
			>
				<Package2 className='h-5 w-5 transition-all group-hover:scale-110' />
				<span className='sr-only'>Acme Inc</span>
			</a> */}
			<NavItem
				icon={
					<Home className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='Home'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
				selected
			/>
			<NavItem
				icon={
					<ShoppingCart className='h-5 w-5 transition-all group-hover:scale-110' />
				}
				title='Orders'
				enableTooltip={isCollapsed}
				hideTitle={isCollapsed}
			/>
		</nav>
	);
}
