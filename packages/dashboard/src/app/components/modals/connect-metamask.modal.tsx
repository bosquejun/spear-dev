import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@spear/design-system";
import QRCode from "react-qr-code";

export default function MetamaskModal({
	open,
	qrLink,
}: {
	open?: boolean;
	qrLink: string;
}) {
	return (
		<Dialog open={open}>
			<DialogContent hideCloseIcon>
				<DialogTitle>Connect Metamask</DialogTitle>
				<QRCode value={qrLink} />
			</DialogContent>
		</Dialog>
	);
}
