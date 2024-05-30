import React from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { Button } from './ui/button';
import { MenuIcon, WalletIcon } from 'lucide-react';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { Link } from 'react-router-dom';
import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog';
import ConnectDialog from './ConnectDialog';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserMenu from './UserMenu';

interface ConnectButtonProps {
	toggleModal: () => void;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ toggleModal }) => {
	const { activeAddress } = useWallet();
	return (
		<div className="flex gap-1">
			{/* {activeAddress && (
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
			)} */}
			{/* <Button
				size="sm"
				variant={activeAddress ? 'secondary' : 'default'}
				onClick={toggleModal}
			>
				{activeAddress ? 'Disconnect' : 'Connect Wallet'}
			</Button> */}
			{activeAddress ? (
				<>
					<div className="flex items-center text-sm text-neutral-600 mr-3 font-mono">
						<WalletIcon className="h-4 w-4 mr-2" />
						<span>{ellipseAddress(activeAddress)}</span>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								size="sm"
								variant="secondary"
							>
								<MenuIcon className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<UserMenu />
					</DropdownMenu>
				</>
			) : (
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button size="sm">Connect Wallet</Button>
					</AlertDialogTrigger>
					<ConnectDialog />
				</AlertDialog>
			)}
		</div>
	);
};

export default ConnectButton;
