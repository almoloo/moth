import React, { useEffect, useState } from 'react';
import {
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from './ui/alert-dialog';
import { useWallet, Provider } from '@txnlab/use-wallet';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Button } from './ui/button';

const ConnectDialog = () => {
	const { providers } = useWallet();
	const isKmd = (provider: Provider) => provider.metadata.name.toLowerCase() === 'kmd';
	const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

	useEffect(() => {
		if (providers) {
			setSelectedProvider(providers[0]);
		}
	}, [providers]);

	const handleProviderChange = (providerId: string) => {
		const provider = providers?.find((provider) => provider.metadata.id === providerId);
		setSelectedProvider(provider || null);
	};

	return (
		<AlertDialogContent>
			<AlertDialogHeader>
				<AlertDialogTitle>Select wallet provider</AlertDialogTitle>
				<AlertDialogDescription>
					To proceed, please select your wallet provider. This will enable secure login and transactions on our platform. Your
					wallet information will remain private and secure.
				</AlertDialogDescription>
			</AlertDialogHeader>
			<section>
				<RadioGroup
					defaultValue={selectedProvider?.metadata.id}
					className="flex flex-col gap-3"
					onValueChange={(providerId) => handleProviderChange(providerId)}
				>
					{providers?.map((provider) => (
						<Label
							htmlFor={provider.metadata.id}
							className="provider-label"
							key={provider.metadata.id}
						>
							{!isKmd(provider) && (
								<img
									alt={`wallet_icon_${provider.metadata.id}`}
									src={provider.metadata.icon}
									className="w-7 h-7 object-contain rounded mr-3"
								/>
							)}
							<span className="font-medium">{isKmd(provider) ? 'LocalNet Wallet' : provider.metadata.name}</span>
							<RadioGroupItem
								value={provider.metadata.id}
								id={provider.metadata.id}
								className="provider-radio"
							/>
						</Label>
					))}
				</RadioGroup>
			</section>
			<AlertDialogFooter>
				<AlertDialogCancel>cancel</AlertDialogCancel>
				<AlertDialogAction asChild>
					<Button
						disabled={!selectedProvider}
						onClick={() => {
							return selectedProvider?.connect();
						}}
					>
						Connect Wallet
					</Button>
				</AlertDialogAction>
			</AlertDialogFooter>
		</AlertDialogContent>
	);
};

export default ConnectDialog;
