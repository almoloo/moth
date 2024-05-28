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
