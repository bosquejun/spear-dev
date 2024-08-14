import { Dialog, DialogContent } from "@spear/design-system";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Loader } from "lucide-react";

export default function ScreenLoader({ open }: { open: boolean }) {
	return (
		<Dialog open={open}>
			<DialogContent hideCloseIcon className='w-26 h-26 p-4'>
				<DialogTitle className='hidden' />
				<Loader className='animate-spinner' />
			</DialogContent>
		</Dialog>
	);
}
