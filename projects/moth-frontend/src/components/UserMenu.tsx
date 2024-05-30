import React from 'react';
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from './ui/dropdown-menu';
import { Link } from 'react-router-dom';
import { CircleHelpIcon, HomeIcon, LayoutDashboardIcon, LogOutIcon, UserRoundIcon } from 'lucide-react';
import { useWallet } from '@txnlab/use-wallet';

const UserMenu = () => {
	const { providers } = useWallet();
	return (
		<DropdownMenuContent className="w-[200px]">
			{/* <DropdownMenuLabel>Welcome.</DropdownMenuLabel>
			<DropdownMenuSeparator /> */}
			<DropdownMenuItem>
				<Link
					to="/"
					className="flex items-center"
				>
					<HomeIcon className="h-4 w-4 mr-2" />
					Home
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem>
				<Link
					to="/dashboard"
					className="flex items-center"
				>
					<LayoutDashboardIcon className="h-4 w-4 mr-2" />
					Dashboard
				</Link>
			</DropdownMenuItem>
			<DropdownMenuItem>
				<Link
					to="/profile"
					className="flex items-center"
				>
					<UserRoundIcon className="h-4 w-4 mr-2" />
					Edit Profile
				</Link>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>
				<Link
					className="flex items-center"
					to="/"
				>
					<CircleHelpIcon className="h-4 w-4 mr-2" />
					How to Use
				</Link>
			</DropdownMenuItem>
			<DropdownMenuSeparator />
			<DropdownMenuItem>
				<button
					className="flex items-center"
					onClick={() => {
						if (providers) {
							const activeProvider = providers.find((p) => p.isActive);
							if (activeProvider) {
								activeProvider.disconnect();
							} else {
								localStorage.removeItem('txnlab-use-wallet');
								window.location.reload();
							}
						}
					}}
				>
					<LogOutIcon className="h-4 w-4 mr-2" />
					Sign Out
				</button>
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
};

export default UserMenu;
