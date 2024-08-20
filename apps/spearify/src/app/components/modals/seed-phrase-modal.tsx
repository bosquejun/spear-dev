/* eslint-disable @typescript-eslint/ban-ts-comment */
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

// @ts-ignore
// import initializeSpearCore from "@spear/core";

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

function SetupView({
	onBack,
	onComplete,
}: {
	onBack: () => void;
	onComplete: () => void;
}) {
	const { createNewAccount, verifySeedPhrase } = useUser();
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
		const seedPhrase = createNewAccount();
		setTimeout(function () {
			setState({
				...state,
				seedPhrase,
			});
		}, 500);
	}, []);

	const isVerified = useMemo(() => {
		if (loading) return false;

		const verified = verifySeedPhrase(
			seedPhrase,
			toVerifyIndexes,
			verifyPhrases
		);

		return verified;
	}, [toVerifyIndexes, verifyPhrases, seedPhrase, loading]);

	const proceedVerification = () => {
		if (isVerified || verifyPhrases.length === 4) {
			onComplete();
			return;
		}

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
						<div className='grid gap-2 grid-cols-2'>
							<Button variant='ghost' disabled>
								<Download className='h-4 w-4 mr-2' />
								Download
							</Button>
							<Button
								variant='ghost'
								onClick={() => {
									navigator.clipboard.writeText(
										// seedPhrase.split(" ").join("\n")
										seedPhrase
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
					// disabled={!seedPhrase || (!isVerified && step === 1)}
					disabled={!seedPhrase}
				>
					Next
				</Button>
			</DialogFooter>
		</DialogContent>
	);
}

export default function SeedPhraseModal() {
	const { init } = useUser();
	const [showModal, setShowModal] = useState(init);
	const [view, setView] = useState<"main" | "setup" | "import">("main");

	return (
		<Dialog open={showModal}>
			<Show>
				<Show.When isTrue={view === "setup"}>
					<SetupView
						onBack={() => {
							setView("main");
						}}
						onComplete={() => {
							setShowModal(false);
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
