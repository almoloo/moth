import * as algokit from '@algorandfoundation/algokit-utils';
import { MothClient } from '@/contracts/Moth';
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';

import PageHeader from '@/components/PageHeader';
import { Loader, SaveIcon, SquareUserRoundIcon } from 'lucide-react';
import React, { ReactNode, useEffect } from 'react';
import { bigint, z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useWallet } from '@txnlab/use-wallet';
import Unauthorized from '@/components/Unauthorized';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import algosdk from 'algosdk';
import { convertAlgoProfile, fetchProfile } from '@/utils/data';
import { useLocation } from 'react-router-dom';

const formSchema = z.object({
	address: z.string().length(58),
	logo: z.string(),
	title: z.string().min(3).max(50),
	description: z.string().max(300),
	url: z.string().url(),
	loyaltyEnabled: z.boolean(),
	loyaltyMultiplierEnabled: z.boolean(),
	// loyaltyPercentage: z.number().min(0).max(100),
	loyaltyPercentage: z.string().refine((value) => !isNaN(Number(value)), {
		message: 'Please enter a valid number',
	}),
});

let appClient: MothClient | null = null;
interface ProfileProps {}

const Profile: React.FC<ProfileProps> = () => {
	const location = useLocation();
	const { signer, activeAddress } = useWallet();
	const algodConfig = getAlgodConfigFromViteEnvironment();
	const algodClient = algokit.getAlgoClient({
		server: algodConfig.server,
		port: algodConfig.port,
		token: algodConfig.token,
	});

	const [hasProfile, setHasProfile] = React.useState<boolean>(false);
	const [loadingFormData, setLoadingFormData] = React.useState<boolean>(true);
	const [loadingSubmit, setLoadingSubmit] = React.useState<boolean>(false);
	const [loadedProfile, setLoadedProfile] = React.useState<boolean>(false);
	const [loadingProfile, setLoadingProfile] = React.useState<boolean>(false);
	const sampleProfile = {
		address: '',
		logo: '',
		title: '',
		description: '',
		url: '',
		loyaltyEnabled: true,
		loyaltyMultiplierEnabled: false,
		loyaltyPercentage: '5',
	};
	const [retreivedProfile, setRetreivedProfile] = React.useState<z.infer<typeof formSchema>>(sampleProfile);
	const [demoProfile, setDemoProfile] = React.useState<z.infer<typeof formSchema>>(sampleProfile);

	const [selectedAvatar, setSelectedAvatar] = React.useState<any>();
	const changeAvatarHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedAvatar(e.target.files?.[0]);
	};

	useEffect(() => {
		const getProfileData = async () => {
			if (!activeAddress) return;
			setRetreivedProfile({ ...retreivedProfile, address: activeAddress });
			appClient = new MothClient(
				{
					sender: { signer, addr: activeAddress } as TransactionSignerAccount,
					resolveBy: 'id',
					id: Number(import.meta.env.VITE_APP_ID),
				},
				algodClient,
			);

			try {
				setLoadingProfile(true);
				const profile = await fetchProfile(activeAddress, algodClient);
				if (profile) {
					setRetreivedProfile({ ...retreivedProfile, ...convertAlgoProfile(profile, activeAddress!) });
					setHasProfile(true);
					setLoadedProfile(true);
					setLoadingProfile(false);
				}
			} catch (error: any) {
				console.error(error);
			} finally {
				setLoadingFormData(false);
			}
		};
		if (!loadedProfile && !loadingProfile) {
			getProfileData();
		}
	}, [location, activeAddress]);

	useEffect(() => {
		// UPDATE FORM DEFAULT VALUES
		const profileData = {
			address: retreivedProfile.address,
			logo: retreivedProfile.logo,
			title: retreivedProfile.title,
			description: retreivedProfile.description,
			url: retreivedProfile.url,
			loyaltyEnabled: retreivedProfile.loyaltyEnabled,
			loyaltyMultiplierEnabled: retreivedProfile.loyaltyMultiplierEnabled,
			loyaltyPercentage: retreivedProfile.loyaltyPercentage,
		};

		form.reset(profileData);
		setDemoProfile(profileData);
	}, [retreivedProfile]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
	});

	const submitHandler = async (values: z.infer<typeof formSchema>) => {
		setLoadingSubmit(true);
		const { appAddress, appId } = await appClient!.appClient.getAppReference();
		try {
			// UPLOAD AVATAR TO IPFS IF SELECTED
			if (selectedAvatar) {
				// UPLOAD TO IPFS
				const formData = new FormData();
				formData.append('file', selectedAvatar);
				const metadata = JSON.stringify({
					name: `${Date.now()}-${values.address}`,
				});
				formData.append('pinataMetadata', metadata);
				const options = JSON.stringify({
					cidVersion: 0,
				});
				formData.append('pinataOptions', options);

				const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
					method: 'POST',
					headers: {
						Authorization: `Bearer ${import.meta.env.VITE_PINATA_ACCESS_TOKEN}`,
					},
					body: formData,
				});

				const resData = await res.json();
				// SET values.logo TO IPFS HASH
				values.logo = resData.IpfsHash;
			}
			const calculateMbr = await appClient?.getMbr(
				{
					title: values.title,
					description: values.description,
					url: values.url,
					logo: values.logo,
					loyaltyEnabled: values.loyaltyEnabled,
					loyaltyPercentage: Number(values.loyaltyPercentage),
				},
				{
					sender: { signer, addr: activeAddress! },
					// boxes: [algosdk.decodeAddress(activeAddress!).publicKey],
					sendParams: {
						populateAppCallResources: true,
					},
				},
			);
			console.log('🎈', BigInt(calculateMbr?.return?.valueOf()!));
			const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from: activeAddress!,
				to: appAddress,
				amount:
					Number(calculateMbr?.return?.valueOf()!) > 0
						? BigInt(calculateMbr?.return?.valueOf()!)
						: algokit.microAlgos(100_000).valueOf(),
				suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
			});

			let profile;
			profile = await appClient!
				.editProfile(
					{
						boxMbrPayment: boxMBRPayment,
						title: values.title,
						description: values.description,
						url: values.url,
						logo: values.logo,
						loyaltyEnabled: values.loyaltyEnabled,
						loyaltyPercentage: Number(values.loyaltyPercentage),
					},
					{
						sender: { signer, addr: activeAddress! },
						boxes: [algosdk.decodeAddress(activeAddress!).publicKey],
					},
				)
				.catch((e: Error) => {
					console.error(`Error creating profile: ${e.message}`);
					toast.error(`Error creating profile: ${e.message}`);
					return null;
				});

			// if (!profile) {
			// const optIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
			// 	from: activeAddress!,
			// 	to: activeAddress!,
			// 	assetIndex: Number(import.meta.env.VITE_TOKEN_ID),
			// 	amount: 0,
			// 	suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
			// });
			// const optIncall = await appClient?.optIn({ optInTxn: optIn }, { sender: { signer, addr: activeAddress! } });
			// }
			// SAVE PROFILE DATA
			setRetreivedProfile({ ...retreivedProfile, ...convertAlgoProfile(profile?.return, activeAddress!) });
			setDemoProfile({ ...retreivedProfile, ...convertAlgoProfile(profile?.return, activeAddress!) });
			toast.success('Profile data saved successfully!');
		} catch (error) {
			console.error(error);
			toast.error('Failed to save profile data, please try again.');
		} finally {
			setLoadingSubmit(false);
		}
	};

	return activeAddress ? (
		<>
			<PageHeader
				icon={<SquareUserRoundIcon />}
				title="Create Your Profile"
				description="Let’s get your website ready to accept Algo payments. Please fill in the details below."
			/>
			<div className="padding pb-0 flex flex-col lg:grid lg:grid-cols-3 gap-10">
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
													disabled={loadingSubmit}
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
													disabled={loadingSubmit}
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
													disabled={loadingSubmit}
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
													disabled={loadingSubmit}
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
														disabled={loadingSubmit}
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
														disabled={loadingSubmit}
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
													disabled={loadingSubmit}
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
									<Button
										variant="default"
										disabled={loadingSubmit}
									>
										{loadingSubmit ? (
											<Loader className="h-4 w-4 mr-2 animate-spin" />
										) : (
											<SaveIcon className="h-4 w-4 mr-2" />
										)}
										Save Profile
									</Button>
								</div>
							</form>
						</Form>
					)}
				</section>
				<section className="order-1 lg:order-2 lg:col-span-1">
					{loadingFormData ? (
						<div>Loading...</div>
					) : (
						<div
							className={`border bg-slate-50 rounded p-10 flex-col items-center text-center ${
								demoProfile.title === '' && demoProfile.url === '' && demoProfile.description === '' ? 'hidden' : 'flex'
							}`}
						>
							{demoProfile.logo ? (
								<img
									src={`${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${demoProfile.logo}?pinataGatewayToken=${
										import.meta.env.VITE_PINATA_GATEWAY_KEY
									}`}
									alt={demoProfile.title}
									className="rounded-full w-24 h-24"
								/>
							) : (
								<div className="block shrink-0 rounded-full w-24 h-24"></div>
							)}
							<h2 className="text-lg font-bold mt-5">{demoProfile.title}</h2>
							<a
								href={demoProfile.url}
								className="text-rose-500 underline"
							>
								{demoProfile.url.replace('https://', '').replace('http://', '').replace('www.', '')}
							</a>
							<p className="text-neutral-600 text-sm leading-relaxed mt-5">"{demoProfile.description}"</p>
						</div>
					)}
				</section>
			</div>
		</>
	) : (
		<Unauthorized />
	);
};

export default Profile;
