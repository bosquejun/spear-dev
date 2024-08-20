import ScreenLoader from "@app/components/screen-loader";
import { lazy, Suspense } from "react";

const Content = lazy(() => import("./content"));

export default function HomePage() {
	return (
		<Suspense fallback={<ScreenLoader open />}>
			<Content />
		</Suspense>
	);
}
