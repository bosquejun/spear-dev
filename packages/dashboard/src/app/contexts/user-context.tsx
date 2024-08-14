import SeedPhraseModal from "@app/components/modals/seed-phrase-modal";
import ScreenLoader from "@app/components/screen-loader";
import React, { createContext, useContext, useEffect, useState } from "react";

type UserContext = {
	init: boolean;
	loading: boolean;
};

type UserState = {
	//
} & Pick<UserContext, "init" | "loading">;

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

	const contextValue: UserContext = {
		...state,
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
