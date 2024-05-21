import PageHeader from '@/components/PageHeader';
import { SaveIcon, SquareUserRoundIcon } from 'lucide-react';
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useWallet } from '@txnlab/use-wallet';
import Unauthorized from '@/components/Unauthorized';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { fetchProfile } from '@/utils/data';
import { toast } from 'sonner';

const formSchema = z.object({
	address: z.string().length(58),
	logo: z.string(),
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	url: z.string().url(),
	loyaltyEnabled: z.boolean(),
	loyaltyMultiplierEnabled: z.boolean(),
	loyaltyPercentage: z.number().min(0).max(100),
});

interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
	const { activeAddress } = useWallet();
	const [loadingFormData, setLoadingFormData] = React.useState<boolean>(true);
	const [retreivedProfile, setRetreivedProfile] = React.useState<z.infer<typeof formSchema>>({
		address: '',
		logo: '',
		title: '',
		description: '',
		url: '',
		loyaltyEnabled: true,
		loyaltyMultiplierEnabled: false,
		loyaltyPercentage: 5,
	});

	const [selectedAvatar, setSelectedAvatar] = React.useState<any>();
	const changeAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAvatar(e.target.files?.[0]);
	}

	useEffect(() => {
		const getProfileData = async () => {
			if (!activeAddress) return;
			setRetreivedProfile({ ...retreivedProfile, address: activeAddress });
			try {
				const profile = await fetchProfile(activeAddress);
				if (profile === null) throw new Error('Profile not found');
				if (profile === false) throw new Error('Failed to fetch profile data');
				setRetreivedProfile(profile);
				setLoadingFormData(false);
			} catch (error: any) {
				console.error(error);
				// CHECK IF PROFILE DOESN`T EXIST
				if (error.message === 'Profile not found') {
					setLoadingFormData(false);
				} else {
					toast.error('Failed to fetch profile data, trying again...');
					setTimeout(() => {
						getProfileData();
					}, 3000);
				}
			}
		};
		getProfileData();
	}, [activeAddress]);

	useEffect(() => {
		// UPDATE FORM DEFAULT VALUES
		form.reset({
			address: retreivedProfile.address,
			logo: retreivedProfile.logo,
			title: retreivedProfile.title,
			description: retreivedProfile.description,
			url: retreivedProfile.url,
			loyaltyEnabled: retreivedProfile.loyaltyEnabled,
			loyaltyMultiplierEnabled: retreivedProfile.loyaltyMultiplierEnabled,
			loyaltyPercentage: retreivedProfile.loyaltyPercentage,
		});
	}, [retreivedProfile]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const submitHandler = (values: z.infer<typeof formSchema>) => {
		console.log(values);
	};

	return activeAddress ? (
		<>
			<PageHeader
				icon={<SquareUserRoundIcon />}
				title="Create Your Profile"
				description="Let’s get your website ready to accept Algo payments. Please fill in the details below."
			/>
			<div className="padding flex flex-col lg:grid lg:grid-cols-3 gap-10">
				<section className="order-2 lg:order-1 lg:col-span-2">
					{loadingFormData ? (
						<>
							<div>loading...</div>
						</>
					) : (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(submitHandler)}
								className="space-y-8"
							>
								{/* ----- ADDRESS ----- */}
								<FormField
									control={form.control}
									name="address"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">Wallet Address</FormLabel>
											<FormControl>
												<Input
													readOnly
													className="bg-slate-50"
													{...field}
												/>
											</FormControl>
										</FormItem>
									)}
								/>
								<h2 className="font-semibold text-xl">Website Info</h2>
								{/* ----- LOGO ----- */}
								<FormField
									control={form.control}
									name="logo"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">Logo</FormLabel>
											<FormControl>
												<Input
													type="file"
													className="cursor-pointer"
													onChange={changeAvatarHandler}
												/>
											</FormControl>
											<input
												{...field}
												type="hidden"
											/>
											<FormDescription className="leading-relaxed text-sm">
												Upload your website’s logo here. This will be displayed on the payment gateway, providing a
												recognizable image for your users during transactions. Ensure the image is clear, has a high
												resolution, and represents your brand effectively. Supported formats are .jpg, .png, and
												.svg.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* ----- TITLE ----- */}
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">Title</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. My Awesome Shop"
													{...field}
												/>
											</FormControl>
											<FormDescription className="leading-relaxed text-sm">
												Enter the title of your website here. This title will be displayed on the payment gateway
												and will help users recognize your site during transactions. Ensure it accurately represents
												your website or brand.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* ----- URL ----- */}
								<FormField
									control={form.control}
									name="url"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">URL</FormLabel>
											<FormControl>
												<Input
													placeholder="e.g. https://awesome.shop"
													type="url"
													{...field}
												/>
											</FormControl>
											<FormDescription className="leading-relaxed text-sm">
												Enter the URL of your website here. This will be used to direct users back to your site
												after a successful transaction. Please ensure the URL is correct and starts with ‘http://’
												or ‘https://’.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* ----- DESCRIPTION ----- */}
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">Description</FormLabel>
											<FormControl>
												<Textarea
													placeholder="A short description about your website..."
													rows={5}
													{...field}
												/>
											</FormControl>
											<FormDescription className="leading-relaxed text-sm">
												Provide a brief description of your website here. This information will be visible to your
												users on the payment gateway and can help them understand more about your site and its
												offerings. Maximum 300 characters.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<h2 className="font-semibold text-xl">Loyalty Settings</h2>
								{/* ----- LOYALTY ----- */}
								<FormField
									control={form.control}
									name="loyaltyEnabled"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-5">
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="font-semibold cursor-pointer">
													Enable Loyalty Points Reward System
												</FormLabel>
											</div>
											<FormDescription className="leading-relaxed text-sm">
												When activated, your customers will earn loyalty points on their transactions based on the
												percentage you’ve set.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* ----- LOYALTY MULTIPLIER ----- */}
								<FormField
									control={form.control}
									name="loyaltyMultiplierEnabled"
									render={({ field }) => (
										<FormItem>
											<div className="flex items-center gap-5">
												<FormControl>
													<Switch
														checked={field.value}
														onCheckedChange={field.onChange}
													/>
												</FormControl>
												<FormLabel className="font-semibold cursor-pointer">
													Enable Loyalty Points Multiplier for Recent Transactions
												</FormLabel>
											</div>
											<FormDescription className="leading-relaxed text-sm">
												Toggle this switch to activate the loyalty points multiplier for users who have had a recent
												transaction. When activated, the regular loyalty points earned from a transaction will be
												multiplied by a certain amount, encouraging repeat transactions.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								{/* ----- LOYALTY PERCENTAGE ----- */}
								<FormField
									control={form.control}
									name="loyaltyPercentage"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="font-semibold">Loyalty Percentage</FormLabel>
											<FormControl>
												<Input
													type="number"
													step={5}
													min={0}
													max={100}
													placeholder="e.g. 5"
													{...field}
												/>
											</FormControl>
											<FormDescription className="leading-relaxed text-sm">
												This is the portion of each transaction, expressed as a percentage, that will be awarded to
												customers as loyalty points. For example, if set to 5%, a customer spending 100 Algo will
												earn 5 loyalty points.
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div>
									<p className="leading-relaxed text-sm mb-3">
										Once you submit, your payment profile will be created and you’ll be able to accept Algo payments on
										your website. You can always edit these details by connecting your wallet to Moth.
									</p>
									<Button variant="default">
										<SaveIcon className="h-4 w-4 mr-2" />
										Save Profile
									</Button>
								</div>
							</form>
						</Form>
					)}
				</section>
				<section className="order-1 lg:order-2 lg:col-span-1">hi</section>
			</div>
		</>
	) : (
		<Unauthorized />
	);
};

export default Profile;
