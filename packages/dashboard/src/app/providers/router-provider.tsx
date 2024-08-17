import HomePage from "@app/pages/home";
import MyCollectionPage from "@app/pages/my-collections";
import {
	createBrowserRouter,
	Navigate,
	RouterProvider,
} from "react-router-dom";

const routers = createBrowserRouter([
	{
		path: "/browse",
		element: <HomePage />,
	},
	{
		path: "/collections",
		element: <MyCollectionPage />,
	},
	{
		path: "*",
		element: <Navigate to='/browse' replace />,
	},
]);

export default function AppRouterProvider() {
	return <RouterProvider router={routers} />;
}
