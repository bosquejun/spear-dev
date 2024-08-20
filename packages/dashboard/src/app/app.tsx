import MainLayout from "./layout/main-layout";
import HomeContent from "./pages/home/content";

export function App() {
	return (
		<MainLayout>
			{/* <AppRouterProvider /> */}
			{/* <BrowsePage /> */}
			<HomeContent />
		</MainLayout>
	);
}

export default App;
