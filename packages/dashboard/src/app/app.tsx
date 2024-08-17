import MainLayout from "./layout/main-layout";
import AppRouterProvider from "./providers/router-provider";

export function App() {
	return (
		<MainLayout>
			<AppRouterProvider />
			{/* <BrowsePage /> */}
		</MainLayout>
	);
}

export default App;
