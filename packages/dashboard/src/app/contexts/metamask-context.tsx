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

type MetamaskContext = {
	connect(): Promise<void>;
	accounts: [];
};

const MetamaskContext = createContext<MetamaskContext | null>(null);

export default function MetamaskProvider({
	children,
}: {
	children: ReactNode;
}) {
	const sdk = useRef<MetaMaskSDK>();
	const [connectInfo, setConnectInfo] = useState<{
		qrLink?: string;
		connecting: boolean;
	}>({
		connecting: false,
	});

	useEffect(() => {
		if (sdk.current) {
			console.log(sdk.current.getWalletStatus());
			return;
		}
		sdk.current = new MetaMaskSDK({
			shouldShimWeb3: false,
			storage: {
				enabled: true,
			},
			dappMetadata: {
				name: "NFT P2P",
				url: "https://www.electronjs.org/",
			},
			modals: {
				install: ({ link }: { link: string }) => {
					setConnectInfo({
						qrLink: link,
						connecting: true,
					});
					return {};
				},
				otp: () => {
					debugger;
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
	}, [sdk.current]);

	console.log(sdk.current);

	return (
		<MetamaskContext.Provider
			value={{
				connect: async () => {
					if (!sdk?.current) {
						return;
					}
					const accounts = await sdk.current?.connect();

					console.log(accounts);
				},
				accounts: [],
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
				open={connectInfo.connecting}
				qrLink={connectInfo.qrLink as string}
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
