import { useAccount, useEnsName } from "wagmi";

export const useWalletProfile = () => {
	const { address } = useAccount();
	const { data, error, status } = useEnsName({ address });

	return {
		data,
		error,
		status,
	};
};
