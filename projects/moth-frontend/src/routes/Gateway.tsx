import Logo from '@/components/Logo';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/utils/definitions';
import { BracesIcon, ExternalLinkIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet';
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';
import * as algokit from '@algorandfoundation/algokit-utils';
import { MothClient } from '@/contracts/Moth';
import { convertAlgoProfile } from '@/utils/data';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface GatewayProps {}

const Gateway: React.FC<GatewayProps> = () => {
	const { address, amount, returnUrl } = useParams();
	const { signer, activeAddress } = useWallet();
	const algodConfig = getAlgodConfigFromViteEnvironment();
	const algodClient = algokit.getAlgoClient({
		server: algodConfig.server,
		port: algodConfig.port,
		token: algodConfig.token,
	});

	const [loading, setLoading] = useState<boolean>(true);
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
	const [gatewayProfile, setGatewayProfile] = useState<Profile | null>(null);
	const [userPoints, setUserPoints] = useState<number>(0);

	useEffect(() => {
		const getProfileData = async () => {
			setLoadingProfile(true);
			const appClient = new MothClient(
				{
					sender: { signer, addr: activeAddress } as TransactionSignerAccount,
					resolveBy: 'id',
					id: Number(import.meta.env.VITE_APP_ID),
				},
				algodClient,
			);

			try {
				const profile = await appClient.getProfile(
					{ address: address! },
					{
						sender: { signer, addr: activeAddress! },
						boxes: [algosdk.decodeAddress(address!).publicKey],
					},
				);
				if (profile) {
					setGatewayProfile(convertAlgoProfile(profile, address!));
					setLoading(false);
				}
			} catch (error) {
				console.error(error);
				toast.error('Failed to fetch profile');
			} finally {
				setLoading(false);
				setLoadingProfile(false);
			}
		};
		if (!loadingProfile && activeAddress) {
			getProfileData();
		}
	}, [activeAddress]);

	return (
		<div className="gateway-container px-[50px] lg:px-[300px] flex flex-col justify-center">
			<header className="py-[25px] lg:py-[50px] self-center">
				<Link to="/">
					<Logo className="h-6 text-rose-500" />
				</Link>
			</header>
			<main className="grow bg-white border rounded-lg shadow flex flex-col lg:grid lg:grid-cols-2">
				<section className="p-[25px] lg:p-[50px] flex flex-col items-center justify-center">
					{loading ? (
						<>
							<Skeleton className="w-24 h-24 rounded-full" />
							<Skeleton className="w-36 h-6 rounded" />
							<Skeleton className="w-24 h-4 rounded" />
							<div className="flex flex-col items-center gap-2">
								<Skeleton className="w-44 h-4 rounded" />
								<Skeleton className="w-44 h-4 rounded" />
								<Skeleton className="w-36 h-4 rounded" />
							</div>
						</>
					) : (
						<>
							<img
								src={`${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${gatewayProfile?.logo}?pinataGatewayToken=${
									import.meta.env.VITE_PINATA_GATEWAY_KEY
								}`}
								alt={gatewayProfile?.title}
								className="w-24 h-24 rounded-full"
							/>
							<h2 className="text-lg font-bold mt-3">{gatewayProfile?.title}</h2>
							<Button
								variant="link"
								size="sm"
								// asChild
								className="bg-rose-500 text-white py-0 mt-1 mb-4"
								asChild
							>
								<Link
									to={gatewayProfile?.url!}
									target="_blank"
									className="flex items-center"
								>
									<ExternalLinkIcon className="h-4 w-4 mr-2" />
									{
										gatewayProfile?.url
											.replace(/(^\w+:|^)\/\//, '')
											.replace('www.', '')
											.split('/')[0]
									}
								</Link>
							</Button>
							<p className="text-sm text-neutral-500">"{gatewayProfile?.description}"</p>
						</>
					)}
				</section>
				<section className="p-[25px] lg:p-[50px] lg:border-l flex flex-col gap-4">
					{loading ? (
						<>
							<Skeleton className="w-48 h-6 rounded self-center" />
							<Skeleton className="w-full h-24 rounded" />
							<Skeleton className="w-full h-10 rounded mt-auto" />
						</>
					) : (
						<>
							<h2 className="text-lg font-bold mt-3 self-center">Purchase Information</h2>
							<div className="flex flex-col border-t border-b text-sm font-semibold gap-5 py-5 my-5">
								<div className="flex items-center">
									<span className="text-neutral-600">Amount:</span>
									<span className="border-b border-dashed grow"></span>
									<span className="ml-auto">{amount} ALGO</span>
								</div>
								<div className="flex items-center">
									<span className="text-neutral-600">Points:</span>
									<span className="border-b border-dashed grow"></span>
									<span className="ml-auto">5 mpt</span>
								</div>
							</div>
							<div className="mt-auto">
								{activeAddress ? (
									<>
										<div className="flex items-center justify-between text-xs">
											<span className="text-neutral-600">Available Points</span>
											<span>{userPoints} mpt</span>
										</div>
										<div className="my-4">
											<input
												type="radio"
												name="usePoints"
												id="usePoints"
												className="points-radio hidden"
												checked
											/>
											<label
												htmlFor="usePoints"
												className="points-label"
											>
												<div className="flex items-center justify-between grow mr-3">
													<strong className="text-sm">Redeem Points</strong>
													<div className="flex flex-col items-end gap-1">
														<small className="text-rose-500">-{userPoints} mpt</small>
														<small>8.25 ALGO</small>
													</div>
												</div>
												<span className="points-radio-circle"></span>
											</label>
											<input
												type="radio"
												name="usePoints"
												id="dontUsePoints"
												className="points-radio hidden"
												checked
											/>
											<label
												htmlFor="dontUsePoints"
												className="points-label"
											>
												<div className="flex items-center justify-between grow mr-3">
													<strong className="text-sm">Full Payment</strong>
													<div className="flex flex-col items-end gap-1">
														<small className="text-emerald-500">+{gatewayProfile?.loyaltyPercentage} mpt</small>
														<small>15 ALGO</small>
													</div>
												</div>
												<span className="points-radio-circle"></span>
											</label>
										</div>
										<Button className="w-full">Pay {amount} ALGO</Button>
									</>
								) : (
									<>
										<p>
											To proceed with your transaction and utilize your points, connect your Algorand wallet. This
											will allow you the flexibility to view, use, and manage your points.
										</p>
										<Button>Connect</Button>
									</>
								)}
							</div>
						</>
					)}
				</section>
			</main>
			<footer className="py-[25px] lg:py-[50px] flex items-center self-center gap-1">
				<BracesIcon className="h-4 w-4 text-rose-300" />
				<p className="leading-none text-sm text-rose-50">
					Designed and Developed by <Link to="https://github.com/almoloo">@almoloo</Link>
					{' & '}
					<Link to="https://github.com/Hossein-79">@Hossein-79</Link>
					{'.'}
				</p>
			</footer>
		</div>
	);
};

export default Gateway;
