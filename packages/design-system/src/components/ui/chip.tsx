/* eslint-disable @typescript-eslint/no-unused-expressions */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { Badge, badgeVariants } from "./badge";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Skeleton } from "./skeleton";
import clsx from "clsx";
import { cn } from "@spear/design-system/lib/utils";

const chipVariants = cva("gap-x-1 items-center flex justify-center", {
	variants: {
		size: {
			small: "px-[0.2rem] gap-x-[0.2rem] py-[0.04rem] text-[11px] h-[20px]",
			medium: "px-1.5 py-1 h-[26px]",
			large: "px-1.5 py-1 text-lg",
		},
	},
	defaultVariants: {
		size: "medium",
	},
});

export interface ChipProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {
	onRemove?: () => void;
	hideClose?: boolean;
	loading?: boolean;
	onToggle?: (
		value: string | ChipProps["children"],
		toggleState: boolean
	) => void;
	defaultToggleValue?: boolean;
}

const Chip = React.forwardRef<React.ElementRef<typeof Badge>, ChipProps>(
	({
		children,
		className,
		onRemove,
		hideClose,
		size,
		loading,
		onToggle,
		defaultToggleValue,
		variant,
		...props
	}) => {
		const [toggled, setToggled] = React.useState(
			Boolean(defaultToggleValue)
		);

		const isToggleEnabled = Boolean(onToggle);

		const toggledVariant = isToggleEnabled && toggled ? "default" : variant;

		return (
			<button
				onClick={() => {
					if (!isToggleEnabled) return;
					setToggled(!toggled);
					onToggle && onToggle(children, !toggled);
				}}
				className={clsx({
					"cursor-pointer": isToggleEnabled,
				})}
			>
				<Badge
					{...props}
					className={cn(className, chipVariants({ size }))}
					variant={toggledVariant}
				>
					{loading ? (
						<Skeleton />
					) : (
						<>
							<p>{children}</p>
							{!hideClose && (
								<button
									className='cursor-pointer'
									onClick={onRemove}
								>
									<Cross2Icon
										className={cn({
											"h-2 w-2": size === "small",
											"h-4 w-4": size === "medium",
											"h-5 w-5": size === "large",
										})}
										width={12}
									/>
								</button>
							)}
						</>
					)}
				</Badge>
			</button>
		);
	}
);

Chip.displayName = "Chip";

export { Chip };
