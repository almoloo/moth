// import type { BoxValueRequestParams } from '@algorandfoundation/algokit-utils/types/app';
import * as algokit from '@algorandfoundation/algokit-utils';
import algosdk, { Algodv2 } from 'algosdk';

export const convertAlgoProfile = (profile: any, address: string) => {
	return {
		address: address,
		title: profile[0] as string,
		logo: profile[1] as string,
		description: profile[2] as string,
		url: profile[3] as string,
		loyaltyEnabled: profile[4] as boolean,
		loyaltyMultiplierEnabled: false,
		loyaltyPercentage: profile[5].toString(),
	};
};

export const fetchProfile = async (address: string, algodClient: Algodv2) => {
	return await algokit.getAppBoxValueFromABIType(
		{
			appId: Number(import.meta.env.VITE_APP_ID),
			boxName: algosdk.decodeAddress(address).publicKey,
			type: algosdk.ABIType.from('(string,string,string,string,bool,uint64)'),
		},
		algodClient,
	);
};

export const fetchProfileTransactions = async (address: string) => {
	const indexer = new algosdk.Indexer(
		import.meta.env.VITE_INDEXER_TOKEN,
		import.meta.env.VITE_ALGOD_SERVER,
		import.meta.env.VITE_INDEXER_PORT,
	);
	return await algokit.searchTransactions(
		indexer,
		(s) =>
			s.txType('pay').addressRole('receiver').address(address) &&
			s
				.txType('pay')
				.addressRole('sender')
				.address(import.meta.env.VITE_APP_ADDRESS),
	);
};
