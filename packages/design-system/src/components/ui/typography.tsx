import { cn } from "@spear/design-system/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
	variants: {
		variant: {
			h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
			h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight",
			h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
			h4: "scroll-m-20 text-xl font-semibold tracking-tight",
			p: "leading-7",
			blockquote: "border-l-2 pl-6 italic",
			lead: "text-xl text-muted-foreground",
			large: "text-lg font-semibold",
			small: "text-sm font-medium leading-none",
			muted: "text-sm text-muted-foreground",
		},
	},
	defaultVariants: {
		variant: "p",
	},
});

export interface TypographyProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof typographyVariants> {}

function Typography({ className, variant, ...props }: TypographyProps) {
	return (
		<div
			className={cn(typographyVariants({ variant }), className)}
			{...props}
		/>
	);
}

export { Typography, typographyVariants };
