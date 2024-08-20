import * as React from "react";

import { cn } from "@spear/design-system/lib/utils";
import { cva } from "class-variance-authority";

const cardVariants = cva("", {
	variants: {
		disabled: {
			true: "opacity-40 border-muted cursor-default",
		},
		clickable: {
			true: "cursor-pointer hover:bg-secondary",
			false: "cursor-default hover:bg-none",
		},
	},
	defaultVariants: {
		disabled: false,
		clickable: false,
	},
});

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement> & {
		disabled?: boolean;
		clickable?: boolean;
	}
>(({ className, disabled, clickable, onClick, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"rounded-xl border bg-card text-card-foreground shadow",
			cardVariants({ disabled, clickable: disabled ? false : clickable }),
			className
		)}
		{...props}
		onClick={(e) => {
			if (disabled) return;
			onClick && onClick(e);
		}}
	/>
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex flex-col space-y-1.5 p-6", className)}
		{...props}
	/>
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn("font-semibold leading-none tracking-tight", className)}
		{...props}
	/>
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn("text-sm text-muted-foreground", className)}
		{...props}
	/>
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("p-6", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("flex items-center p-6 pt-0", className)}
		{...props}
	/>
));
CardFooter.displayName = "CardFooter";

export {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
};
