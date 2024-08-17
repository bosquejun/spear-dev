import SeedPhraseModal from "@app/components/modals/seed-phrase-modal";
import ScreenLoader from "@app/components/screen-loader";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserState = {
	loading: boolean;
	init: boolean;
	publicKey?: string;
};

type UserContext = {
	createNewAccount: () => string;
	verifySeedPhrase: (
		seedPhrase: string,
		toVerifyIndexes: number[],
		inputtedPhrases: string[]
	) => boolean;
} & Pick<UserState, "init" | "loading" | "publicKey">;

const initialState: UserState = {
	init: false,
	loading: true,
};

const UserContext = createContext<UserContext | null>(null);

export default function UserProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const [state, setState] = useState<UserState>(initialState);

	useEffect(() => {
		setTimeout(function () {
			setState({
				loading: false,
				init: true,
			});
		}, 2000);
	}, []);

	const verifySeedPhrase = (
		seedPhrase: string,
		toVerifyIndexes: number[],
		inputtedPhrases: string[]
	) => {
		const list = seedPhrase.split(" ");
		if (
			toVerifyIndexes.length !== inputtedPhrases.length ||
			!inputtedPhrases.length ||
			!toVerifyIndexes
		)
			return false;

		const verified = inputtedPhrases.every((phrase, i) => {
			const positionedPhrase = list[toVerifyIndexes[i] - 1];
			return positionedPhrase === phrase;
		});

		return verified;
	};

	const createNewAccount = () => {
		setState({
			...state,
			publicKey: "Abcs",
		});
		return "only start genius female prison corn human major track nation unusual excess tuition penalty black cotton defense useless finish small very cereal fiction recall";
	};

	const contextValue: UserContext = {
		...state,
		createNewAccount,
		verifySeedPhrase,
	};

	return (
		<UserContext.Provider value={contextValue}>
			<ScreenLoader open={state.loading} />
			{children}
			<SeedPhraseModal />
		</UserContext.Provider>
	);
}

// eslint-disable-next-line react-refresh/only-export-components
export const useUser = () => {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser must be used within UserProvider");
	}

	return context;
};
