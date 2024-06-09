import Logo from '@/components/Logo';
import { Skeleton } from '@/components/ui/skeleton';
import { Profile } from '@/utils/definitions';
import { BracesIcon, ExternalLinkIcon, WalletIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import algosdk from 'algosdk';
import { useWallet } from '@txnlab/use-wallet';
import { TransactionSignerAccount } from '@algorandfoundation/algokit-utils/types/account';
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs';
import * as algokit from '@algorandfoundation/algokit-utils';
import { MothClient } from '@/contracts/Moth';
import { convertAlgoProfile, fetchProfile } from '@/utils/data';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ConnectButton from '@/components/ConnectButton';

interface GatewayProps {}

const Gateway: React.FC<GatewayProps> = () => {
	const { address, amount, returnUrl } = useParams();
	const { signer, activeAddress, getAssets } = useWallet();
	const algodConfig = getAlgodConfigFromViteEnvironment();
	const algodClient = algokit.getAlgoClient({
		server: algodConfig.server,
		port: algodConfig.port,
		token: algodConfig.token,
	});

	const [loading, setLoading] = useState<boolean>(true);
	const [loadingProfile, setLoadingProfile] = useState<boolean>(false);
	const [loadingGS, setLoadingGS] = useState<boolean>(false);
	const [gatewayProfile, setGatewayProfile] = useState<Profile | null>(null);
	const [userPoints, setUserPoints] = useState<number>(0);
	const [globalState, setGlobalState] = useState<any>(null);
	const [paymentMethod, setPaymentMethod] = useState<'full' | 'points'>('full');

	useEffect(() => {
		const getProfileData = async () => {
			setLoadingProfile(true);

			try {
				const profile = await fetchProfile(address!, algodClient);
				if (profile) {
					setGatewayProfile(convertAlgoProfile(profile, address!));
				}
				setLoading(false);
			} catch (error) {
				console.error(error);
				toast.error('Failed to fetch profile');
			} finally {
				setLoading(false);
				setLoadingProfile(false);
			}
		};
		if (!loadingProfile) {
			getProfileData();
		}
	}, []);

	useEffect(() => {
		const getAppClient = async () => {
			setLoadingGS(true);
			const appClient = new MothClient(
				{
					// sender: { signer, addr: activeAddress } as TransactionSignerAccount,
					resolveBy: 'id',
					id: Number(import.meta.env.VITE_APP_ID),
				},
				algodClient,
			);
			const globalS = await appClient.getGlobalState();
			setGlobalState(globalS);
			setLoadingGS(false);
		};
		if (!loadingGS && activeAddress) {
			getAppClient();
		}
	}, [activeAddress]);

	useEffect(() => {
		const getUserTokens = async () => {
			const assets = await getAssets();
			const tokenId = globalState.royaltyPointToken?.asNumber();
			assets
				.filter((asset) => asset['asset-id'] === tokenId)
				.map((asset) => {
					setUserPoints(asset.amount);
					if (asset.amount > 0) {
						setPaymentMethod('points');
					}
				});
		};
		if (globalState && activeAddress) {
			getUserTokens();
		}
	}, [globalState]);

	const handleOptIn = async (appClient: MothClient) => {
		console.log('Opting in');

		const optIn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
			from: activeAddress!,
			to: activeAddress!,
			assetIndex: globalState.royaltyPointToken?.asNumber(),
			amount: 0,
			suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
		});
		const optIncall = await appClient?.optIn({ optInTxn: optIn }, { sender: { signer, addr: activeAddress! } });
		return await optIncall?.return?.valueOf();
	};

	const handleFullPayment = async () => {
		try {
			console.log('Full payment');
			const appClient = new MothClient(
				{
					sender: { signer, addr: activeAddress } as TransactionSignerAccount,
					resolveBy: 'id',
					id: Number(import.meta.env.VITE_APP_ID),
				},
				algodClient,
			);

			const assetInfo = await algokit.getAccountAssetInformation(
				activeAddress!,
				globalState.royaltyPointToken?.asNumber(),
				algodClient,
			);
			if (Number(assetInfo.balance.valueOf()) === 0) {
				await handleOptIn(appClient);
			}

			const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
				from: activeAddress!,
				to: import.meta.env.VITE_APP_ADDRESS,
				amount: Number(amount),
				suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
			});

			const info = await algokit.getAccountInformation(activeAddress!, algodClient);
			console.log('info', info);
			const tx = await appClient.gatewayFull(
				{ payment: paymentTxn, amount: Number(amount), toAddress: address! },
				{
					sender: { signer, addr: activeAddress! },
					sendParams: { fee: algokit.microAlgos(3_000) },
					boxes: [algosdk.decodeAddress(activeAddress!).publicKey],
				},
			);
			console.log(tx);
			// const def = (await algokit.getAccountInformation(activeAddress!, algodClient)).amount - info.amount;
		} catch (error) {
			console.error(error);
			toast.error('Failed to opt-in to token');
		}
	};

	const handlePointsPayment = async () => {
		console.log('Points payment');
	};

	const UnauthorizedUser: React.FC = () => {
		return (
			<div className="flex flex-col gap-4">
				<p className="text-neutral-600 text-center">
					To proceed with your transaction and utilize your points, connect your Algorand wallet. This will allow you the
					flexibility to view, use, and manage your points.
				</p>
				<ConnectButton standAlone />
			</div>
		);
	};

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
							<Skeleton className="w-36 h-6 rounded mt-3" />
							<Skeleton className="w-24 h-4 rounded mt-2 mb-4" />
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
								className="w-24 h-24 rounded-full bg-slate-50"
							/>
							<h2 className="text-lg font-bold mt-3">{gatewayProfile?.title}</h2>
							<Button
								variant="link"
								size="sm"
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
							<p className="text-sm text-neutral-500">{gatewayProfile?.description}</p>
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
								<div className="flex items-center gap-3">
									<span className="text-neutral-600">Amount:</span>
									<span className="border-b border-dashed grow"></span>
									<span className="ml-auto">{amount} ALGO</span>
								</div>
								{gatewayProfile?.loyaltyEnabled && (
									<div className="flex items-center gap-3">
										<span className="text-neutral-600">Points:</span>
										<span className="border-b border-dashed grow"></span>
										<span className="ml-auto">{gatewayProfile?.loyaltyPercentage} mak</span>
									</div>
								)}
							</div>
							<div className="mt-auto">
								{activeAddress ? (
									<>
										<div className="flex items-center justify-between text-xs">
											<span className="text-neutral-600">Available Points</span>
											<span>{userPoints} mak</span>
										</div>
										{gatewayProfile?.loyaltyEnabled && (
											<div className="my-4">
												{userPoints > 0 && (
													<>
														<input
															type="radio"
															name="usePoints"
															id="usePoints"
															className="points-radio hidden"
															checked
															onChange={() => setPaymentMethod('points')}
														/>
														<label
															htmlFor="usePoints"
															className="points-label"
														>
															<div className="flex items-center justify-between grow mr-3">
																<strong className="text-sm">Redeem Points</strong>
																<div className="flex flex-col items-end gap-1">
																	<small className="text-rose-500">-{userPoints} mak</small>
																	<small>8.25 ALGO</small>
																</div>
															</div>
															<span className="points-radio-circle"></span>
														</label>
													</>
												)}
												<input
													type="radio"
													name="usePoints"
													id="dontUsePoints"
													className="points-radio hidden"
													checked={userPoints === 0}
													onChange={() => setPaymentMethod('full')}
												/>
												<label
													htmlFor="dontUsePoints"
													className="points-label"
												>
													<div className="flex items-center justify-between grow mr-3">
														<strong className="text-sm">Full Payment</strong>
														<div className="flex flex-col items-end gap-1">
															{gatewayProfile.loyaltyEnabled && (
																<small className="text-emerald-500">
																	+{gatewayProfile?.loyaltyPercentage} mak
																</small>
															)}
															<small>15 ALGO</small>
														</div>
													</div>
													<span className="points-radio-circle"></span>
												</label>
											</div>
										)}
										<Button
											className="w-full"
											disabled={loadingGS}
											onClick={paymentMethod === 'full' ? handleFullPayment : handlePointsPayment}
										>
											Pay {amount} ALGO
										</Button>
									</>
								) : (
									<UnauthorizedUser />
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
