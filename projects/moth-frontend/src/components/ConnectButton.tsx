import React from 'react';
import { useWallet } from '@txnlab/use-wallet';
import { Button } from './ui/button';
import { MenuIcon, WalletIcon } from 'lucide-react';
import { ellipseAddress } from '@/utils/ellipseAddress';
import { AlertDialog, AlertDialogTrigger } from './ui/alert-dialog';
import ConnectDialog from './ConnectDialog';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';
import UserMenu from './UserMenu';

interface ConnectButtonProps {
	standAlone?: boolean;
}

const ConnectButton: React.FC<ConnectButtonProps> = ({ standAlone }) => {
	const { activeAddress } = useWallet();

	return (
		<div className="flex gap-1">
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
						<Button
							size={standAlone ? 'default' : 'sm'}
							className={standAlone ? 'w-full' : ''}
						>
							{standAlone && <WalletIcon className="h-4 w-4 mr-2" />}
							Connect Wallet
						</Button>
					</AlertDialogTrigger>
					<ConnectDialog />
				</AlertDialog>
			)}
		</div>
	);
};

export default ConnectButton;
