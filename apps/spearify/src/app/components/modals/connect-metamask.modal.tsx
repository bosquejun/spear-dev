import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "@spear/design-system";
import QRCode from "react-qr-code";

export default function MetamaskModal({
	open,
	qrLink,
	onOpenChange,
}: {
	open?: boolean;
	qrLink: string;
	onOpenChange: () => void;
}) {
	return (
		<Dialog open={open && Boolean(qrLink)} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>Connect Metamask</DialogTitle>
				<div className='flex items-center justify-center'>
					{Boolean(qrLink) && <QRCode value={qrLink} />}
				</div>
			</DialogContent>
		</Dialog>
	);
}
