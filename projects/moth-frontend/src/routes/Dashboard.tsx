import * as algokit from '@algorandfoundation/algokit-utils';
import PageHeader from '@/components/PageHeader';
import { getAlgodConfigFromViteEnvironment } from '@/utils/network/getAlgoClientConfigs';
import { useWallet } from '@txnlab/use-wallet';
import { LayoutDashboardIcon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Unauthorized from '@/components/Unauthorized';
import { Profile } from '@/utils/definitions';
import { convertAlgoProfile, fetchProfile, fetchProfileTransactions } from '@/utils/data';

const Dashboard = () => {
	const location = useLocation();
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
			fetchProfile(activeAddress, algodClient).then((profile) => {
				setProfile(convertAlgoProfile(profile, activeAddress));
				setLoadingProfile(false);
			});
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
				description="Welcome to your dashboard. Here you can view your account details, transactions, and more."
			/>
			{loadingProfile && <div>Loading p...</div>}
			{loadingTransactions && <div>Loading t...</div>}
			{JSON.stringify(transactions)}
			<div className="padding pb-0 flex flex-col lg:grid lg:grid-cols-3 gap-10">
				<section className="order-2 lg:order-1 lg:col-span-2">a</section>
				<section className="order-1 lg:order-2 lg:col-span-1">b</section>
			</div>
		</>
	) : (
		<Unauthorized />
	);
};

export default Dashboard;
