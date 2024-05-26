export const convertAlgoProfile = (profile: any, address: string) => {
	return {
		address: address,
		title: profile.return?.[0] as string,
		logo: profile.return?.[1] as string,
		description: profile.return?.[2] as string,
		url: profile.return?.[3] as string,
		loyaltyEnabled: profile.return?.[4] as boolean,
		loyaltyMultiplierEnabled: false,
		loyaltyPercentage: profile.return?.[5].toString(),
	};
};
