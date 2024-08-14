import {
	Button,
	Chip,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
} from "@spear/design-system";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import Show from "../show";
import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { useUser } from "@app/contexts/user-context";
import { getRandomElements, shuffleArray } from "@app/utils/array";

function MainView({
	onCreate,
	onImport,
}: {
	onCreate: () => void;
	onImport: () => void;
}) {
	return (
		<DialogContent hideCloseIcon>
			<DialogHeader>
				<DialogTitle>Account Setup</DialogTitle>
				<DialogDescription>
					Make changes to your profile here. Click save when you're
					done.
				</DialogDescription>
			</DialogHeader>
			<div className='grid gap-4 py-4'>
				<Button onClick={onCreate}>Create new account</Button>
				<Button onClick={onImport} variant={"outline"}>
					Import existing seed phrase
				</Button>
			</div>
		</DialogContent>
	);
}

function SetupView({ onBack }: { onBack: () => void }) {
	const [state, setState] = useState<{
		seedPhrase: string;
		step: number;
		verifyPhrases: string[];
		shuffledPhrases: string[];
		toVerifyIndexes: number[];
	}>({
		seedPhrase: "",
		step: 0,
		verifyPhrases: [],
		shuffledPhrases: [],
		toVerifyIndexes: [],
	});

	const {
		step,
		seedPhrase,
		shuffledPhrases,
		toVerifyIndexes,
		verifyPhrases,
	} = state;

	const loading = Boolean(seedPhrase === "");

	useEffect(() => {
		setTimeout(function () {
			setState({
				...state,
				seedPhrase:
					"only start genius female prison corn human major track nation unusual excess tuition penalty black cotton defense useless finish small very cereal fiction recall",
			});
		}, 100);
	}, []);

	const proceedVerification = () => {
		const count = 4;
		const phrases = [...seedPhrase.split(" ")];
		const verifyPhrase = getRandomElements(phrases, count);
		const indexes = verifyPhrase.map(
			(phrase) => phrases.indexOf(phrase) + 1
		);
		const shuffledPhrases = shuffleArray([
			...verifyPhrase,
			...getRandomElements(phrases, phrases.length - count),
		]);

		setState({
			...state,
			toVerifyIndexes: indexes,
			shuffledPhrases,
			step: 1,
		});
	};

	const isVerified = useMemo(() => {
		const list = seedPhrase.split(" ");
		if (toVerifyIndexes.length !== verifyPhrases.length || loading)
			return false;

		const verified = verifyPhrases.every((phrase, i) => {
			const positionedPhrase = list[toVerifyIndexes[i] - 1];
			return positionedPhrase === phrase;
		});

		return verified;
	}, [toVerifyIndexes, verifyPhrases, seedPhrase, loading]);

	return (
		<DialogContent hideCloseIcon className='max-w-xl'>
			<DialogHeader>
				<Show>
					<Show.When isTrue={step === 1}>
						<DialogTitle>Verify seed phrase</DialogTitle>
					</Show.When>
					<Show.Else>
						<DialogTitle>New seed phrase</DialogTitle>
					</Show.Else>
				</Show>
				<Show>
					<Show.When isTrue={step === 1}>
						<DialogDescription>
							To proceed, please verify your seed phrase by
							selecting the words at the following positions:{" "}
							<strong className='text-foreground'>
								{toVerifyIndexes.join(", ")}
							</strong>
							. Ensure that these words match the positions in
							your generated seed phrase to confirm its accuracy.
						</DialogDescription>
					</Show.When>
					<Show.Else>
						<DialogDescription>
							Your seed phrase has been generated. Please securely
							back up and store it to ensure access to your
							account. This phrase will only be shown once.
						</DialogDescription>
					</Show.Else>
				</Show>
			</DialogHeader>
			<div className='grid gap-4'>
				<Show>
					<Show.When isTrue={step === 1}>
						<div className='grid grid-cols-8 gap-1.5'>
							{shuffledPhrases.map((seed, i) => (
								<Chip
									key={i}
									onToggle={(value, toggled) => {
										if (toggled) {
											setState({
												...state,
												verifyPhrases: [
													...state.verifyPhrases,
													value as string,
												],
											});
										} else {
											const indexOf =
												state.verifyPhrases.indexOf(
													value as string
												);
											const _verifyPhrases = [
												...state.verifyPhrases,
											];

											_verifyPhrases.splice(indexOf, 1);

											setState({
												...state,
												verifyPhrases: _verifyPhrases,
											});
										}
									}}
									variant='outline'
									hideClose
								>
									{seed}
								</Chip>
							))}
						</div>
					</Show.When>
					<Show.Else>
						<div className='grid grid-cols-8 gap-1.5'>
							{(!loading
								? seedPhrase.split(" ")
								: [...new Array(24)].fill("_")
							).map((seed, i) => (
								<Chip
									loading={loading}
									key={i}
									variant='secondary'
									hideClose
								>
									{seed}
								</Chip>
							))}
						</div>
					</Show.Else>
				</Show>
				<Show>
					<Show.When isTrue={step === 0}>
						<div className='grid gap-2'>
							<Button
								variant='outline'
								onClick={() => {
									navigator.clipboard.writeText(
										seedPhrase.split(" ").join("\n")
									);
									toast("Copied seed phrase", {
										duration: 2000,
										icon: <Copy className='h-4 w-4' />,
									});
								}}
							>
								<Copy className='h-4 w-4 mr-2' />
								Copy
							</Button>
							<Button variant='outline' disabled>
								<Download className='h-4 w-4 mr-2' />
								Download
							</Button>
						</div>
					</Show.When>
				</Show>
			</div>
			<DialogFooter>
				<Button variant='ghost' onClick={onBack}>
					Back
				</Button>
				<Button
					onClick={proceedVerification}
					disabled={!seedPhrase || (!isVerified && step === 1)}
				>
					Next
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default function SeedPhraseModal() {
	const { init } = useUser();
	const [view, setView] = useState<"main" | "setup" | "import">("main");

	return (
		<Dialog open={init}>
			<Show>
				<Show.When isTrue={view === "setup"}>
					<SetupView
						onBack={() => {
							setView("main");
						}}
					/>
				</Show.When>
				<Show.Else>
					<MainView
						onCreate={() => {
							setView("setup");
						}}
						onImport={() => {
							setView("import");
						}}
					/>
				</Show.Else>
			</Show>
		</Dialog>
	);
}
