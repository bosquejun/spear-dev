/* eslint-disable @typescript-eslint/no-explicit-any */
import MetamaskModal from "@app/components/modals/connect-metamask.modal";
import ScreenLoader from "@app/components/screen-loader";
import Show from "@app/components/show";
import MetaMaskSDK from "@metamask/sdk";
import {
	createContext,
	ReactNode,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

type State = {
	hasInitialized: boolean;
	isActive: boolean;
	accounts: string[];
	selectedAccount?: string;
	qrLink?: string;
	isConnecting: boolean;
	isConnected: boolean;
};

type MetamaskContext = {
	connectMetamask(): Promise<void>;
} & State;

const MetamaskContext = createContext<MetamaskContext | null>(null);

export default function MetamaskProvider({
	children,
}: {
	children: ReactNode;
}) {
	const sdk = useRef<MetaMaskSDK>();
	const [state, setState] = useState<State>({
		accounts: [],
		hasInitialized: false,
		isActive: false,
		isConnecting: false,
		isConnected: false,
	});

	useEffect(() => {
		// if (sdk.current) {
		// 	sdk.current.connect().then(console.log);
		// 	const status = sdk.current.getWalletStatus();
		// 	console.log(status);
		// 	debugger;
		// 	return;
		// }
		sdk.current = new MetaMaskSDK({
			shouldShimWeb3: false,
			storage: {
				enabled: true,
			},
			dappMetadata: {
				name: "Spearify",
				url: "https://spearify.io",
			},
			modals: {
				install: () => {
					return {
						mount(link) {
							console.log("mounting,", { link });
							setState((prev) => ({
								...prev,
								qrLink: link,
								isConnecting: true,
							}));
						},
						unmount: (shouldTerminate) => {
							if (!shouldTerminate) {
								setState((prev) => ({
									...prev,
									qrLink: undefined,
									isConnecting: false,
								}));
							} else {
								console.log("Should terminate whatt??");
							}
						},
					};
				},
				otp: () => {
					return {
						updateOTPValue: (otpValue: string) => {
							console.log({ otpValue });
							// if (otpValue !== '') {
							//   otpDOM.innerText = otpValue;
							// }
						},
					};
				},
			},
		});

		setState((prev) => ({
			...prev,
			hasInitialized: true,
		}));
	}, []);

	return (
		<MetamaskContext.Provider
			value={{
				...state,
				connectMetamask: async () => {
					if (!sdk?.current) {
						return;
					}
					try {
						const accounts = await sdk.current?.connect();
						setState({
							...state,
							accounts,
							selectedAccount: accounts[0],
							isConnected: true,
							isActive: true,
						});
					} catch {
						setState({
							...state,
							accounts: [],
							selectedAccount: undefined,
							isConnected: false,
						});
					}
				},
			}}
		>
			<Show>
				<Show.When isTrue={Boolean(sdk.current !== null)}>
					{children as ReactNode}
				</Show.When>
				<Show.Else>
					<ScreenLoader />
				</Show.Else>
			</Show>
			<MetamaskModal
				open={state.isConnecting}
				qrLink={state.qrLink!}
				onOpenChange={() => {
					// setConnectInfo({
					// 	...connectInfo,
					// 	connecting: !connectInfo.connecting,
					// });
				}}
			/>
		</MetamaskContext.Provider>
	);
}

export const useMetamask = () => {
	const context = useContext(MetamaskContext);

	if (!context) {
		throw new Error("useMetamask not allowed");
	}

	return context;
};
