import { useMetamask } from "@app/contexts/metamask-context";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Label,
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger,
} from "@spear/design-system";

export default function HomeContent() {
	const { connect } = useMetamask();
	return (
		<Tabs defaultValue='account' className='w-full gap-3 flex flex-col'>
			<TabsList className='grid w-full grid-cols-2 max-w-[40%]'>
				<TabsTrigger value='account'>Live</TabsTrigger>
				<TabsTrigger value='password'>History</TabsTrigger>
			</TabsList>
			<TabsContent value='account'>
				<Card>
					<CardHeader>
						<CardTitle>Account</CardTitle>
						<CardDescription>
							Make changes to your account here. Click save when
							you're done.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-2'>
						<div className='space-y-1'>
							<Label htmlFor='name'>Name</Label>
							<Input id='name' defaultValue='Pedro Duarte' />
						</div>
						<div className='space-y-1'>
							<Label htmlFor='username'>Username</Label>
							<Input id='username' defaultValue='@peduarte' />
						</div>
					</CardContent>
					<CardFooter>
						<Button
							onClick={() => {
								connect();
							}}
						>
							Save changes
						</Button>
					</CardFooter>
				</Card>
			</TabsContent>
			<TabsContent value='password'>
				<Card>
					<CardHeader>
						<CardTitle>Password</CardTitle>
						<CardDescription>
							Change your password here. After saving, you'll be
							logged out.
						</CardDescription>
					</CardHeader>
					<CardContent className='space-y-2'>
						<div className='space-y-1'>
							<Label htmlFor='current'>Current password</Label>
							<Input id='current' type='password' />
						</div>
						<div className='space-y-1'>
							<Label htmlFor='new'>New password</Label>
							<Input id='new' type='password' />
						</div>
					</CardContent>
					<CardFooter>
						<Button>Save password</Button>
					</CardFooter>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
