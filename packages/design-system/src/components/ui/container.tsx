import { cn } from "@spear/design-system/lib/utils";
import { Card, CardContent } from "./card";

export const Container = ({
	children,
	className,
	...props
}: React.PropsWithChildren & { className?: string }) => {
	return (
		<Card {...props} className={cn("px-2 py-4 rounded-md", className)}>
			<CardContent>{children}</CardContent>
		</Card>
	);
};
