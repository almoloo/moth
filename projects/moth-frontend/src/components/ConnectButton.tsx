import React from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { Button } from './ui/button';
import { WalletIcon } from 'lucide-react';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { Link } from 'react-router-dom';

interface ConnectButtonProps {
	toggleModal: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ toggleModal }) => {
	const { activeAddress } = useWallet();
	return (
		<div className="flex gap-1">
			{activeAddress && (
				<Button
					size="sm"
					variant="ghost"
					className="text-neutral-600"
					asChild
				>
					<Link to="/profile">
						<WalletIcon className="h-4 w-4 mr-2" />
						<span>{ellipseAddress(activeAddress)}</span>
					</Link>
				</Button>
			)}
			<Button
				size="sm"
				variant={activeAddress ? 'secondary' : 'default'}
				onClick={toggleModal}
			>
				{activeAddress ? 'Disconnect' : 'Connect Wallet'}
			</Button>
		</div>
	);
};

export default ConnectButton;
