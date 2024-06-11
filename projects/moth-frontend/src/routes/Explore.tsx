import * as algokit from '@algorandfoundation/algokit-utils';
import { getAlgodConfigFromViteEnvironment } from '@/utils/network/getAlgoClientConfigs';
import { useWallet } from '@txnlab/use-wallet';
import React, { useEffect, useState } from 'react';
import type { BoxesResponse, BoxDescriptor } from 'algosdk/dist/types/client/v2/algod/models/types';
import algosdk from 'algosdk';
import { convertAlgoProfile } from '@/utils/data';
import { Profile } from '@/utils/definitions';
import { Skeleton } from '@/components/ui/skeleton';
import { ExternalLinkIcon, TelescopeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface ExploreProps {}

const Explore: React.FC<ExploreProps> = () => {
	const { activeAddress } = useWallet();

	const [boxes, setBoxes] = useState<Profile[]>([]);
	const [loadingBoxes, setLoadingBoxes] = useState(true);

	const algodConfig = getAlgodConfigFromViteEnvironment();
	const algodClient = algokit.getAlgoClient({
		server: algodConfig.server,
		port: algodConfig.port,
		token: algodConfig.token,
	});

	useEffect(() => {
		if (activeAddress) {
			const getBox = async () => {
				const boxResponse = await algodClient.getApplicationBoxes(import.meta.env.VITE_APP_ID).do();
				const boxNames = boxResponse.boxes.map((box) => box.name);

				boxNames.forEach(async (box: Uint8Array) => {
					const boxData = await algokit.getAppBoxValuesFromABIType(
						{
							appId: Number(import.meta.env.VITE_APP_ID),
							boxNames: boxNames,
							type: algosdk.ABIType.from('(string,string,string,string,bool,uint64)'),
						},
						algodClient,
					);

					const profiles: Profile[] = [];
					boxData.forEach((box) => {
						const profile = convertAlgoProfile(box, '');
						profiles.push(profile);
					});
					setBoxes(profiles);
					setLoadingBoxes(false);
				});
			};
			getBox();
		}
	}, [activeAddress]);

	return (
		<section className="padding grid grid-cols-3 gap-5">
			<div className="col-span-3">
				<h2 className="font-bold text-lg mb-3">
					<TelescopeIcon className="inline-block text-neutral-600 w-6 h-6 mr-2" />
					Explore Vendors
				</h2>
			</div>
			{loadingBoxes ? (
				<>
					<Skeleton className="aspect-square" />
					<Skeleton className="aspect-square" />
					<Skeleton className="aspect-square" />
				</>
			) : (
				<>
					{boxes.length > 0 ? (
						boxes.map((profile) => (
							<div
								className="flex flex-col items-center border rounded p-5"
								key={Math.random()}
							>
								{profile?.logo ? (
									<img
										src={`${import.meta.env.VITE_PINATA_GATEWAY_URL}/ipfs/${profile?.logo}?pinataGatewayToken=${
											import.meta.env.VITE_PINATA_GATEWAY_KEY
										}`}
										alt={profile?.title}
										className="rounded-full w-24 h-24"
										onError={(e) => {
											e.currentTarget.src = 'https://placehold.co/100';
										}}
									/>
								) : (
									<div className="block shrink-0 rounded-full w-24 h-24"></div>
								)}
								<h2 className="text-lg font-bold mt-5">{profile?.title}</h2>
								<a
									href={profile?.url}
									className="text-rose-500 underline text-sm"
								>
									{profile?.url.replace('https://', '').replace('http://', '').replace('www.', '')}
								</a>
								<p className="text-neutral-600 text-sm leading-relaxed mt-5">"{profile?.description}"</p>
							</div>
						))
					) : (
						<div className="col-span-3 text-center">No vendors found.</div>
					)}
				</>
			)}
		</section>
	);
};

export default Explore;
