import * as algokit from '@algorandfoundation/algokit-utils';
import PageHeader from '@/components/PageHeader';
import { getAlgodConfigFromViteEnvironment } from '@/utils/network/getAlgoClientConfigs';
import { useWallet } from '@txnlab/use-wallet';
import { HistoryIcon, LayoutDashboardIcon, LoaderIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Unauthorized from '@/components/Unauthorized';
import { Profile } from '@/utils/definitions';
import { convertAlgoProfile, fetchProfile, fetchProfileTransactions } from '@/utils/data';
import { ellipseAddress } from '@/utils/ellipseAddress';

const Dashboard = () => {
	const { activeAddress } = useWallet();

	const algodConfig = getAlgodConfigFromViteEnvironment();
	const algodClient = algokit.getAlgoClient({
		server: algodConfig.server,
		port: algodConfig.port,
		token: algodConfig.token,
	});

	const [loadingProfile, setLoadingProfile] = useState(true);
	const [loadingTransactions, setLoadingTransactions] = useState(true);
	const [profile, setProfile] = useState<Profile | null>(null);
	const [transactions, setTransactions] = useState<any[]>([]);

	useEffect(() => {
		if (activeAddress) {
			try {
				fetchProfile(activeAddress, algodClient).then((profile) => {
					setProfile(convertAlgoProfile(profile, activeAddress));
				});
			} catch (error) {
				console.error(error);
			} finally {
				setLoadingProfile(false);
			}
		}
	}, [activeAddress, algodClient]);

	useEffect(() => {
		if (activeAddress) {
			fetchProfileTransactions(activeAddress).then((transactions) => {
				setTransactions(transactions.transactions);
				setLoadingTransactions(false);
			});
		}
	}, [activeAddress]);

	return activeAddress ? (
		<>
			<PageHeader
				icon={<LayoutDashboardIcon />}
				title="Dashboard"
				description="Welcome to your dashboard. Here you can view your account details and transactions."
			/>
			{loadingProfile && <div>Loading p...</div>}

			<div className="padding pb-0 flex flex-col lg:grid lg:grid-cols-3 gap-10">
				<section className="order-2 lg:order-1 lg:col-span-2">
					{loadingTransactions ? (
						<div className="flex justify-center py-5">
							<LoaderIcon className="animate-spin h-10 w-10 text-neutral-600" />
						</div>
					) : (
						<div className="flex flex-col gap-3">
							<h2 className="font-bold text-lg mb-3">
								<HistoryIcon className="inline-block text-neutral-600 w-6 h-6 mr-2" />
								Transactions History
							</h2>
							{transactions.length > 0 ? (
								<>
									{transactions
										.filter((transaction) => transaction['inner-txns'].length === 2)
										.map((transaction) => (
											<div
												className="flex flex-col border rounded border-l-4 p-3 gap-3"
												key={transaction.id}
											>
												<div className="flex items-center gap-3">
													<span className="text-neutral-600">From</span>
													<span className="border-b border-dashed grow"></span>
													<a
														href={`https://testnet.explorer.perawallet.app/address/${transaction.sender}/`}
														className="text-rose-500 hover:text-rose-600"
													>
														{ellipseAddress(transaction.sender)}
													</a>
												</div>
												<div className="flex items-center gap-3">
													<span className="text-neutral-600">Received</span>
													<span className="border-b border-dashed grow"></span>
													<span>
														{(
															transaction['inner-txns']
																.filter((innerTxn: any) => innerTxn['tx-type'] === 'pay')
																.map((innerTxn: any) => innerTxn['payment-transaction'].amount) * 0.000001
														).toFixed(6)}{' '}
														Algo
													</span>
												</div>
												<div className="flex items-center gap-3">
													<span className="text-neutral-600">
														{transaction['inner-txns']
															.filter((innerTxn: any) => innerTxn['tx-type'] === 'axfer')
															.map((innerTxn: any) =>
																innerTxn['asset-transfer-transaction'].receiver === transaction.sender
																	? 'Dispensed'
																	: 'Spent',
															)}{' '}
														tokens
													</span>
													<span className="border-b border-dashed grow"></span>
													<span>
														{transaction['inner-txns']
															.filter((innerTxn: any) => innerTxn['tx-type'] === 'axfer')
															.map((innerTxn: any) => innerTxn['asset-transfer-transaction'].amount)
															.reduce((a: number, b: number) => a + b, 0)}{' '}
														Mak
													</span>
												</div>
											</div>
										))}
								</>
							) : (
								<div className="text-center">
									<h2 className="text-lg font-bold">No transactions found</h2>
									<p className="text-neutral-600 text-sm leading-relaxed mt-5">
										You have not made any transactions yet. Once you make a transaction, it will appear here.
									</p>
								</div>
							)}
						</div>
					)}
				</section>
				<section className="order-1 lg:order-2 lg:col-span-1">
					{loadingProfile ? (
						<div className="flex justify-center py-5">
							<LoaderIcon className="animate-spin h-10 w-10 text-neutral-600" />
						</div>
					) : (
						<>
							{profile ? (
								<div
									className={`flex-col items-center text-center ${
										profile?.title === '' && profile?.url === '' && profile?.description === '' ? 'hidden' : 'flex'
									}`}
								>
									{profile?.logo ? (
										<img
											src={`${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${profile?.logo}?pinataGatewayToken=${
												import.meta.env.VITE_PINATA_GATEWAY_KEY
											}`}
											alt={profile?.title}
											className="rounded-full w-24 h-24"
										/>
									) : (
										<div className="block shrink-0 rounded-full w-24 h-24"></div>
									)}
									<h2 className="text-lg font-bold mt-5">{profile?.title}</h2>
									<a
										href={profile?.url}
										className="text-rose-500 underline"
									>
										{profile?.url.replace('https://', '').replace('http://', '').replace('www.', '')}
									</a>
									<p className="text-neutral-600 text-sm leading-relaxed mt-5">"{profile?.description}"</p>
								</div>
							) : (
								<div className="text-center">
									<h2 className="text-lg font-bold">No profile found</h2>
									<p className="text-neutral-600 text-sm leading-relaxed mt-5">
										You have not set up a profile yet. You can set up your profile in the{' '}
										<a
											href="/profile"
											className="text-rose-500 underline"
										>
											profile
										</a>{' '}
										section.
									</p>
								</div>
							)}
						</>
					)}
				</section>
			</div>
		</>
	) : (
		<Unauthorized />
	);
};

export default Dashboard;
