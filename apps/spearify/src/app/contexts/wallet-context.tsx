import ScreenLoader from "@app/components/screen-loader";
import MetamaskIcon from "@assets/metamask.png";
import { Wallet } from "lucide-react";
import {
	createContext,
	PropsWithChildren,
	ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";
import { toast } from "sonner";
import MetamaskProvider, { useMetamask } from "./wallet-providers/metamask";

type State = {
	isConnected: boolean;
	isConnecting: boolean;
	isLoading: boolean;
	currentProvider?: WalletProvider;
	activeWallet?: string;
};

type WalletProvider = {
	name: "manual" | "metamask";
	hasInitialized: boolean;
	supported: boolean;
	icon: ReactNode;
};

export type WalletContext = {
	connectWallet: (provider: WalletProvider["name"]) => Promise<void>;
	walletProviders: WalletProvider[];
} & State;

const initialState: State = {
	isConnected: false,
	isConnecting: false,
	isLoading: true,
};

const WalletContext = createContext<WalletContext | null>(null);

const listWalletProviders: WalletProvider[] = [
	{
		name: "manual",
		hasInitialized: false,
		supported: false,
		icon: <Wallet size='33px' className='min-w-10 max-h-10 h-12 p-1' />,
	},
	{
		name: "metamask",
		hasInitialized: false,
		supported: true,
		icon: (
			<img
				src={MetamaskIcon}
				width={40}
				height='auto'
				className='min-w-10 max-h-10'
			/>
		),
	},
];

const findProvider = (
	providerName: WalletProvider["name"],
	providers: WalletProvider[]
) => providers.find((p) => p.name === providerName);

export default function WalletProvider({ children }: PropsWithChildren) {
	const [state, setState] = useState<State>(initialState);
	const { isLoading } = state;
	const metamaskContext = useMetamask();

	const walletProviders: WalletProvider[] = useMemo(
		() =>
			listWalletProviders.map((provider) => ({
				...provider,
				hasInitialized:
					provider.name === "metamask"
						? metamaskContext.hasInitialized
						: provider.hasInitialized,
			})),
		[metamaskContext.hasInitialized]
	);

	useEffect(() => {
		const provider = window.localStorage.getItem("wallet.provider");
		if (provider) {
			connectWallet(provider as WalletProvider["name"]);
		}
		setState((prev) => ({
			...prev,
			isLoading: false,
			isConnected: false,
		}));
	}, []);

	useEffect(() => {
		if (metamaskContext.isActive && metamaskContext.isConnected) {
			setState((prev) => ({
				...prev,
				isConnected: true,
				activeWallet: metamaskContext.selectedAccount,
			}));
		}
	}, [metamaskContext.isActive, metamaskContext.isConnected]);
	const connectWallet = useCallback(
		async (provider: WalletProvider["name"]) => {
			const targetProvider = findProvider(provider, walletProviders);
			if (!targetProvider) {
				toast.error("Invalid wallet provider");
				return;
			}
			setState((prev) => ({
				...prev,
				isConnecting: true,
				currentProvider: targetProvider,
			}));
			if (targetProvider.name === "metamask") {
				await metamaskContext.connectMetamask();
			}

			setState((prev) => ({
				...prev,
				isConnecting: false,
			}));

			window.localStorage.setItem("wallet.provider", provider);
		},
		[walletProviders]
	);

	return (
		<WalletContext.Provider
			value={{
				...state,
				connectWallet,
				walletProviders,
			}}
		>
			{children}

			<ScreenLoader open={isLoading} />
		</WalletContext.Provider>
	);
}

export function WalletProviders({ children }: PropsWithChildren) {
	return (
		<MetamaskProvider>
			<WalletProvider>{children}</WalletProvider>
		</MetamaskProvider>
	);
}

export const useWallet = () => {
	const ctx = useContext(WalletContext);
	if (!ctx) {
		throw new Error("useWallet must be used within WalletProvider");
	}

	return ctx;
};
